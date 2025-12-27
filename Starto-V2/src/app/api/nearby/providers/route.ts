// src/app/api/nearby/providers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
            whereClause += ` AND u.city ILIKE '${c}%' `;
        }

        const spaceType = url.searchParams.get("spaceType") || "";
        if (spaceType) {
            const st = spaceType.replace(/'/g, "''");
            whereClause += ` AND p."providerType" ILIKE '${st}%' `;
        }

        const sql = `
            SELECT 
                p.id, p."userId", p."companyName", p.description, p."providerType", p.capacity, p."minPrice",
                u.name, u.image, u.city, u.latitude, u.longitude,
                (
                    6371 * acos(
                        cos(radians($1)) *
                        cos(radians(u.latitude)) *
                        cos(radians(u.longitude) - radians($2)) +
                        sin(radians($1)) * sin(radians(u.latitude))
                    )
                ) AS distance_km
            FROM "ProviderProfile" p
            JOIN "User" u ON p."userId" = u.id
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

        const rows = await prisma.$queryRawUnsafe(sql, lat, lng, radius, limit);

        return NextResponse.json({ data: rows });
    } catch (err) {
        logError("NEARBY_PROVIDERS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
