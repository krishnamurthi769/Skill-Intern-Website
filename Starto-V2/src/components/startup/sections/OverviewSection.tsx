"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, PlusCircle, Users, Eye, Wallet, Banknote, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { AIInsightsCard } from "@/components/startup/AIInsightsCard"
import { Badge } from "@/components/ui/badge"
import { SavedLocationsWidget } from "@/components/dashboard/widgets/SavedLocationsWidget"

import { useUser } from "@/hooks/useUser"

export function OverviewSection() {
    const { dbUser } = useUser();
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const startup = dbUser?.startupProfile;
    const name = startup?.name || dbUser?.name || "Founder";
    const stage = startup?.stage ? `${startup.stage} Stage` : "Early Stage";

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{name} Dashboard</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <Badge variant="outline" className="font-normal text-muted-foreground">{stage}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">View Reports</Button>
                    <Button asChild>
                        <Link href="/dashboard/tasks/new">
                            <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ProStatsCard
                    title="Cash on Hand"
                    value="--"
                    icon={Wallet}
                    description="Add financial details"
                    variant="default"
                />
                <ProStatsCard
                    title="Monthly Burn"
                    value="--"
                    icon={Banknote}
                    description="Not calculated yet"
                    variant="default"
                />
                <ProStatsCard
                    title="Est. Runway"
                    value="--"
                    icon={TrendingUp}
                    description="Insufficient data"
                />
                <ProStatsCard
                    title="Active Applications"
                    value="0"
                    icon={Users}
                    description="No active applications"
                />
            </div>

            {/* Main Content Grid (2/3 + 1/3) */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">

                {/* Main Content Area (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Active Jobs Pipeline */}
                    <Card className="h-full border-muted/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Active Jobs Pipeline</CardTitle>
                                <CardDescription>Manage your ongoing hiring and task contracts.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/startup/tasks">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-0 p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Role / Task</th>
                                            <th className="px-6 py-3">Proposals</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Briefcase className="h-8 w-8 opacity-20" />
                                                    <p>No active jobs posted yet.</p>
                                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                                        <Link href="/dashboard/tasks/new">Post a Job</Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Insights (Moved to main column for better visibility) */}
                    <AIInsightsCard />
                </div>

                {/* Side Panel (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <SavedLocationsWidget />

                    <Card className="border-muted/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    No recent activity to show.
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Pro Components

function ProStatsCard({ title, value, icon: Icon, trend, trendColor, description, variant }: any) {
    const bgClass = variant === 'warning' ? 'bg-orange-50 dark:bg-orange-950/20' : 'bg-primary/5';
    const iconClass = variant === 'warning' ? 'text-orange-600' : 'text-primary';

    return (
        <Card className="border-muted/60 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${bgClass}`}>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>
                    {trend && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendColor ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/10 text-primary'}`}>
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{title}</div>
                    <p className="text-xs text-muted-foreground mt-2">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function PipelineRow({ job, proposals, status, href }: any) {
    let badgeVariant = "default" as any;
    if (status === "Reviewing") badgeVariant = "secondary";
    if (status === "Interviewing") badgeVariant = "outline";

    return (
        <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-4 font-medium">{job}</td>
            <td className="px-6 py-4 text-muted-foreground">{proposals} candidates</td>
            <td className="px-6 py-4">
                <Badge variant={badgeVariant} className="font-normal">{status}</Badge>
            </td>
            <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                    <Link href={href}><Eye className="h-4 w-4" /></Link>
                </Button>
            </td>
        </tr>
    )
}

function ActivityItem({ text, time, type }: any) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 relative">
                <div className="absolute top-8 left-1.5 w-px h-full bg-border -z-10 last:hidden"></div>
                <div className="h-3 w-3 rounded-full bg-primary/20 ring-4 ring-background border border-primary"></div>
            </div>
            <div className="pb-1">
                <p className="text-sm font-medium leading-none mb-1">{text}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
            </div>
        </div>
    )
}
