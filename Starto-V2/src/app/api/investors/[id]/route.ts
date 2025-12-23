import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const investor = await prisma.investorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        email: false, // Privacy
                        phoneNumber: false, // Privacy
                    }
                }
            }
        });

        if (!investor) {
            return new NextResponse("Investor not found", { status: 404 });
        }

        return NextResponse.json(investor);
    } catch (error) {
        console.error("[INVESTOR_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
