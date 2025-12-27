"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    Users,
    Inbox,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle2,
    Search
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

import { useUser } from "@/hooks/useUser"

export function DashboardSection() {
    const { dbUser } = useUser();
    const provider = dbUser?.providerProfile;
    const name = provider?.companyName || dbUser?.name || "Provider";

    // Mock Data -> Real Empty States
    const stats = [
        {
            title: "Total Properties",
            value: "0",
            change: "No properties listed",
            icon: Building2,
            trend: "neutral"
        },
        {
            title: "Occupancy Rate",
            value: "--",
            change: "N/A",
            icon: Users,
            trend: "neutral"
        },
        {
            title: "Pending Inquiries",
            value: "0",
            change: "All caught up",
            icon: Inbox,
            trend: "neutral"
        },
        {
            title: "Projected Revenue",
            value: "--",
            change: "No active bookings",
            icon: DollarSign,
            trend: "neutral"
        },
    ];

    const recentInquiries: any[] = []; // Empty for now

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{name} Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        {provider?.providerType ? `${provider?.providerType} • ` : ""}Manage your startup infrastructure portfolio.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/provider?section=properties&action=new">
                            <Building2 className="mr-2 h-4 w-4" /> Add Property
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <span className="text-muted-foreground">
                                    {stat.change}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Recent Inquiries */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Inquiries</CardTitle>
                        <CardDescription>
                            Startups interested in your properties.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentInquiries.length > 0 ? (
                                recentInquiries.map((inquiry) => (
                                    <div key={inquiry.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                        {/* ... render logic ... */}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center">
                                    <Inbox className="h-8 w-8 mb-2 opacity-20" />
                                    <p>No new inquiries.</p>
                                </div>
                            )}
                        </div>
                        {recentInquiries.length > 0 && (
                            <Button variant="ghost" className="w-full mt-4 text-sm text-muted-foreground" asChild>
                                <Link href="/provider?section=inquiries">View All Inquiries</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks for your daily workflow.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button variant="outline" className="justify-start h-auto py-3">
                            <Clock className="mr-2 h-4 w-4 text-primary" /> Record a Viewing
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Verify Documents
                        </Button>
                        <Button variant="outline" className="justify-start h-auto py-3">
                            <DollarSign className="mr-2 h-4 w-4 text-primary" /> Generate Monthly Invoice
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

