import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List messages for a specific conversation
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });

    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }, // Oldest first for chat log
        include: {
            sender: {
                select: { id: true, name: true, image: true }
            }
        }
    });

    return NextResponse.json({ items: messages });
}

// POST: Send a message
export async function POST(req: Request) {
    const userId = "dev-user-id";
    const body = await req.json();
    const { conversationId, content } = body;

    if (!conversationId || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const message = await prisma.message.create({
        data: {
            conversationId,
            senderId: userId,
            content
        },
        include: {
            sender: {
                select: { id: true, name: true, image: true }
            }
        }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    });

    return NextResponse.json({ message }, { status: 201 });
}
