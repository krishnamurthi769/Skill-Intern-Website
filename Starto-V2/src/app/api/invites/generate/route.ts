import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { invites: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return existing code if available (Phase 1: One code per user)
        if (user.invites.length > 0) {
            return NextResponse.json({ code: user.invites[0].code });
        }

        // Generate Stable Code: st-[shortUserId]-[random4]
        // user.id is CUID (e.g. clq...) or UUID. Taking last 4 chars is stable enough + random.
        const shortId = user.id.slice(-4);
        const randomSuffix = crypto.randomBytes(2).toString("hex"); // 4 chars
        const code = `st-${shortId}-${randomSuffix}`;

        const invite = await prisma.invite.create({
            data: {
                code,
                inviterId: user.id
            }
        });

        return NextResponse.json({ code: invite.code });

    } catch (error) {
        console.error("Invite Generation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
