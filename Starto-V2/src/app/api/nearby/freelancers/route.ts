// src/app/api/nearby/freelancers/route.ts
import { NextResponse } from "next/server";
import { queryNearbyRaw } from "@/lib/location-utils";
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

        // Optional filters building (prisma raw WHERE clause)
        let whereClause = "";
        if (skills) {
            // assuming skills stored as text[] in DB
            const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
            if (skillsList.length) {
                // sanitize simple strings for SQL array literal
                const arr = skillsList.map((s) => `'${s.replace(/'/g, "''")}'`).join(",");
                whereClause += ` AND skills && ARRAY[${arr}]::text[] `;
            }
        }
        if (city) {
            const c = city.replace(/'/g, "''");
            whereClause += ` AND city ILIKE '${c}%' `;
        }

        const rows: any[] = await queryNearbyRaw({
            tableName: "FreelancerProfile",
            lat,
            lng,
            radiusKm: radius,
            columns: "id, userId, skills, hourlyRate, address, city, latitude, longitude, bio, portfolio",
            whereClause,
            limit,
        });

        return NextResponse.json({ data: rows });
    } catch (err) {
        logError("NEARBY_FREELANCERS_ERROR", err);
        return NextResponse.json({ error: "internal" }, { status: 500 });
    }
}
