import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // if (!session || !session.user || !session.user.id) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const { searchParams } = new URL(req.url);
        const fromFirebaseUid = searchParams.get("firebaseUid");

        let currentUserId = session?.user?.id;

        if (fromFirebaseUid) {
            const dbUser = await prisma.user.findUnique({
                where: { firebaseUid: fromFirebaseUid }
            });
            if (dbUser) {
                currentUserId = dbUser.id;
            }
        }

        if (!currentUserId) {
            // Fallback checking
            if (!session || !session.user || !session.user.id) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
            // Logic would fail later if session is valid but DB user missing, but that's standard.
        }

        const statusParam = searchParams.get("status");

        let statusFilter: any = "PENDING";
        if (statusParam && statusParam !== "ALL") {
            statusFilter = statusParam;
        } else if (statusParam === "ALL") {
            statusFilter = undefined; // No filter
        }

        // List requests where I am the receiver
        const whereClause: any = {
            toUserId: currentUserId,
        };

        if (statusFilter) {
            whereClause.status = statusFilter;
        }

        const requests = await prisma.connectionRequest.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                senderName: true,
                senderRole: true,
                purpose: true,
                message: true,
                createdAt: true,
                status: true,
                fromUserId: true,
                connectionId: true,
                whatsappLink: true, // EXPOSE LINK
                fromUser: {
                    select: {
                        image: true,
                        name: true,
                        role: true
                    }
                }
            }
        });

        console.log(`[CONNECTIONS_INCOMING] User: ${currentUserId}, Status: ${statusFilter}, Count: ${requests.length}`);
        return NextResponse.json(requests);
    } catch (error) {
        console.error("[CONNECTIONS_INCOMING_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
