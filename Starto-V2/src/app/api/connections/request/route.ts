// Force rebuild
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    const logFile = path.join(process.cwd(), 'debug-explore.log');

    try {
        const session = await getServerSession(authOptions);
        const bodyContent = await req.clone().json(); // Clone to read twice if needed

        fs.appendFileSync(logFile, `\n[API REQUEST] User: ${session?.user?.email} Body: ${JSON.stringify(bodyContent)}\n`);

        if (!session?.user?.id) {
            fs.appendFileSync(logFile, `[API ERROR] 401 Unauthorized\n`);
            return new NextResponse("Unauthorized", { status: 401 });
        }
        // }

        const { toUserId, receiverUserId: legacyId, message } = bodyContent;
        const receiverUserId = toUserId || legacyId;

        if (!receiverUserId || !message) {
            fs.appendFileSync(logFile, `[API ERROR] 400 Missing Fields\n`);
            return new NextResponse("Missing receiverUserId or message", { status: 400 });
        }
        const sessionUserEmail = session?.user?.email;
        if (!sessionUserEmail) {
            return new NextResponse("Unauthorized (No Email)", { status: 401 });
        }

        // SENIOR FIX: Robust User Lookup by Email (Bypasses Session ID Mismatch)
        const sender = await prisma.user.findUnique({
            where: { email: sessionUserEmail },
            select: { id: true, name: true, activeRole: true }
        });

        if (!sender) {
            fs.appendFileSync(logFile, `[API ERROR] 404 Sender Profile Not Found (Email: ${sessionUserEmail})\n`);
            return new NextResponse("Sender profile not found", { status: 404 });
        }

        const senderId = sender.id; // Correct DB ID

        // Prevent self-connection
        if (senderId === receiverUserId) {
            fs.appendFileSync(logFile, `[API ERROR] 400 Self Connection\n`);
            return new NextResponse("Cannot connect with yourself", { status: 400 });
        }

        // Check for existing request
        const existing = await prisma.connectionRequest.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: senderId,
                    toUserId: receiverUserId,
                },
            },
        });

        if (existing) {
            fs.appendFileSync(logFile, `[API ERROR] 409 Duplicate Request (${existing.status})\n`);
            if (existing.status === "PENDING") {
                return NextResponse.json({ success: false, error: "Request already pending" }, { status: 409 });
            }
            if (existing.status === "ACCEPTED") {
                return NextResponse.json({ success: false, error: "Already connected" }, { status: 409 });
            }
            // If REJECTED, maybe allow re-sending? For now, block to be safe/simple.
            return NextResponse.json({ success: false, error: "Request previously processed" }, { status: 409 });
        }

        // Create Request
        await prisma.connectionRequest.create({
            data: {
                fromUserId: senderId,
                toUserId: receiverUserId,
                message,
                status: "PENDING",
                // Required Schema Fields (Snapshot)
                senderName: sender.name || "Starto User",
                senderRole: String(sender.activeRole || "USER"),
                purpose: "Networking", // Default purpose for Phase 1
            },
        });

        fs.appendFileSync(logFile, `[API SUCCESS] Request Created\n`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[CONNECTION_REQUEST]", error);
        fs.appendFileSync(logFile, `[API ERROR] 500: ${error}\n`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
