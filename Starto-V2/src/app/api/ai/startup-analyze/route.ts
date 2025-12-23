
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStartupInsights, StartupProfileData } from "@/lib/ai/openai";
import { NextResponse } from "next/server";
import { log, error as logError } from "@/lib/logger";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch Startup Profile + existing insights
        const startupProfile = await prisma.startupProfile.findUnique({
            where: { ownerId: userId },
            include: { aiInsight: true }
        });

        if (!startupProfile) {
            return NextResponse.json({ error: "Startup profile not found" }, { status: 404 });
        }

        if (!startupProfile.aiInsight) {
            return NextResponse.json(null); // No insights yet
        }

        // Map DB model to frontend interface
        return NextResponse.json({
            summary: startupProfile.aiInsight.summary,
            strengths: startupProfile.aiInsight.strengths,
            gaps: startupProfile.aiInsight.gaps,
            recommended_roles: startupProfile.aiInsight.recommendedRoles,
            suggested_next_steps: startupProfile.aiInsight.suggestedNextSteps,
            lastUpdated: startupProfile.aiInsight.updatedAt
        });

    } catch (error) {
        logError("AI_FETCH_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Verify API Key
        if (!process.env.OPENAI_API_KEY) {
            logError("AI_CONFIG_ERROR", "OPENAI_API_KEY missing");
            return NextResponse.json({ error: "OpenAI API Key missing on server" }, { status: 500 });
        }

        const userId = session.user.id;

        // 2. Fetch Startup Profile
        const startupProfile = await prisma.startupProfile.findUnique({
            where: { ownerId: userId },
        });

        // 3. Log Startup Data
        log("AI_STARTUP_DATA", startupProfile);

        if (!startupProfile) {
            return NextResponse.json({ error: "Startup profile not found" }, { status: 404 });
        }

        // 4. Construct data for AI (Safe Fallbacks)
        const profileData: StartupProfileData = {
            name: startupProfile.name || "Unnamed Startup",
            industry: startupProfile.industry || "General Tech",
            stage: startupProfile.stage || "Idea Stage",
            teamSize: startupProfile.teamSize || "1-5",
            goals: startupProfile.fundingNeeded ? "Fundraising" : "Bootstrapping & Growth",
            location: [startupProfile.city, startupProfile.country].filter(Boolean).join(", ") || "Remote",
            description: startupProfile.description || startupProfile.oneLiner || "A technology startup.",
        };

        log("AI_PROMPT_DATA", profileData);

        // 5. Generate Insights
        const insights = await generateStartupInsights(profileData);

        if (!insights) {
            logError("AI_NULL_RESPONSE", "AI returned null insights");
            return NextResponse.json({ error: "Failed to generate insights from AI" }, { status: 500 });
        }

        // 6. Save to DB (Upsert) - Verify Model Name
        // Model: StartupAIInsight -> Client: startupAIInsight
        const savedInsight = await prisma.startupAIInsight.upsert({
            where: { startupId: startupProfile.id },
            update: {
                summary: insights.summary,
                strengths: insights.strengths,
                gaps: insights.gaps,
                recommendedRoles: insights.recommended_roles,
                suggestedNextSteps: insights.suggested_next_steps,
            },
            create: {
                startupId: startupProfile.id,
                summary: insights.summary,
                strengths: insights.strengths,
                gaps: insights.gaps,
                recommendedRoles: insights.recommended_roles,
                suggestedNextSteps: insights.suggested_next_steps,
            }
        });

        // Return with lastUpdated
        return NextResponse.json({
            ...insights,
            lastUpdated: savedInsight.updatedAt
        });

    } catch (error: any) {
        logError("AI_ANALYZE_ERROR", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
