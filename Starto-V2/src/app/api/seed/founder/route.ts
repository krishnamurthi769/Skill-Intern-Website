import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const demoEmail = "demo_founder_" + Date.now() + "@example.com";

        const user = await prisma.user.create({
            data: {
                name: "Demo Founder",
                email: demoEmail,
                role: "STARTUP",
                activeRole: "STARTUP",
                onboarded: true,
                startupProfile: {
                    create: {
                        name: "Demo AI Startup",
                        oneLiner: "Revolutionizing debug logs",
                        description: "A startup created to test visibility.",
                        isActive: true, // IMPORTANT
                        industry: "Tech",
                        stage: "MVP",
                        fundingNeeded: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
