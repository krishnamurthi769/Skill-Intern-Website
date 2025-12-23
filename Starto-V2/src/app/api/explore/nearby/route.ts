import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateNearbyScore, ScoredCandidate } from "@/lib/matching/scoring";
import { generateMatchExplanations, StartupProfileData } from "@/lib/ai/openai";
import { addHours } from "date-fns";
import { log, error as logError } from "@/lib/logger";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const targetRole = searchParams.get("role") || "freelancer"; // Default to freelancer
        const radius = parseFloat(searchParams.get("radius") || "50"); // Default 50km

        const userId = session.user.id;

        // 1. Fetch Requesting User's Profile (Assuming Startup for now as per user flow)
        // TODO: Make this dynamic if Freelancers can explore Startups
        const startup = await prisma.startupProfile.findUnique({
            where: { ownerId: userId },
            include: { aiInsight: true }
        });

        if (!startup) {
            return NextResponse.json({ error: "Startup profile not found. Please complete onboarding." }, { status: 404 });
        }

        if (!startup.latitude || !startup.longitude) {
            return NextResponse.json({
                error: "Location not set",
                code: "LOCATION_MISSING",
                message: "Please update your location in settings to find nearby talent."
            }, { status: 400 });
        }

        // 2. Fetch Candidates
        // MVP: Fetch all active freelancers. 
        // PRODUCTION NOTE: This should use PostGIS or bounding box query in future.
        let freelancers = await prisma.freelancerProfile.findMany({
            include: {
                user: { select: { name: true, image: true } }
            }
        });

        // 3. Process Candidates (Distance & Scoring)
        const context = {
            startup: startup,
            insight: startup.aiInsight
        };

        let scoredCandidates: ScoredCandidate[] = freelancers.map(f =>
            calculateNearbyScore(f, context)
        );

        // 4. Filtering & Bucketing
        // Filter out those > radius (default 50km) as per user's "LOW PRIORITY (or hide)" rule
        // User said: "> 50 km → LOW PRIORITY (or hide)". 
        // Implementation: We will hide > radius to keep list relevant.
        scoredCandidates = scoredCandidates.filter(c => c.distanceKm <= radius);

        // Sort by Score Descending
        scoredCandidates.sort((a, b) => b.score - a.score);

        // Top 50 results to return to frontend
        const results = scoredCandidates.slice(0, 50);

        // 5. AI Explanation (Top 5 Only)
        const topMatches = results.slice(0, 5);
        let explanations: Record<string, string> | null = null;

        // Check if we need to generate explanations (or if we have cached ones)
        // For MVP, we'll generate live if not too many. To save cost, we could cache.
        // User said: "Step H — CACHE RESULTS".
        // Let's implement caching via MatchRecommendation logic.

        // We will try to fetch existing explanations from DB first? 
        // Actually, the user flow says: Calc Distance -> Score -> AI Explanation -> Cache.
        // So we should see if we already have a valid recommendation for these.

        // Let's skip complex cache read check for now to ensure fresh distance calculation, 
        // but we WILL save to cache.

        if (topMatches.length > 0) {
            const startupContext: StartupProfileData = {
                name: startup.name,
                industry: startup.industry || "Unknown",
                stage: startup.stage || "Early",
                teamSize: startup.teamSize || "Founding Team",
                goals: startup.fundingNeeded ? "Fundraising" : "Growth",
                location: [startup.city, startup.country].join(", ") || "Remote",
                description: startup.description || ""
            };

            explanations = await generateMatchExplanations(
                startupContext,
                topMatches.map(m => ({
                    id: m.candidate.id,
                    name: m.candidate.user?.name || "Candidate",
                    skills: m.candidate.skills,
                    bio: m.candidate.bio || ""
                }))
            );
        }

        // 6. Cache Results (Background-like operation)
        const expiresAt = addHours(new Date(), 24);
        // We only cache the top matches that got AI explanations
        if (explanations) {
            // Use transaction to upsert/replace
            // Note: DB writes can be slow, maybe fire and forget? 
            // Better to await for data integrity in this MVP.
            await prisma.$transaction(async (tx) => {
                for (const match of topMatches) {
                    // Try to finding existing to update or create new
                    const reason = explanations?.[match.candidate.id] || "Strong match based on location and skills.";

                    // Upsert is tricky with unique constraint, so we delete/create or use valid upsert
                    // Schema: @@unique([startupId, freelancerId])
                    await tx.matchRecommendation.upsert({
                        where: {
                            startupId_freelancerId: {
                                startupId: startup.id,
                                freelancerId: match.candidate.id
                            }
                        },
                        update: {
                            matchScore: match.score,
                            reason: reason,
                            expiresAt: expiresAt,
                            version: { increment: 1 }
                        },
                        create: {
                            startupId: startup.id,
                            freelancerId: match.candidate.id,
                            matchScore: match.score,
                            reason: reason,
                            expiresAt: expiresAt,
                        }
                    });
                }
            });
        }

        // 7. Format Response
        const formattedResults = results.map(m => ({
            id: m.candidate.id,
            userId: m.candidate.userId,
            name: m.candidate.user?.name,
            image: m.candidate.user?.image,
            headline: m.candidate.headline,
            skills: m.candidate.skills,
            matchScore: m.score,
            distanceKm: Math.round(m.distanceKm * 10) / 10, // 1 decimal place
            reason: explanations?.[m.candidate.id] || (m.candidate.bio ? `${m.candidate.bio.substring(0, 60)}...` : "Matched by skills & location"),
            location: {
                city: m.candidate.city,
                state: m.candidate.state,
                country: m.candidate.country,
                lat: m.candidate.latitude,
                lng: m.candidate.longitude
            }
        }));

        log("EXPLORE_NEARBY", { userId, count: formattedResults.length, role: targetRole });

        return NextResponse.json({
            matches: formattedResults,
            metadata: {
                radius: radius,
                userLocation: {
                    lat: startup.latitude,
                    lng: startup.longitude,
                    city: startup.city
                }
            }
        });

    } catch (error) {
        logError("EXPLORE_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
