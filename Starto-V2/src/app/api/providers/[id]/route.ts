import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const provider = await prisma.providerProfile.findUnique({
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

        if (!provider) {
            return new NextResponse("Provider not found", { status: 404 });
        }

        return NextResponse.json(provider);
    } catch (error) {
        console.error("[PROVIDER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
