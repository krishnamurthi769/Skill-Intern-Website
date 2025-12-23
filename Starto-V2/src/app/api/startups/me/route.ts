import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // 1. Find User by Email
    const user = await prisma.user.findUnique({
        where: { email },
        include: { startupProfile: true }
    });

    if (!user || !user.startupProfile) {
        return NextResponse.json({ error: "Startup profile not found" }, { status: 404 });
    }

    // 2. Return the profile
    // Matches the shape expected by useStartup hook { startup: ... }
    return NextResponse.json({ startup: user.startupProfile });
}

export async function PATCH(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const body = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Extract location fields from body (sent by LocationSearchInput)
    const { name, website, description, stage, valuation, industry, location, latitude, longitude, city, state, country, pincode, address } = body;

    try {
        const user = await prisma.user.findUnique({ where: { email }, include: { startupProfile: true } });

        if (!user?.startupProfile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const startup = await prisma.startupProfile.update({
            where: { id: user.startupProfile.id },
            data: {
                name,
                website,
                description,
                stage,
                valuation: valuation ? Number(valuation) : undefined,
                industry,
                // Location Fields
                latitude,
                longitude,
                city,
                state,
                country,
                pincode,
                address: address || location // Fallback if just string sent
            }
        });
        return NextResponse.json({ startup });
    } catch (error) {
        console.error("Error updating startup:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
