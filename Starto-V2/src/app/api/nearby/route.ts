
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error as logError } from "@/lib/logger";

// Safe whitelist for table names to prevent SQL injection
const ROLE_TABLE_MAP: Record<string, string> = {
  freelancer: "FreelancerProfile",
  investor: "InvestorProfile",
  startup: "StartupProfile",
  space: "ProviderProfile",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role")?.toLowerCase();
    const city = searchParams.get("city") || "";
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusParam = searchParams.get("radius");

    if (!role || !ROLE_TABLE_MAP[role]) {
      return NextResponse.json(
        { error: "Valid role is required (freelancer, investor, startup, space)" },
        { status: 400 }
      );
    }

    const tableName = ROLE_TABLE_MAP[role];
    const lat = latParam ? parseFloat(latParam) : null;
    const lng = lngParam ? parseFloat(lngParam) : null;
    const radius = radiusParam ? parseFloat(radiusParam) : 10; // default 10km

    // Determine the JOIN key (StartupProfile uses ownerId, others use userId)
    const userJoinKey = role === "startup" ? "ownerId" : "userId";

    // Determine extra fields based on role for "subtitle" or similar context
    let extraSelect = "";
    if (role === "freelancer") extraSelect = `, p."headline", p."skills", p."hourlyRate"`;
    else if (role === "investor") extraSelect = `, p."firmName", p."investorType", p."sectors"`;
    else if (role === "startup") extraSelect = `, p."name" as "companyName", p."oneLiner", p."stage", p."industry"`; // Expose p.name as companyName
    else if (role === "space") extraSelect = `, p."companyName", p."providerType", p."address"`;

    // Haversine calculation part
    // If lat/lng are null, distance will be null
    const haversineSql = (lat !== null && lng !== null)
      ? `
        (
          6371 * acos(
            cos(radians(${lat})) *
            cos(radians(u.latitude::float)) *
            cos(radians(u.longitude::float) - radians(${lng})) +
            sin(radians(${lat})) *
            sin(radians(u.latitude::float))
          )
        )
      `
      : "NULL::float";

    // Raw SQL with CTE
    // Note: We use template literals for trusted internal strings (table name, keys) 
    // and parameterized queries for user input (city, radius, etc) to be safe.
    // However, clean raw SQL with variable table names is tricky in Prisma.
    // We will use queryRawUnsafe but strictly controlled inputs.

    // Prevent SQL injection on City by using parameters $1, $2
    // We'll construct the query string carefully.

    const query = `
      WITH calculated AS (
        SELECT 
          p.id as "profileId",
          u.id as "userId",
          u.name,
          u.role,
          u.city,
          u.pincode,
          u.latitude,
          u.longitude${extraSelect},
          ${haversineSql} as distance_km
        FROM "${tableName}" p
        JOIN "User" u ON u.id = p."${userJoinKey}"
        WHERE p."isActive" = true
      )
      SELECT * FROM calculated
      WHERE 
        (city ILIKE $1::text) 
        OR 
        (distance_km IS NOT NULL AND distance_km <= $2::float)
      ORDER BY distance_km ASC NULLS LAST
      LIMIT 100;
    `;
    const result = await prisma.$queryRawUnsafe(query, `%${city}%`, radius);
    // const result = await prisma.$queryRawUnsafe(query);

    // Parse BigInt if any (Prisma returns BigInt for count/etc sometimes, usually ok here logic-wise)
    // distance_km is float.
    // Return
    return NextResponse.json({ data: result });

  } catch (err: any) {
    logError("NEARBY_API_ERROR", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
