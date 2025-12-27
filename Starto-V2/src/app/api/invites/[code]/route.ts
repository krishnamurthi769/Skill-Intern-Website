import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    // Safely type params as a Promise for Next.js 16/future compat
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json({ error: "Code required" }, { status: 400 });
        }

        const invite = await prisma.invite.findUnique({
            where: { code },
            include: {
                inviter: {
                    select: {
                        name: true,
                        image: true,
                        activeRole: true,
                        role: true, // fallback
                        city: true,
                    }
                }
            }
        });

        if (!invite) {
            return NextResponse.json({ error: "Invite not found" }, { status: 404 });
        }

        const inviter = invite.inviter;
        const role = inviter.activeRole || inviter.role || "MEMBER";

        // Return public info only
        return NextResponse.json({
            valid: true,
            inviter: {
                name: inviter.name || "A Starto Member",
                image: inviter.image,
                role: role,
                city: inviter.city || "India"
            }
        });

    } catch (error) {
        console.error("Invite Resolution Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
