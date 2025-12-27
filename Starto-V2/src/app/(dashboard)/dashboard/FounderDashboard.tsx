"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Compass, Zap } from "lucide-react"
import { useUser } from "@/hooks/useUser"

import { SettingsSection } from "@/components/startup/sections/SettingsSection"
import { ResourcesSection } from "@/components/dashboard/sections/ResourcesSection"
import { InviteCard } from "@/components/invite/InviteCard"

interface FounderDashboardProps {
    section?: string;
}

export default function FounderDashboard({ section }: FounderDashboardProps) {
    if (section === "settings" || section === "profile") {
        return <SettingsSection />;
    }
    if (section === "resources") {
        return <ResourcesSection />;
    }

    const { dbUser } = useUser();
    const router = useRouter();

    const name = dbUser?.name || "Founder";
    const company = dbUser?.startupProfile?.name || "Your Startup";
    const city = dbUser?.city || "Location Not Set";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pt-6 md:pt-10">
            {/* 1. Header & Location Badge */}
            <div className="flex flex-col items-center text-center space-y-4">
                <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background border-primary/20 text-primary">
                    <MapPin className="w-3 h-3 mr-2" />
                    {city}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl px-4">
                    Welcome back, {name}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl px-4">
                    Ready to scale {company}? The ecosystem is waiting.
                </p>
            </div>

            {/* 2. Primary Actions (Launchpad) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 md:pt-8 px-4 md:px-0">
                {/* Action A: Nearby Network */}
                <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5 md:p-8 flex flex-col items-center text-center relative z-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-primary group-hover:scale-110 transition-transform">
                            <Compass className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Nearby Ecosystem</h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                            Instantly connect with Freelancers, Investors, and Spaces in your radius.
                        </p>
                        <Button size="lg" className="w-full text-base md:text-lg h-11 md:h-12" onClick={() => router.push("/nearby")}>
                            Find Nearby
                        </Button>
                    </CardContent>
                </Card>

                {/* Action B: Market Exploration */}
                <Card className="group relative overflow-hidden border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5 md:p-8 flex flex-col items-center text-center relative z-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-primary group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Explore Market</h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                            Analyze demand, competition, and risk signals for any location.
                        </p>
                        <Button size="lg" variant="secondary" className="w-full text-base md:text-lg h-11 md:h-12" onClick={() => router.push("/explore")}>
                            Market Analysis
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Community Growth */}
            <div className="w-full pt-4 px-4 md:px-0">
                <InviteCard />
            </div>

            {/* 4. Quick Links / Status */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm text-muted-foreground pt-4 md:pt-8 px-4 pb-8">
                <Link href="/dashboard?section=settings" className="hover:text-primary transition-colors flex items-center gap-2">
                    Update Profile
                </Link>
                <span className="hidden md:inline">•</span>
                <Link href="/nearby?tab=freelancer" className="hover:text-primary transition-colors">
                    Looking for Talent?
                </Link>
                <span className="hidden md:inline">•</span>
                <Link href="/nearby?tab=investor" className="hover:text-primary transition-colors">
                    Fundraising?
                </Link>
            </div>
        </div>
    )
}
