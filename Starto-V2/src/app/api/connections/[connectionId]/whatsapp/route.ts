import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ connectionId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { connectionId } = await params;

        // 1. ROBUST: Get Real User ID (Fixes Session/DB Mismatch)
        let currentUserId = session.user.id;
        if (session.user.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });
            if (user) {
                currentUserId = user.id;
            }
        }

        // 2. ROBUST: Find Connection (By connectionId OR internal id)
        const connection = await prisma.connectionRequest.findFirst({
            where: {
                OR: [
                    { connectionId: connectionId },
                    { id: connectionId }
                ]
            }
        });

        if (!connection) {
            console.error(`[WHATSAPP_LINK] Connection not found for param: ${connectionId}`);
            return new NextResponse("Connection not found", { status: 404 });
        }

        // Verify participation using robust currentUserId
        if (connection.fromUserId !== currentUserId && connection.toUserId !== currentUserId) {
            console.error(`[WHATSAPP_LINK] Unauthorized access. User: ${currentUserId}, Connection: ${connection.id}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Identify other user
        const otherUserId = connection.fromUserId === currentUserId
            ? connection.toUserId
            : connection.fromUserId;

        const otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: { phoneNumber: true }
        });

        if (!otherUser?.phoneNumber) {
            return NextResponse.json({ error: "Partner phone number missing" }, { status: 404 });
        }

        // Generate Link
        const cleanPhone = otherUser.phoneNumber.replace(/\D/g, '');
        const displayId = connection.connectionId || connection.id; // Fallback to internal ID if slug missing
        const message = encodeURIComponent(`Hi, we connected on Starto (ID: ${displayId})`);
        const link = `https://wa.me/${cleanPhone}?text=${message}`;

        return NextResponse.json({ link });

    } catch (error) {
        console.error("[WHATSAPP_LINK]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
