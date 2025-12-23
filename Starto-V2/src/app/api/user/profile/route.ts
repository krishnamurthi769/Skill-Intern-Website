import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                startupProfile: true,
                freelancerProfile: true,
                investorProfile: true,
                providerProfile: true,
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        let profile = null;
        if (user.role === "STARTUP") profile = user.startupProfile;
        else if (user.role === "FREELANCER") profile = user.freelancerProfile;
        else if (user.role === "INVESTOR") profile = user.investorProfile;
        else if (user.role === "PROVIDER") profile = user.providerProfile;

        return NextResponse.json({ role: user.role, profile });
    } catch (error) {
        console.error("[USER_PROFILE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
