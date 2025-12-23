import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lat, lng, placeId, industry, budget, cityType, anonId } = body;

        const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Server API Key missing" }, { status: 500 });
        }

        // Helper to fetch count of places by type/keyword
        async function getPlaceCount(type: string, keyword?: string): Promise<number> {
            try {
                // Using Google Places API (New) or Nearby Search
                const radius = 2000; // 2km radius
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}${keyword ? `&keyword=${keyword}` : ""}&key=${apiKey}`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.status === "OK" || data.status === "ZERO_RESULTS") {
                    return Math.min(data.results.length, 20); // API returns max 20 per page
                }
                console.error("Places API Error:", data.status);
                return 0;
            } catch (e) {
                console.error("Fetch Error:", e);
                return 0;
            }
        }

        // Parallel Fetch for "Real World" Signals
        const [coworkingCount, investorCount, techCount] = await Promise.all([
            getPlaceCount("coworking_space", "coworking"),
            getPlaceCount("finance", "investment"), // Proxy for investors
            getPlaceCount("software_company") // Proxy for startups
        ]);

        // Calculate Scores based on Real Data
        // 1. Demand: Correlated with Tech density & Coworking (ecosystem buzz)
        const demandScore = Math.min(10, Math.floor((coworkingCount * 2 + techCount) / 3));
        let demandLabel = demandScore > 7 ? "High" : demandScore > 3 ? "Medium" : "Low";

        // 2. Competition: Correlated with existing similar businesses
        // Simple heuristic: If many tech companies + High Budget input = High Competition
        let competitionLabel = "Medium";
        if (techCount > 10) competitionLabel = "High";
        if (techCount < 3) competitionLabel = "Low";

        // 3. Risk: Inverse of Ecosystem strength (More ecosystem = Less Risk usually, unless saturated)
        let riskLabel = "Low";
        if (coworkingCount === 0 && techCount === 0) riskLabel = "High"; // No ecosystem = High Risk
        else if (competitionLabel === "High" && budget === "Low") riskLabel = "High"; // High competition + Low budget = High Risk

        // Final Score (0-100)
        let totalScore = 50 + (coworkingCount * 5) + (techCount * 2);
        if (riskLabel === "High") totalScore -= 20;
        if (demandLabel === "High") totalScore += 10;
        totalScore = Math.min(98, Math.max(10, totalScore));

        return NextResponse.json({
            competition: competitionLabel,
            demand: demandLabel,
            risk: riskLabel,
            score: totalScore,
            analysisType: "Real-time Signals",
            ecosystem: {
                coworking: coworkingCount,
                investors: investorCount,
                startups: techCount
            }
        });

    } catch (error) {
        console.error("Analysis API Error:", error);
        return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
}
