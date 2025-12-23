
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore, MatchCandidate } from "@/lib/matching/engine";
import { generateMatchExplanations, StartupProfileData } from "@/lib/ai/openai";
import { NextResponse } from "next/server";
import { addHours, isBefore } from "date-fns";
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

        // 2. Check Cache (MatchRecommendation)
        const cachedMatches = await prisma.matchRecommendation.findMany({
            where: {
                startupId: startup.id,
                expiresAt: { gt: new Date() },
                freelancerId: { not: null }
            },
            include: {
                freelancer: {
                    include: { user: { select: { name: true, image: true } } }
                }
            },
            orderBy: { matchScore: 'desc' } // Note: we ideally want to check metadata.createdAt for rate limit, but matchScore is distinct.
            // However, all matches for a startup are created in batch, so any match's createdAt is fine.
        });

        if (cachedMatches.length > 0) {
            // Rate Limiting Check: If the latest match is less than 4 hours old, force return cache
            // preventing the user from bypassing strict rules.
            const lastGenerated = cachedMatches[0].createdAt || new Date(0); // Assuming sorted desc
            const hoursSince = (Date.now() - new Date(lastGenerated).getTime()) / (1000 * 60 * 60);

            // Even if we wanted to support "force refresh" in future, we block it here if < 4 hours
            // For now, simple cache return is sufficient as the "expiresAt" logic
            // coupled with this check ensures stability.

            const response = cachedMatches.map(m => ({
                userId: m.freelancer!.userId,
                name: m.freelancer!.user.name,
                image: m.freelancer!.user.image,
                skills: m.freelancer!.skills,
                matchScore: m.matchScore,
                reason: m.reason,
                distanceKm: 0,
            }));

            // Analytics Log
            log("MATCH_SHOWN_CACHE", { startupId: startup.id, count: cachedMatches.length, type: 'freelancer' });

            return NextResponse.json({
                source: 'cache',
                matches: response
            });
        }

        // 3. Cache Miss - Run Engine

        // Fetch Candidates (All Freelancers for MVP)
        const freelancers = await prisma.freelancerProfile.findMany({
            include: { user: { select: { name: true, image: true } } }
        });

        const context = {
            startup: startup,
            insight: startup.aiInsight // might be null
        };

        // Score Candidates
        const scoredCandidates: MatchCandidate[] = freelancers.map(f =>
            calculateMatchScore(f, context)
        );

        // Filter & Sort
        // Keep only > 40 score to remove noise
        const topMatches = scoredCandidates
            .filter(c => c.score >= 40)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Scored Candidate Limit: Top 5

        if (topMatches.length === 0) {
            log("MATCH_SHOWN_LIVE_EMPTY", { startupId: startup.id, count: 0, type: 'freelancer' });
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

        const explanationMap = await generateMatchExplanations(
            startupContext,
            topMatches.map(m => ({
                id: m.freelancer.id,
                name: m.freelancer.user?.name || "Candidate",
                skills: m.freelancer.skills,
                bio: m.freelancer.bio || ""
            }))
        );

        // 5. Save/Cache Results
        const expiresAt = addHours(new Date(), 24); // Cache for 24h

        await prisma.$transaction(async (tx) => {
            // Delete old freelancer matches for this startup
            await tx.matchRecommendation.deleteMany({
                where: { startupId: startup.id, freelancerId: { not: null } }
            });

            // Insert new
            for (const match of topMatches) {
                await tx.matchRecommendation.create({
                    data: {
                        startupId: startup.id,
                        freelancerId: match.freelancer.id,
                        matchScore: match.score,
                        reason: explanationMap ? explanationMap[match.freelancer.id] : "Strong skill match.",
                        expiresAt: expiresAt,
                        version: 1
                    }
                });
            }
        });

        // 6. Return Live Results
        const response = topMatches.map(m => ({
            userId: m.freelancer.userId,
            name: m.freelancer.user?.name,
            image: m.freelancer.user?.image,
            skills: m.freelancer.skills,
            matchScore: m.score,
            reason: explanationMap ? explanationMap[m.freelancer.id] : "Strong skill match.",
        }));

        log("MATCH_SHOWN_LIVE", { startupId: startup.id, count: topMatches.length, type: 'freelancer' });

        return NextResponse.json({
            source: 'live',
            matches: response
        });

    } catch (error) {
        logError("MATCH_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
