import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Missing email" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const requests = await prisma.connectionRequest.findMany({
            where: {
                toUserId: user.id,
                status: "PENDING"
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Pending Requests Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
