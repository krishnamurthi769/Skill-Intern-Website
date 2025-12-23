import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const startup = await prisma.startupProfile.findUnique({
        where: { id },
        include: {
            tasks: {
                where: { status: "OPEN" },
                orderBy: { createdAt: "desc" }
            },
            // owner: { select: { name: true, image: true, email: true } } // If we linked owner to User
        }
    });

    if (!startup) {
        return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    return NextResponse.json({ startup });
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();

    // Validate/Cherrypick fields
    const { name, website, description, stage, valuation, industry, location } = body;

    try {
        const startup = await prisma.startupProfile.update({
            where: { id },
            data: {
                name,
                website,
                description,
                stage,
                valuation: valuation ? Number(valuation) : undefined,
                industry,
                location
            }
        });
        return NextResponse.json({ startup });
    } catch (error) {
        console.error("Error updating startup:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
