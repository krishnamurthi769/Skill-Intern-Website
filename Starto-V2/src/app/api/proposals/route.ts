import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role Check
    const role = (session.user as any).role;
    if (role !== "FREELANCER") {
        return NextResponse.json({ error: "Only freelancers can apply" }, { status: 403 });
    }

    const body = await req.json();
    const { taskId, amount, coverLetter } = body;

    if (!taskId || !amount || !coverLetter) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Ensure Freelancer Profile exists for this user
    let freelancer = await prisma.freelancerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!freelancer) {
        // Auto-create profile if missing (optional, but good for MVP flow if user is Role=Freelancer)
        // Ideally should prompt onboarding. But strict step says "find FreelancerProfile".
        return NextResponse.json({ error: "Freelancer profile not found. Please complete onboarding." }, { status: 404 });
    }

    // Check for duplicate proposal
    const existing = await prisma.proposal.findFirst({
        where: {
            taskId: taskId,
            freelancerId: freelancer.id
        }
    });

    if (existing) {
        return NextResponse.json({ error: "You have already applied to this task" }, { status: 400 });
    }

    // Create Proposal
    try {
        const proposal = await prisma.proposal.create({
            data: {
                taskId: taskId,
                freelancerId: freelancer.id,
                amount: Number(amount),
                coverLetter: coverLetter,
                status: "PENDING"
            }
        });

        return NextResponse.json({ proposal }, { status: 201 });
    } catch (error) {
        console.error("Error creating proposal:", error);
        return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
    }
}
