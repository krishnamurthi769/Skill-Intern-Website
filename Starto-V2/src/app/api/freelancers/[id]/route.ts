import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch freelancer profile
        // We assume 'id' passed in URL is the FreelancerProfile ID or the User ID?
        // The page uses `params.id`.
        // Usually public URLs use the ID of the resource (FreelancerProfile.id).
        // Let's try to find by FreelancerProfile.id first.

        // Also include User info for Name/Image.
        const freelancer = await prisma.freelancerProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        email: true, // Maybe? No, keep it private if possible. Name is enough.
                        id: true, // Needed for connection request (toUserId)
                    },
                },
            },
        });

        if (!freelancer) {
            // Fallback: Maybe they passed the User ID?
            // Let's check if there is a profile for this User ID
            const byUserId = await prisma.freelancerProfile.findUnique({
                where: { userId: id },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            id: true,
                        }
                    }
                }
            });

            if (byUserId) {
                return NextResponse.json({
                    ...byUserId,
                    name: byUserId.user.name,
                    userId: byUserId.user.id, // Explicitly expose userId for the connection request
                });
            }

            return new NextResponse("Freelancer not found", { status: 404 });
        }

        // Flatten for frontend convenience
        return NextResponse.json({
            ...freelancer,
            name: freelancer.user.name,
            userId: freelancer.user.id,
        });

    } catch (error) {
        console.error("[FREELANCER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
