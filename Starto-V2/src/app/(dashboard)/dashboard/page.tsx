import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import FounderDashboard from "./FounderDashboard";
import FreelancerDashboard from "./FreelancerDashboard";
import InvestorDashboard from "./InvestorDashboard";
import ProviderDashboard from "./ProviderDashboard";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ section?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const { section } = await searchParams;

    // Hard Role Sync (Single Source of Truth)
    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { activeRole: true, role: true }
    });

    const activeRole = (dbUser?.activeRole || dbUser?.role || (session.user as any).activeRole || "STARTUP").toUpperCase();

    switch (activeRole) {
        case "STARTUP":
        case "ADMIN":
            return <FounderDashboard section={section} />;
        case "FREELANCER":
            return <FreelancerDashboard section={section} />;
        case "INVESTOR":
            return <InvestorDashboard section={section} />;
        case "PROVIDER":
            return <ProviderDashboard section={section} />;
        default:
            redirect("/onboarding");
    }
}
