import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { log, error as logError } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { role } = await req.json();

        if (!role) {
            return NextResponse.json({ error: "Missing role" }, { status: 400 });
        }

        const RolesMapping = {
            startup: "STARTUP",
            freelancer: "FREELANCER",
            investor: "INVESTOR",
            provider: "PROVIDER",
        };

        const prismaRole = RolesMapping[role as keyof typeof RolesMapping];

        if (!prismaRole) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                activeRole: prismaRole as any,
                // Initialize profile if it doesn't exist
                startupProfile: role === "startup" ? {
                    upsert: {
                        create: { name: "My Startup", isActive: true },
                        update: { isActive: true }
                    }
                } : undefined,
                freelancerProfile: role === "freelancer" ? {
                    upsert: {
                        create: { isActive: true },
                        update: { isActive: true }
                    }
                } : undefined,
                investorProfile: role === "investor" ? {
                    upsert: {
                        create: { isActive: true },
                        update: { isActive: true }
                    }
                } : undefined,
                providerProfile: role === "provider" ? {
                    upsert: {
                        create: { isActive: true },
                        update: { isActive: true }
                    }
                } : undefined,
            },
        });

        return NextResponse.json({ success: true, activeRole: user.activeRole });
    } catch (error) {
        logError("SET_ROLE_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
