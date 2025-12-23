import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find connections where user is sender OR receiver, AND status is ACCEPTED
        // Then get the associated conversation.
        const conversations = await prisma.conversation.findMany({
            where: {
                connection: {
                    status: "ACCEPTED",
                    OR: [
                        { fromUserId: user.id },
                        { toUserId: user.id },
                    ],
                },
            },
            include: {
                connection: {
                    include: {
                        fromUser: true,
                        toUser: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        // Format for frontend
        const formatted = conversations.map((conv) => {
            const isSender = conv.connection.fromUserId === user.id;
            const otherUser = isSender ? conv.connection.toUser : conv.connection.fromUser;
            return {
                id: conv.id,
                otherUser: {
                    id: otherUser.id,
                    name: otherUser.name,
                    image: otherUser.image,
                    role: otherUser.role,
                },
                lastMessage: conv.messages[0]?.content || "No messages yet",
                updatedAt: conv.updatedAt,
            };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Fetch Conversations Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
