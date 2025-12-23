import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const fromUserId = searchParams.get("from");
        const toUserId = searchParams.get("to");

        if (!fromUserId || !toUserId) {
            return NextResponse.json({ error: "Missing params" }, { status: 400 });
        }

        // Check both directions
        const connection = await prisma.connectionRequest.findFirst({
            where: {
                OR: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            }
        });

        if (!connection) {
            return NextResponse.json({ status: "NONE" });
        }

        // If I sent it, return status. If they sent it, return "RECEIVED" if pending, else status
        // Logic:
        // If fromUser == me: PENDING | ACCEPTED | REJECTED
        // If toUser == me: RECEIVED (if PENDING) | ACCEPTED | REJECTED

        // Ideally, UI handles this, but let's return the raw record for now
        return NextResponse.json({ connection });
    } catch (error) {
        console.error("Connection Status Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
