import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Fetch Messages Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
