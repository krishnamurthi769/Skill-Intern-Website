// src/lib/location-utils.ts
import { prisma } from "@/lib/prisma";

/**
 * Haversine distance (km) between two lat/lng pairs.
 * Returns distance in kilometers.
 */
export function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Generic function to query nearby rows from a table that has latitude & longitude fields.
 * tableName: string (Prisma model name or DB table name)
 * lat, lng: center
 * radiusKm: radius filter in kilometers
 * columns: string to select (or '*' fallback)
 * whereClause: optional SQL string for additional filters (e.g. "AND skills @> ARRAY['React']")
 */
export async function queryNearbyRaw({
    tableName,
    lat,
    lng,
    radiusKm = 5,
    columns = "*",
    whereClause = "",
    limit = 100,
}: {
    tableName: string;
    lat: number;
    lng: number;
    radiusKm?: number;
    columns?: string;
    whereClause?: string;
    limit?: number;
}) {
    // Haversine formula in SQL
    const sql = `
    SELECT ${columns},
      (
        6371 * acos(
          cos(radians($1)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )
      ) AS distance_km
    FROM "${tableName}"
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    ${whereClause}
    HAVING distance_km <= $3
    ORDER BY distance_km ASC
    LIMIT $4;
  `;

    // @ts-ignore
    const res = await prisma.$queryRawUnsafe(sql, lat, lng, radiusKm, limit);
    return res;
}
