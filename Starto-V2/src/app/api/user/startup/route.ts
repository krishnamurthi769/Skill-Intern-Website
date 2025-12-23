import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    // Mock Auth: Get first startup
    const startup = await prisma.startupProfile.findFirst();

    if (!startup) {
        // Create one if mostly for demo?
        // Or return 404
        return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    return NextResponse.json({ startup });
}
