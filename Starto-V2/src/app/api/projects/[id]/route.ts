import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const userId = "dev-user-id"; // Mock Auth

    // Attempt to fetch project
    let project = await prisma.project.findUnique({
        where: { id },
        include: {
            owner: true,
            contracts: {
                include: {
                    milestones: { orderBy: { id: 'asc' } }
                }
            }
        }
    });

    if (!project) {
        // If searching for specialized "demo-project-1" and it's missing, seed it
        if (id === "demo-project-1") {
            // Ensure freelancer profile exists
            const freelancer = await prisma.freelancerProfile.upsert({
                where: { userId },
                update: {},
                create: { userId, skills: ["Demo"] }
            });

            // Create Project
            project = await prisma.project.create({
                data: {
                    id: "demo-project-1",
                    ownerId: freelancer.id, // For demo, we own it? Or someone else. Let's make us the worker.
                    // Wait, if we are the worker, the Owner should be a Client.
                    // Let's make "Startup Founder" the owner.
                    title: "E-Commerce Platform Rewrite",
                    description: "Complete overhaul of our legacy storefront using Next.js 15.",
                    budget: 15000,
                    status: "IN_PROGRESS",
                    contracts: {
                        create: {
                            freelancerId: freelancer.id,
                            amount: 15000,
                            status: "ACTIVE",
                            milestones: {
                                create: [
                                    { title: "Phase 1: Design System", amount: 3000, status: "COMPLETED" },
                                    { title: "Phase 2: Product Page", amount: 5000, status: "PENDING" },
                                    { title: "Phase 3: Checkout Flow", amount: 7000, status: "PENDING" },
                                ]
                            }
                        }
                    }
                },
                include: {
                    owner: true,
                    contracts: { include: { milestones: { orderBy: { id: 'asc' } } } }
                }
            });

            // Fix Owner: The Prisma schema says `owner` is `FreelancerProfile`. 
            // In a real app, `Project` owner should likely be `StartupProfile` or `User`. 
            // For now, satisfy schema.
        } else {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
    }

    return NextResponse.json({ project });
}
