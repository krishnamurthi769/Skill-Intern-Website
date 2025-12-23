import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { conversationId, senderId, content } = await req.json();

        if (!conversationId || !senderId || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                content,
            },
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Send Message Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
