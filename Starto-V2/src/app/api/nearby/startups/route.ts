// src/app/api/nearby/startups/route.ts
import { NextResponse } from "next/server";
import { queryNearbyRaw } from "@/lib/location-utils";
import { log, error as logError } from "@/lib/logger";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const lat = parseFloat(url.searchParams.get("lat") || "");
        const lng = parseFloat(url.searchParams.get("lng") || "");
        const radius = parseFloat(url.searchParams.get("radius") || "5"); // km
        const city = url.searchParams.get("city") || "";
        const limit = parseInt(url.searchParams.get("limit") || "100", 10);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return NextResponse.json({ error: "lat & lng are required" }, { status: 400 });
        }

        let whereClause = "";
        if (city) {
            const c = city.replace(/'/g, "''");
            whereClause += ` AND city ILIKE '${c}%' `;
        }

        const industry = url.searchParams.get("industry") || "";
        if (industry) {
            const i = industry.replace(/'/g, "''");
            whereClause += ` AND industry ILIKE '${i}%' `;
        }

        const rows = await queryNearbyRaw({
            tableName: "StartupProfile",
            lat,
            lng,
            radiusKm: radius,
            columns: "id, ownerId, name, valuation, pitchDeck, address, city, latitude, longitude",
            whereClause,
            limit,
        }) as any[];

        return NextResponse.json({ data: rows });
    } catch (err) {
        logError("NEARBY_STARTUPS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
