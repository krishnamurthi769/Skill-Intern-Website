import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.id;

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { startup: true }
    });

    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Authorization: Only the Startup Owner can view proposals
    if (task.startup.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const proposals = await prisma.proposal.findMany({
        where: { taskId: taskId },
        include: {
            freelancer: {
                include: {
                    user: {
                        select: { name: true, image: true, email: true }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ proposals });
}
