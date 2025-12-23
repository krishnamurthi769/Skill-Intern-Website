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

export function DashboardSection() {
    // Mock Data
    const stats = [
        {
            title: "Total Properties",
            value: "4",
            change: "+1 this month",
            icon: Building2,
            trend: "up"
        },
        {
            title: "Occupancy Rate",
            value: "92%",
            change: "+8.5% vs last month",
            icon: Users,
            trend: "up"
        },
        {
            title: "Pending Inquiries",
            value: "12",
            change: "5 require attention",
            icon: Inbox,
            trend: "neutral"
        },
        {
            title: "Projected Revenue",
            value: "$48,500",
            change: "+12% vs last month",
            icon: DollarSign,
            trend: "up"
        },
    ];

    const recentInquiries = [
        {
            id: "1",
            startup: "Flow AI Solutions",
            type: "Tech Office",
            requirements: "1200 sqft • 15 people",
            date: "2 hours ago",
            status: "New"
        },
        {
            id: "2",
            startup: "GreenEarth Cafe",
            type: "Retail / Cafe",
            requirements: "800 sqft • Ground Floor",
            date: "1 day ago",
            status: "Reviewing"
        },
        {
            id: "3",
            startup: "FitTech Pro",
            type: "Gym Space",
            requirements: "3000 sqft • Ventilation",
            date: "2 days ago",
            status: "Meeting Scheduled"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your startup infrastructure portfolio.
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
                            <stat.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                {stat.trend === "up" ? (
                                    <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                                ) : (
                                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                )}
                                <span className={stat.trend === "up" ? "text-primary font-medium" : "text-muted-foreground"}>
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
                            {recentInquiries.map((inquiry) => (
                                <div key={inquiry.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{inquiry.startup}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {inquiry.type} • {inquiry.requirements}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge
                                            variant={inquiry.status === "New" ? "default" : "secondary"}
                                        >
                                            {inquiry.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{inquiry.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-sm text-muted-foreground" asChild>
                            <Link href="/provider?section=inquiries">View All Inquiries</Link>
                        </Button>
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

