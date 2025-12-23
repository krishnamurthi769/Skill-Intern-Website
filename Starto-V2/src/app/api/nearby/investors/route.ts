// src/app/api/nearby/investors/route.ts
import { NextResponse } from "next/server";
import { queryNearbyRaw } from "@/lib/location-utils";
import { error as logError } from "@/lib/logger";

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

        const stage = url.searchParams.get("stage") || "";
        if (stage) {
            const s = stage.replace(/'/g, "''");
            // stages is string[]
            whereClause += ` AND '${s}' = ANY(stages) `;
        }

        const rows: any[] = await queryNearbyRaw({
            tableName: "InvestorProfile",
            lat,
            lng,
            radiusKm: radius,
            columns: "id, userId, firmName, bio, minCheque, address, city, latitude, longitude",
            whereClause,
            limit,
        });

        return NextResponse.json({ data: rows });
    } catch (err) {
        logError("NEARBY_INVESTORS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
