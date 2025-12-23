
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateInvestorMatchScore, InvestorMatchCandidate } from "@/lib/matching/engine";
import { generateInvestorMatchExplanations, StartupProfileData } from "@/lib/ai/openai";
import { NextResponse } from "next/server";
import { addHours } from "date-fns";
import { log, error as logError } from "@/lib/logger";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // 1. Fetch Startup Profile & Insights
        const startup = await prisma.startupProfile.findUnique({
            where: { ownerId: userId },
            include: { aiInsight: true }
        });

        if (!startup) {
            return NextResponse.json({ error: "Startup profile not found" }, { status: 404 });
        }

        // 2. Check Cache
        const cachedMatches = await prisma.matchRecommendation.findMany({
            where: {
                startupId: startup.id,
                expiresAt: { gt: new Date() },
                investorId: { not: null } // Only investor matches
            },
            include: {
                investor: {
                    include: { user: { select: { name: true, image: true } } }
                }
            },
            orderBy: { matchScore: 'desc' } // Using matchScore sort, but createdAt matches batch simple check
        });

        if (cachedMatches.length > 0) {

            // Rate Limiting Check
            const lastGenerated = cachedMatches[0].createdAt || new Date(0);
            const hoursSince = (Date.now() - new Date(lastGenerated).getTime()) / (1000 * 60 * 60);

            const response = cachedMatches.map(m => ({
                userId: m.investor!.userId,
                name: m.investor!.user.name || m.investor!.firmName || "Investor",
                image: m.investor!.user.image,
                skills: m.investor!.sectors, // Reuse 'skills' field for sectors to reuse frontend component
                matchScore: m.matchScore,
                reason: m.reason,
                distanceKm: 0,
            }));

            log("MATCH_SHOWN_CACHE", { startupId: startup.id, count: cachedMatches.length, type: 'investor' });
            return NextResponse.json({
                source: 'cache',
                matches: response
            });
        }

        // 3. Cache Miss - Run Engine
        const investors = await prisma.investorProfile.findMany({
            include: { user: { select: { name: true, image: true } } }
        });

        // Score Candidates
        const scoredCandidates: InvestorMatchCandidate[] = investors.map(i =>
            calculateInvestorMatchScore(i, startup)
        );

        // Filter & Sort
        const topMatches = scoredCandidates
            .filter(c => c.score >= 40)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        if (topMatches.length === 0) {
            log("MATCH_SHOWN_LIVE_EMPTY", { startupId: startup.id, count: 0, type: 'investor' });
            return NextResponse.json({ source: 'live', matches: [] });
        }

        // 4. AI Explanation
        const startupContext: StartupProfileData = {
            name: startup.name,
            industry: startup.industry || "Unknown",
            stage: startup.stage || "Early",
            teamSize: startup.teamSize || "Founding Team",
            goals: startup.fundingNeeded ? "Fundraising" : "Growth",
            location: [startup.city, startup.country].join(", ") || "Remote",
            description: startup.description || ""
        };

        const explanationMap = await generateInvestorMatchExplanations(
            startupContext,
            topMatches.map(m => ({
                id: m.investor.id,
                name: m.investor.user?.name || m.investor.firmName || "Investor",
                type: m.investor.investorType || "Investor",
                sectors: m.investor.sectors,
                stages: m.investor.stages,
                ticketSize: m.investor.minTicketSize ? `$${m.investor.minTicketSize / 1000}k+` : "Undisclosed"
            }))
        );

        // 5. Save/Cache Results
        const expiresAt = addHours(new Date(), 24);

        await prisma.$transaction(async (tx) => {
            // Delete old investor matches for this startup
            // Since we upgraded schema, we need to be careful not to delete freelancer matches
            // So delete where investorId is NOT null
            await tx.matchRecommendation.deleteMany({
                where: {
                    startupId: startup.id,
                    investorId: { not: null }
                }
            });

            for (const match of topMatches) {
                await tx.matchRecommendation.create({
                    data: {
                        startupId: startup.id,
                        investorId: match.investor.id,
                        matchScore: match.score,
                        reason: explanationMap ? explanationMap[match.investor.id] : "Strong strategic fit.",
                        expiresAt: expiresAt,
                        version: 1
                    }
                });
            }
        });

        // 6. Return Live Results
        const response = topMatches.map(m => ({
            userId: m.investor.userId,
            name: m.investor.user?.name || m.investor.firmName || "Investor",
            image: m.investor.user?.image,
            skills: [m.investor.investorType, ...m.investor.sectors].filter(Boolean) as string[], // Map sectors + type to skills
            matchScore: m.score,
            reason: explanationMap ? explanationMap[m.investor.id] : "Strong strategic fit.",
        }));

        log("MATCH_SHOWN_LIVE", { startupId: startup.id, count: topMatches.length, type: 'investor' });
        return NextResponse.json({
            source: 'live',
            matches: response
        });

    } catch (error) {
        logError("MATCH_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
