"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Warehouse, Key, Users, DollarSign, Calendar, Settings, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { ProviderPropertiesSection } from "@/components/provider/sections/ProviderPropertiesSection"
import { ProviderSettingsSection } from "@/components/provider/sections/ProviderSettingsSection"
import { MapSection } from "@/components/dashboard/sections/MapSection"
import Link from "next/link"

interface ProviderDashboardProps {
    section?: string;
}

export default function ProviderDashboard({ section }: ProviderDashboardProps) {
    if (section === "properties") {
        return <ProviderPropertiesSection />
    }
    if (section === "settings") {
        return <ProviderSettingsSection />
    }
    if (section === "map") {
        return <MapSection userRole="provider" />
    }

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Provider Dashboard</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard?section=settings">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard?section=properties">
                            <Warehouse className="mr-2 h-4 w-4" /> My Spaces
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ProStatsCard
                    title="Revenue (MTD)"
                    value="₹ 8,50,000"
                    icon={DollarSign}
                    trend="+12%"
                    description="vs last month"
                    variant="success"
                />
                <ProStatsCard
                    title="Occupancy"
                    value="85%"
                    icon={Users}
                    description="4 spaces total"
                />
                <ProStatsCard
                    title="Active Bookings"
                    value="12"
                    icon={Key}
                    description="Current"
                />
                <ProStatsCard
                    title="Pending Visits"
                    value="5"
                    icon={Calendar}
                    description="For this week"
                    variant="warning"
                />
            </div>

            {/* Main Content */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                {/* Bookings Table (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card className="h-full border-muted/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Upcoming Bookings</CardTitle>
                            <CardDescription>Schedule for next 7 days.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Tenant</th>
                                            <th className="px-6 py-3">Space</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <BookingRow
                                            tenant="Neon Startups"
                                            space="Hub #1 (Private Office)"
                                            date="Tomorrow, 9:00 AM"
                                            status="Confirmed"
                                        />
                                        <BookingRow
                                            tenant="Sarah J. (Freelancer)"
                                            space="Desk A4"
                                            date="Dec 22, 10:00 AM"
                                            status="Confirmed"
                                        />
                                        <BookingRow
                                            tenant="CyberSec Team"
                                            space="Conference Room B"
                                            date="Dec 23, 2:00 PM"
                                            status="Pending"
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="border-muted/60 shadow-sm bg-muted/20">
                        <CardHeader>
                            <CardTitle className="text-base">Operational Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AlertItem
                                title="Cleaning Required"
                                desc="Hub #1 after checkout"
                                time="Tomorrow"
                                priority="High"
                            />
                            <AlertItem
                                title="WiFi Maintenance"
                                desc="Scheduled downtime"
                                time="Sunday, 2am"
                                priority="Low"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ProStatsCard({ title, value, icon: Icon, trend, variant, description }: any) {
    let bgClass = 'bg-primary/5';
    let iconClass = 'text-primary';
    if (variant === 'success') { bgClass = 'bg-green-50 dark:bg-green-900/20'; iconClass = 'text-green-600'; }
    if (variant === 'warning') { bgClass = 'bg-orange-50 dark:bg-orange-900/20'; iconClass = 'text-orange-600'; }

    return (
        <Card className="border-muted/60 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${bgClass}`}>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{title}</div>
                    <div className="flex items-center gap-2 mt-2">
                        {trend && <span className="text-xs font-semibold text-green-600">{trend}</span>}
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function BookingRow({ tenant, space, date, status }: any) {
    return (
        <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-4 font-medium">{tenant}</td>
            <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> {space}
            </td>
            <td className="px-6 py-4">{date}</td>
            <td className="px-6 py-4 text-right">
                <Badge variant={status === 'Pending' ? 'outline' : 'secondary'}>{status}</Badge>
            </td>
        </tr>
    )
}

function AlertItem({ title, desc, time, priority }: any) {
    return (
        <div className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0 last:pb-0">
            <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
            <div className="text-right">
                <Badge variant={priority === 'High' ? 'destructive' : 'outline'} className="text-[10px] h-5 px-1.5 mb-1 block">
                    {priority}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{time}</span>
            </div>
        </div>
    )
}
