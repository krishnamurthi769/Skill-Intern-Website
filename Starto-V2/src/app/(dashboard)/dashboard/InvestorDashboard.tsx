"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, LineChart, Telescope } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { InvestorSettingsSection } from "@/components/investor/sections/InvestorSettingsSection"

import { InviteCard } from "@/components/invite/InviteCard"

interface InvestorDashboardProps {
    section?: string;
}

export default function InvestorDashboard({ section }: InvestorDashboardProps) {
    if (section === "settings" || section === "profile") {
        return <InvestorSettingsSection />;
    }

    const { dbUser } = useUser();
    const router = useRouter();

    const name = dbUser?.name || "Investor";
    const firm = dbUser?.investorProfile?.firmName || "Private Investor";
    const type = dbUser?.investorProfile?.investorType || "Angel";
    const city = dbUser?.city || "Location Not Set";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pt-10">
            {/* 1. Header & Location Badge */}
            <div className="flex flex-col items-center text-center space-y-4">
                <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background border-primary/20 text-primary">
                    <MapPin className="w-3 h-3 mr-2" />
                    {city}
                </Badge>
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {name}
                    </h1>
                    <Badge className="text-sm px-2 py-0.5" variant="secondary">{type}</Badge>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    {firm}
                </p>
            </div>

            {/* 2. Primary Actions (Launchpad) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                {/* Action A: Find Startups */}
                <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                            <Telescope className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Discover Startups</h3>
                        <p className="text-muted-foreground mb-8">
                            Scout for high-potential founders in your target radius.
                        </p>
                        <Button size="lg" className="w-full text-lg h-12" onClick={() => router.push("/nearby?tab=founder")}>
                            Start Scouting
                        </Button>
                    </CardContent>
                </Card>

                {/* Action B: Market Data */}
                <Card className="group relative overflow-hidden border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                            <LineChart className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Market Insights</h3>
                        <p className="text-muted-foreground mb-8">
                            View trending industries and ecosystem signals.
                        </p>
                        <Button size="lg" variant="secondary" className="w-full text-lg h-12" onClick={() => router.push("/explore")}>
                            View Data
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Community Growth */}
            <div className="w-full pt-4">
                <InviteCard />
            </div>

            {/* 3. Quick Links / Status */}
            <div className="flex justify-center gap-4 text-sm text-muted-foreground pt-12">
                <Link href="/dashboard?section=settings" className="hover:text-primary transition-colors flex items-center gap-2">
                    Update Investment Thesis
                </Link>
                <span>•</span>
                <Link href="/nearby?tab=investor" className="hover:text-primary transition-colors flex items-center gap-2">
                    Network with other Investors
                </Link>
            </div>
        </div>
    )
}
