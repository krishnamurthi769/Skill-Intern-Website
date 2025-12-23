import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List all conversations for the current user
export async function GET(req: Request) {
    const userId = "dev-user-id"; // Mock Auth

    // Ensure dev user exists (lazy check for safety)

    let conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { id: userId }
            }
        },
        include: {
            participants: {
                select: { id: true, name: true, image: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    // Lazy Seed: If no conversations, create one with Sarah Startup
    if (conversations.length === 0) {
        // Create dummy participant
        const otherUser = await prisma.user.upsert({
            where: { email: "founder@startup.com" },
            update: {},
            create: {
                email: "founder@startup.com",
                name: "Sarah Startup",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                role: "INVESTOR" // or founder
            }
        });

        await prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: userId }, { id: otherUser.id }]
                },
                messages: {
                    create: {
                        senderId: otherUser.id,
                        content: "Hi! Saw your proposal. Let's chat."
                    }
                }
            }
        });

        // Refetch
        conversations = await prisma.conversation.findMany({
            where: { participants: { some: { id: userId } } },
            include: {
                participants: { select: { id: true, name: true, image: true } },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    return NextResponse.json({ items: conversations });
}

// POST: Start a new conversation
export async function POST(req: Request) {
    const userId = "dev-user-id";
    const body = await req.json();
    const { participantId } = body; // The OTHER user ID

    if (!participantId) return NextResponse.json({ error: "Missing participantId" }, { status: 400 });

    // Check if conversation already exists between these two
    // Prisma M-N filtering is tricky, simplistic approach:
    // Find convos with both users.
    const existing = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { id: userId } } },
                { participants: { some: { id: participantId } } }
            ]
        }
    });

    if (existing) {
        return NextResponse.json({ conversation: existing });
    }

    // Create new
    const conversation = await prisma.conversation.create({
        data: {
            participants: {
                connect: [
                    { id: userId },
                    { id: participantId }
                ]
            }
        }
    });

    return NextResponse.json({ conversation }, { status: 201 });
}
