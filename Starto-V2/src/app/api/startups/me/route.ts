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
    const { name, website, description, stage, valuation, industry, location, latitude, longitude, city, state, country, pincode, address, oneLiner } = body;

    console.log("Startup Update Body:", { email, name, description });

    try {
        const user = await prisma.user.findUnique({ where: { email }, include: { startupProfile: true } });

        if (!user?.startupProfile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const startup = await prisma.startupProfile.update({
            where: { ownerId: user.id },
            data: {
                name,
                website,
                description,
                oneLiner,
                stage: stage ? stage.toUpperCase() : undefined, // Defensive: Ensure Enum match
                isActive: true,
                valuation: valuation ? Number(valuation) : undefined,
                industry,
                // Location Fields (Display Only in Profile)
                latitude,
                longitude,
                city,
                state,
                country,
                pincode,
                address: address || location
            }
        });

        return NextResponse.json({ startup });
    } catch (error: any) {
        console.error("Error updating startup:", error);
        return NextResponse.json({
            error: "Failed to update profile",
            details: error.message
        }, { status: 500 });
    }
}
