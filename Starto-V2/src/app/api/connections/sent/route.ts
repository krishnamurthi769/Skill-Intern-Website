import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const { searchParams } = new URL(req.url);
        const fromFirebaseUid = searchParams.get("firebaseUid");
        const statusParam = searchParams.get("status");

        let currentUserId = session?.user?.id;

        // AUTH BRIDGE
        if (fromFirebaseUid) {
            const dbUser = await prisma.user.findUnique({
                where: { firebaseUid: fromFirebaseUid }
            });
            if (dbUser) {
                currentUserId = dbUser.id;
            }
        }

        if (!currentUserId) {
            if (!session || !session.user || !session.user.id) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
        }

        let statusFilter: any = undefined;
        if (statusParam && statusParam !== "ALL") {
            statusFilter = statusParam;
        }

        const whereClause: any = {
            fromUserId: currentUserId,
        };

        if (statusFilter) {
            whereClause.status = statusFilter;
        }

        const requests = await prisma.connectionRequest.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                toUser: {
                    select: {
                        name: true,
                        image: true,
                        role: true, // If available on User model, else fail gracefully
                    }
                }
            }
        });

        // Map to flat structure for frontend if needed, or send as is
        const formatted = requests.map(req => ({
            id: req.id,
            receiverName: req.toUser.name || "Unknown",
            receiverRole: (req.toUser as any).role || "User", // Robust check
            purpose: req.purpose,
            message: req.message,
            status: req.status,
            createdAt: req.createdAt,
            connectionId: req.connectionId
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("[CONNECTIONS_SENT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
