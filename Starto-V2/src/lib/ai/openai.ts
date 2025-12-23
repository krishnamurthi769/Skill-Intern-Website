
import { log, error as logError } from "@/lib/logger";

// ... existing imports ...

// ... inside generateStartupInsights ...

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface StartupProfileData {
    name: string;
    industry: string;
    stage: string;
    teamSize: string;
    goals: string;
    location: string;
    description: string;
}

export interface AIStartupInsights {
    summary: string;
    strengths: string[];
    gaps: string[];
    recommended_roles: string[];
    suggested_next_steps: string[];
}

export async function generateStartupInsights(profile: StartupProfileData): Promise<AIStartupInsights | null> {
    if (!process.env.OPENAI_API_KEY) {
        logError("AI_CONFIG_ERROR", "Missing OPENAI_API_KEY");
        return null;
    }

    const prompt = `
    Analyze Startup:
    Name: ${profile.name}
    Ind: ${profile.industry}
    Stg: ${profile.stage}
    Loc: ${profile.location}
    Desc: ${profile.description}
    Goal: ${profile.goals}
    
    Task: Strategic Analysis.
    Return strictly JSON:
    {
      "summary": "1 sentence potential summary.",
      "strengths": ["3 key strengths"],
      "gaps": ["3 risks/missing areas"],
      "recommended_roles": ["3 specific roles to hire next"],
      "suggested_next_steps": ["3 actionable steps"]
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Expert VC Consultant. Be sharp, critical, concise." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            logError("AI_EMPTY_CONTENT", "No content returned");
            return null;
        }

        return JSON.parse(content) as AIStartupInsights;
    } catch (error) {
        logError("AI_GENERATION_ERROR", error);
        return null;
    }
}

export async function generateMatchExplanations(
    startupContext: StartupProfileData,
    candidates: { id: string; name: string; skills: string[]; bio: string }[]
): Promise<Record<string, string> | null> {
    if (!process.env.OPENAI_API_KEY) return null;

    if (candidates.length === 0) return {};

    const candidatesJson = JSON.stringify(candidates.map(c => ({
        id: c.id,
        role: c.bio?.slice(0, 60), // Short bio context
        skills: c.skills.slice(0, 5).join(", ") // Top 5 skills only
    })));

    const prompt = `
    Startup: ${startupContext.stage}, ${startupContext.industry}, ${startupContext.goals}
    Candidates: ${candidatesJson}
    
    Explain specific fit for each candidate in ONE sentence.
    Avoid generic praise. Focus on industry/stage fit (e.g. "Previous fintech experience fits your payments roadmap").
    
    Return strictly JSON:
    {
      "candidate_id": "Reason string..."
    }
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Recruitment Expert. Concise reasoning only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) return null;

        return JSON.parse(content) as Record<string, string>;
    } catch (error) {
        console.error("Error generating match explanations:", error);
        return null;
    }
}

export async function generateInvestorMatchExplanations(
    startupContext: StartupProfileData,
    investors: { id: string; name: string; type: string; sectors: string[]; stages: string[]; ticketSize: string | null }[]
): Promise<Record<string, string> | null> {
    if (!process.env.OPENAI_API_KEY) return null;

    if (investors.length === 0) return {};

    const investorsJson = JSON.stringify(investors.map(i => ({
        id: i.id,
        type: i.type,
        focus: i.sectors.join(", "),
        stages: i.stages.join(", "),
        ticket: i.ticketSize
    })));

    const prompt = `
    Startup: ${startupContext.stage}, ${startupContext.industry}, ${startupContext.goals}
    Investors: ${investorsJson}
    
    Explain strategic fit in ONE sentence. Focus on sector, stage, or ticket alignment.
    
    Return strictly JSON:
    {
      "investor_id": "Reason string..."
    }
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "VC Matchmaker. Data-driven reasoning." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) return null;

        return JSON.parse(content) as Record<string, string>;
    } catch (error) {
        console.error("Error generating investor match explanations:", error);
        return null;
    }
}
