import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    try {
        const contract = await prisma.contract.findUnique({
            where: { id },
            include: {
                project: true,
                freelancer: {
                    include: {
                        user: {
                            select: { name: true, image: true, email: true }
                        }
                    }
                },
                milestones: {
                    orderBy: { id: "asc" } // or dueDate if it existed
                }
            }
        });

        if (!contract) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        return NextResponse.json({ contract });
    } catch (error) {
        console.error("Error fetching contract:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
