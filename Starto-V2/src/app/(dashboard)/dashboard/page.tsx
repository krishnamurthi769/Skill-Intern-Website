import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import FounderDashboard from "./FounderDashboard";
import FreelancerDashboard from "./FreelancerDashboard";
import InvestorDashboard from "./InvestorDashboard";
import ProviderDashboard from "./ProviderDashboard";

interface PageProps {
    searchParams: Promise<{ section?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    // Await params and ensure section is valid string or undefined (safely)
    const { section } = await searchParams;
    const safeSection = section || "";

    // Hard Role Sync (Single Source of Truth)
    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { activeRole: true, role: true }
    });

    const activeRole = (dbUser?.activeRole || dbUser?.role || (session.user as any).activeRole || "STARTUP").toUpperCase();

    switch (activeRole) {
        case "STARTUP":
        case "ADMIN":
            return <FounderDashboard section={safeSection} />;
        case "FREELANCER":
            return <FreelancerDashboard section={safeSection} />;
        case "INVESTOR":
            return <InvestorDashboard section={safeSection} />;
        case "PROVIDER":
            return <ProviderDashboard section={safeSection} />;
        default:
            redirect("/onboarding");
    }
}
