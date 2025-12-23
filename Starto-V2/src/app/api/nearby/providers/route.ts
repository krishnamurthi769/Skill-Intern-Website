// src/app/api/nearby/providers/route.ts
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

        const spaceType = url.searchParams.get("spaceType") || "";
        if (spaceType) {
            const st = spaceType.replace(/'/g, "''");
            whereClause += ` AND "providerType" ILIKE '${st}%' `;
        }

        const rows: any[] = await queryNearbyRaw({
            tableName: "ProviderProfile",
            lat,
            lng,
            radiusKm: radius,
            columns: "id, userId, companyName, description, address, city, latitude, longitude",
            whereClause,
            limit,
        });

        return NextResponse.json({ data: rows });
    } catch (err) {
        logError("NEARBY_PROVIDERS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
