// src/app/api/nearby/freelancers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error as logError } from "@/lib/logger";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const lat = parseFloat(url.searchParams.get("lat") || "");
        const lng = parseFloat(url.searchParams.get("lng") || "");
        const radius = parseFloat(url.searchParams.get("radius") || "5"); // km
        const skills = url.searchParams.get("skills") || "";
        const city = url.searchParams.get("city") || "";
        const limit = parseInt(url.searchParams.get("limit") || "100", 10);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return NextResponse.json({ error: "lat & lng are required" }, { status: 400 });
        }

        // Optional filters building
        let whereClause = "";
        if (skills) {
            const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
            if (skillsList.length) {
                const arr = skillsList.map((s) => `'${s.replace(/'/g, "''")}'`).join(",");
                whereClause += ` AND f.skills && ARRAY[${arr}]::text[] `;
            }
        }
        if (city) {
            const c = city.replace(/'/g, "''");
            whereClause += ` AND u.city ILIKE '${c}%' `;
        }

        // Raw SQL for JOIN
        const sql = `
            SELECT 
                f.id, f."userId", f.skills, f."hourlyRate", f.bio, f.portfolio,
                u.name, u.image, u.city, u.latitude, u.longitude,
                (
                    6371 * acos(
                        cos(radians($1)) *
                        cos(radians(u.latitude)) *
                        cos(radians(u.longitude) - radians($2)) +
                        sin(radians($1)) * sin(radians(u.latitude))
                    )
                ) AS distance_km
            FROM "FreelancerProfile" f
            JOIN "User" u ON f."userId" = u.id
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
        logError("NEARBY_FREELANCERS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
