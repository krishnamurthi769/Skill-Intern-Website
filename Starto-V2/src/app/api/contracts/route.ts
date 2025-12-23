import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { proposalId } = body;

        if (!proposalId) {
            return NextResponse.json({ error: "Missing proposalId" }, { status: 400 });
        }

        // 1. Fetch Proposal with Task and Startup info
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: {
                task: {
                    include: {
                        startup: true
                    }
                }
            }
        });

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        // 2. Validate Ownership
        // The user must be the owner of the startup that owns the task
        if (proposal.task.startup.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized: You do not own this task" }, { status: 403 });
        }

        // 3. Create Contract & Update Statuses (Transaction)
        const result = await prisma.$transaction(async (tx) => {
            // Create Contract
            const contract = await tx.contract.create({
                data: {
                    taskId: proposal.taskId,
                    startupId: proposal.task.startupId,
                    freelancerId: proposal.freelancerId,
                    amount: proposal.amount,
                    status: "ACTIVE"
                }
            });

            // Update Task Status
            await tx.task.update({
                where: { id: proposal.taskId },
                data: { status: "IN_PROGRESS" }
            });

            // Update Proposal Status
            await tx.proposal.update({
                where: { id: proposal.id },
                data: { status: "ACCEPTED" }
            });

            // Reject other proposals for this task
            await tx.proposal.updateMany({
                where: {
                    taskId: proposal.taskId,
                    id: { not: proposal.id },
                    status: "PENDING"
                },
                data: { status: "REJECTED" }
            });

            return contract;
        });

        return NextResponse.json({ contractId: result.id });

    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simple list for debugging or dashboard
    // Filters based on role could be added here
    const contracts = await prisma.contract.findMany({
        where: {
            OR: [
                { startup: { ownerId: session.user.id } },
                { freelancer: { userId: session.user.id } }
            ]
        },
        include: {
            task: { select: { title: true } },
            freelancer: { include: { user: { select: { name: true } } } },
            startup: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ contracts });
}
