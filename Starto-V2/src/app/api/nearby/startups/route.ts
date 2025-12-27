// src/app/api/nearby/startups/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
            whereClause += ` AND u.city ILIKE '${c}%' `;
        }

        const industry = url.searchParams.get("industry") || "";
        if (industry) {
            const i = industry.replace(/'/g, "''");
            whereClause += ` AND s.industry ILIKE '${i}%' `;
        }

        // Raw SQL for JOIN: User (Location) + StartupProfile (Details)
        const sql = `
            SELECT 
                s.id, s."ownerId", s.name, s.valuation, s."pitchDeck", 
                u.city, u.latitude, u.longitude,
                s.industry, s.stage, s."oneLiner",
                (
                    6371 * acos(
                        cos(radians($1)) *
                        cos(radians(u.latitude)) *
                        cos(radians(u.longitude) - radians($2)) +
                        sin(radians($1)) * sin(radians(u.latitude))
                    )
                ) AS distance_km
            FROM "StartupProfile" s
            JOIN "User" u ON s."ownerId" = u.id
            WHERE u.latitude IS NOT NULL AND u.longitude IS NOT NULL
            ${whereClause}
            AND (
                6371 * acos(
                    cos(radians($1)) *
                    cos(radians(u.latitude)) *
                    cos(radians(u.longitude) - radians($2)) +
                    sin(radians($1)) * sin(radians(u.latitude))
                )
            ) <= $3
            ORDER BY distance_km ASC
            LIMIT $4;
        `;

        // HAVING clause is cleaner but some Postgres versions/configs act up with calculated aliases in HAVING 
        // without grouping or re-stating formula. 
        // Re-stating formula in WHERE/AND is safer for simple queries like this.
        // Actually, $queryRawUnsafe parameter usage: lat($1), lng($2), radius($3), limit($4)

        const rows = await prisma.$queryRawUnsafe(sql, lat, lng, radius, limit);

        return NextResponse.json({ data: rows });
    } catch (err) {
        logError("NEARBY_STARTUPS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
