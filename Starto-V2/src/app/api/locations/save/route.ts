import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verify path to authOptions
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            latitude,
            longitude,
            address,
            industry,
            budget,
            score,
            competition,
            demand,
            risk
        } = body;

        // Validation
        if (!latitude || !longitude) {
            return NextResponse.json({ error: "Invalid location data" }, { status: 400 });
        }

        const currentLocation = await prisma.savedLocation.create({
            data: {
                userId: session.user.id,
                latitude: Number(latitude),
                longitude: Number(longitude),
                address,
                industry,
                budget,
                score: Number(score),
                competition,
                demand,
                risk
            }
        });

        return NextResponse.json({ success: true, data: currentLocation });

    } catch (error) {
        console.error("Save Location Error:", error);
        return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const locations = await prisma.savedLocation.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5
        });

        return NextResponse.json({ data: locations });

    } catch (error) {
        console.error("Fetch Locations Error:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
