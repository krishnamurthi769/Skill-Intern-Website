import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const userId = "dev-user-id"; // Mock Auth

    // Attempt to fetch project
    let project = await prisma.project.findUnique({
        where: { id },
        include: {
            owner: true,
            // contracts: { include: { milestones: { orderBy: { id: 'asc' } } } } // Invalid relation
        }
    });

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
}
