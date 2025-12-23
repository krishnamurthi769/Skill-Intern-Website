import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentUserId = session.user.id;
        const { requestId, action } = await req.json();

        if (!requestId || !["ACCEPT", "REJECT"].includes(action)) {
            return new NextResponse("Invalid request", { status: 400 });
        }

        // Fetch request
        const request = await prisma.connectionRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return new NextResponse("Request not found", { status: 404 });
        }

        if (request.toUserId !== currentUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (request.status !== "PENDING") {
            return new NextResponse("Request already processed", { status: 400 });
        }

        if (action === "REJECT") {
            await prisma.connectionRequest.update({
                where: { id: requestId },
                data: { status: "REJECTED" },
            });
            return NextResponse.json({ success: true, status: "REJECTED" });
        }

        if (action === "ACCEPT") {
            // Generate secure Connection ID
            const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
            const finalConnectionId = `ST-${uniqueSuffix}`;

            // Update DB - STRICT: No WhatsApp Link Generation here.
            await prisma.connectionRequest.update({
                where: { id: requestId },
                data: {
                    status: "ACCEPTED",
                    connectionId: finalConnectionId,
                },
            });

            return NextResponse.json({
                success: true,
                status: "ACCEPTED",
                connectionId: finalConnectionId
            });
        }
    } catch (error) {
        console.error("[CONNECTION_RESPOND]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
