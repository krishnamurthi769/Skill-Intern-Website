
import { FreelancerProfile, InvestorProfile, StartupProfile, StartupAIInsight } from "@prisma/client";

// Define strict types for the input
export interface MatchCandidate {
    freelancer: FreelancerProfile & { user?: { name: string; image: string | null } };
    score: number;
    breakdown: {
        base: number;
        skillMatch: number;
        roleMatch: number;
        locationMatch: number;
        experienceMatch: number;
    };
}

export interface MatchingContext {
    startup: StartupProfile;
    insight: StartupAIInsight | null;
}

/**
 * Calculates a deterministic match score (0-100) for a freelancer against a startup context.
 */
export function calculateMatchScore(
    freelancer: FreelancerProfile,
    context: MatchingContext
): MatchCandidate {
    let score = 50; // Base Score
    const breakdown = { base: 50, skillMatch: 0, roleMatch: 0, locationMatch: 0, experienceMatch: 0 };

    const { startup, insight } = context;

    // 1. Skill Match (+20)
    let relevantKeywords: string[] = [];

    if (insight) {
        if (Array.isArray(insight.gaps)) {
            relevantKeywords.push(...(insight.gaps as any[]).map((g: any) => String(g).toLowerCase()));
        }
        if (Array.isArray(insight.recommendedRoles)) {
            relevantKeywords.push(...(insight.recommendedRoles as any[]).map((r: any) => String(r).toLowerCase()));
        }
    }

    if (startup.industry) relevantKeywords.push(startup.industry.toLowerCase());

    const freelancerSkills = freelancer.skills.map(s => s.toLowerCase());
    const freelancerBio = (freelancer.bio || "").toLowerCase();

    // Check overlap
    const hasSkillMatch = relevantKeywords.some(keyword => {
        return freelancerSkills.some(skill => skill.includes(keyword)) || freelancerBio.includes(keyword);
    });

    if (hasSkillMatch) {
        score += 20;
        breakdown.skillMatch = 20;
    }

    // 2. Direct Role Match (+20)
    // Refined Logic: If they have > 2 matching keywords or strong skill overlap
    const matchCount = relevantKeywords.reduce((count, keyword) => {
        const match = freelancerSkills.some(skill => skill.includes(keyword)) || freelancerBio.includes(keyword);
        return count + (match ? 1 : 0);
    }, 0);

    if (matchCount >= 2) {
        score += 20;
        breakdown.roleMatch = 20;
    }

    // 3. Location Match (+15, +10, +5)
    // Tiered Decay
    if (startup.country && freelancer.country && startup.country === freelancer.country) {
        // Base bonus for same country (legal/timezone)
        score += 5;
        breakdown.locationMatch = 5;

        // Add granular distance bonus if coords available
        if (startup.latitude && startup.longitude && freelancer.latitude && freelancer.longitude) {
            const dist = getDistanceFromLatLonInKm(
                startup.latitude, startup.longitude,
                freelancer.latitude, freelancer.longitude
            );

            if (dist < 10) {
                score += 10; // Total +15 (5 country + 10 dist)
                breakdown.locationMatch += 10;
            } else if (dist < 50) {
                score += 5; // Total +10 (5 country + 5 dist)
                breakdown.locationMatch += 5;
            }
        }
    }


    // 4. Experience vs Stage Fit (+5)
    // Smart Inference: Cost Proxy & Culture Fit
    // Idea/MVP -> Junior/Mid (Agile, cheaper)
    // Growth/Scale -> Senior/Expert (Experience, leadership)
    const stage = String(startup.stage || "").toUpperCase();
    const exp = String(freelancer.experience || "").toUpperCase(); // JUNIOR, MID, SENIOR, EXPERT

    if (["IDEA", "MVP", "PRE_SEED", "SEED"].includes(stage)) { // Combined some standard stage names just in case
        if (["JUNIOR", "MID"].includes(exp)) {
            score += 5;
            breakdown.experienceMatch = 5;
        }
    } else if (["GROWTH", "SCALE", "SERIES_A", "SERIES_B"].includes(stage)) {
        if (["SENIOR", "EXPERT"].includes(exp)) {
            score += 5;
            breakdown.experienceMatch = 5;
        }
    }

    score = Math.min(score, 100);

    if (process.env.NODE_ENV === "development") {
        console.log(`[MATCH DEBUG] Freelancer ${freelancer.id} Score: ${score}`, breakdown);
    }

    return {
        freelancer,
        score,
        breakdown
    };
}

// Haversine Formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

export interface InvestorMatchCandidate {
    investor: InvestorProfile & { user?: { name: string; image: string | null } };
    score: number;
    breakdown: {
        base: number;
        industryMatch: number;
        stageMatch: number;
        locationMatch: number;
        ticketMatch: number;
    };
}

export function calculateInvestorMatchScore(
    investor: InvestorProfile,
    startup: StartupProfile
): InvestorMatchCandidate {
    let score = 50; // Base Score
    const breakdown = { base: 50, industryMatch: 0, stageMatch: 0, locationMatch: 0, ticketMatch: 0 };

    // 1. Industry Match (+20)
    const startupIndustry = (startup.industry || "").toLowerCase();
    // investor.sectors is String[]
    const hasIndustryMatch = investor.sectors.some(s => s.toLowerCase().includes(startupIndustry) || startupIndustry.includes(s.toLowerCase()));

    if (hasIndustryMatch && startupIndustry.length > 0) {
        score += 20;
        breakdown.industryMatch = 20;
    }

    // 2. Stage Match (+15)
    // startup.stage (Enum) vs investor.stages (Enum Array)
    const startupStage = String(startup.stage || "").toUpperCase(); // Ensure Enum format
    // investor.stages is Array of Enums (Strings in runtime)
    const hasStageMatch = investor.stages.some(s => String(s).toUpperCase() === startupStage);

    if (hasStageMatch && startupStage.length > 0) {
        score += 15;
        breakdown.stageMatch = 15;
    }

    // 3. Ticket Size Smart Match (+20)
    // Inferred Ask based on Stage
    let inferredMin = 0;
    let inferredMax = 0;

    switch (startupStage) {
        case "IDEA":
        case "PRE_SEED":
            inferredMin = 25000;
            inferredMax = 250000;
            break;
        case "MVP":
        case "SEED":
            inferredMin = 250000;
            inferredMax = 1000000;
            break;
        case "GROWTH":
        case "SERIES_A":
            inferredMin = 1000000;
            inferredMax = 5000000;
            break;
        case "SCALE":
        case "SERIES_B":
            inferredMin = 5000000;
            inferredMax = 50000000; // Cap at 50M
            break;
        default:
            // Fallback if stage unknown or custom
            inferredMin = 100000;
            inferredMax = 500000;
    }

    // Check overlap with Investor Range
    // Investor range: minTicketSize - maxTicketSize
    // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
    if (investor.minTicketSize && investor.maxTicketSize) {
        const invMin = investor.minTicketSize;
        const invMax = investor.maxTicketSize;

        const isOverlap = (invMin <= inferredMax) && (invMax >= inferredMin);

        if (isOverlap) {
            score += 20;
            breakdown.ticketMatch = 20;
        }
    } else if (investor.minTicketSize) {
        // Open ended max
        if (investor.minTicketSize <= inferredMax) {
            score += 20;
            breakdown.ticketMatch = 20;
        }
    }


    // 4. Location Match (+5)
    if (startup.country && investor.country && startup.country === investor.country) {
        score += 5;
        breakdown.locationMatch = 5;
    }

    score = Math.min(score, 100);

    if (process.env.NODE_ENV === "development") {
        console.log(`[MATCH DEBUG] Investor ${investor.id} Score: ${score}`, breakdown);
    }

    return {
        investor,
        score,
        breakdown
    };
}
