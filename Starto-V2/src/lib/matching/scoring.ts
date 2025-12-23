import { FreelancerProfile, StartupProfile, StartupAIInsight } from "@prisma/client";
import { calculateDistance, getDistanceScore } from "@/lib/location";

export interface ScoredCandidate {
    candidate: FreelancerProfile & { user?: { name: string; image: string | null } };
    score: number;
    distanceKm: number;
    breakdown: {
        distance: number; // Max 50
        role: number;     // Max 20
        skill: number;    // Max 20
        rating: number;   // Max 10
    };
}

export interface ScoringContext {
    startup: StartupProfile;
    insight: StartupAIInsight | null;
}

/**
 * Calculates a deterministic match score based on the user's formula:
 * FINAL_SCORE =
 *   DistanceScore (0–50)
 * + RoleMatchScore (0–20)
 * + SkillMatchScore (0–20)
 * + RatingScore (0–10)
 */
export function calculateNearbyScore(
    candidate: FreelancerProfile,
    context: ScoringContext
): ScoredCandidate {
    const { startup, insight } = context;
    let distanceKm = 9999;
    let distanceScore = 0;

    // 1. Distance Score (0-50)
    if (startup.latitude && startup.longitude && candidate.latitude && candidate.longitude) {
        distanceKm = calculateDistance(
            startup.latitude,
            startup.longitude,
            candidate.latitude,
            candidate.longitude
        );
        distanceScore = getDistanceScore(distanceKm);
    }

    // 2. Role Match Score (0-20)
    // Based on 'headline' or 'bio' matching startup industry or desired roles
    let roleScore = 0;
    const targets = [];
    if (startup.industry) targets.push(startup.industry.toLowerCase());
    if (insight?.recommendedRoles && Array.isArray(insight.recommendedRoles)) {
        targets.push(...(insight.recommendedRoles as string[]).map(r => r.toLowerCase()));
    }

    const candidateText = (candidate.headline + " " + candidate.bio).toLowerCase();
    const hasRoleMatch = targets.some(t => candidateText.includes(t));
    if (hasRoleMatch) roleScore = 20;

    // 3. Skill Match Score (0-20)
    let skillScore = 0;
    // Compare candidate.skills with insight.gaps
    const gaps = (insight?.gaps as string[]) || [];
    if (Array.isArray(gaps) && gaps.length > 0) {
        const candidateSkills = candidate.skills.map(s => s.toLowerCase());
        const matchCount = gaps.filter(gap =>
            candidateSkills.some(skill => skill.includes(gap.toLowerCase()))
        ).length;

        // Linear scale: 1 match = 5pts, 4+ matches = 20pts
        skillScore = Math.min(matchCount * 5, 20);
    }

    // 4. Rating Score (0-10)
    // TODO: Add 'rating' to FreelancerProfile schema if not present, currently using placeholder or inferred
    // For now, let's assume valid profile completion implies some quality
    let ratingScore = 0;
    if (candidate.linkedin && candidate.portfolio) ratingScore = 10;
    else if (candidate.linkedin || candidate.portfolio) ratingScore = 5;


    const totalScore = distanceScore + roleScore + skillScore + ratingScore;

    return {
        candidate,
        score: totalScore,
        distanceKm,
        breakdown: {
            distance: distanceScore,
            role: roleScore,
            skill: skillScore,
            rating: ratingScore
        }
    };
}
