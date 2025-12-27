import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                startup: true,
                proposals: {
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
                }
            }
        });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ task });
    } catch (error: any) {
        console.error("Error fetching task detailed:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
