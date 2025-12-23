"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, PieChart, Users, Building2, Calendar, Search, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { InvestorPortfolioSection } from "@/components/investor/sections/InvestorPortfolioSection"
import { InvestorSettingsSection } from "@/components/investor/sections/InvestorSettingsSection"
import { InvestorBillingSection } from "@/components/investor/sections/InvestorBillingSection"
import { MapSection } from "@/components/dashboard/sections/MapSection"

interface InvestorDashboardProps {
    section?: string;
}

export default function InvestorDashboard({ section }: InvestorDashboardProps) {
    if (section === "portfolio") {
        return <InvestorPortfolioSection />
    }
    if (section === "settings") {
        return <InvestorSettingsSection />
    }
    if (section === "billing") {
        return <InvestorBillingSection />
    }
    if (section === "map") {
        return <MapSection userRole="investor" />
    }

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Investor Dashboard</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button>
                        <Search className="mr-2 h-4 w-4" /> Scouting
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <ProStatsCard
                    title="Total Invested"
                    value="₹ 4.5 Cr"
                    icon={PieChart}
                    description="Across 8 companies"
                    variant="brand"
                />
                <ProStatsCard
                    title="Portfolio IRR"
                    value="22.4%"
                    icon={TrendingUp}
                    trend="+1.2%"
                    description="Quarterly performance"
                    variant="success"
                />
                <ProStatsCard
                    title="Active Deal Flow"
                    value="12"
                    icon={Building2}
                    description="3 Term Sheets issued"
                />
            </div>

            {/* Main Content */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                {/* Deal Flow Pipeline (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card className="h-full border-muted/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Deal Flow Pipeline</CardTitle>
                                <CardDescription>Startups currently in your review funnel.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm">View Funnel</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DealRow
                                startup="Nova Robotics"
                                stage="Seed"
                                ask="₹ 2 Cr"
                                status="Due Diligence"
                                fit="95%"
                            />
                            <DealRow
                                startup="Bloom Health"
                                stage="Pre-Seed"
                                ask="₹ 50L"
                                status="Intro Call"
                                fit="88%"
                            />
                            <DealRow
                                startup="AgroTech Solutions"
                                stage="Series A"
                                ask="₹ 10 Cr"
                                status="Term Sheet"
                                fit="92%"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="border-muted/60 shadow-sm bg-muted/20">
                        <CardHeader>
                            <CardTitle className="text-base">Portfolio News</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <NewsItem
                                headline="Nova Robotics secures government grant"
                                date="2h ago"
                                tag="Milestone"
                            />
                            <NewsItem
                                headline="Bloom Health launches MVP in Bangalore"
                                date="Yesterday"
                                tag="Product"
                            />
                            <NewsItem
                                headline="AgroTech Featured in TechCrunch"
                                date="3 days ago"
                                tag="PR"
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
    if (variant === 'brand') { bgClass = 'bg-blue-50 dark:bg-blue-900/20'; iconClass = 'text-blue-600'; }

    return (
        <Card className="border-muted/60 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${bgClass}`}>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
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

function DealRow({ startup, stage, ask, status, fit }: any) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/40 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {startup[0]}
                </div>
                <div>
                    <div className="font-semibold">{startup}</div>
                    <div className="text-xs text-muted-foreground">{stage} &bull; Asking {ask}</div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-xs text-muted-foreground">Match Fit</div>
                    <div className="font-bold text-green-600">{fit}</div>
                </div>
                <Badge variant="outline">{status}</Badge>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

function NewsItem({ headline, date, tag }: any) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium leading-snug hover:underline cursor-pointer">{headline}</span>
            </div>
            <div className="flex gap-2 items-center text-xs text-muted-foreground">
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{tag}</Badge>
                <span>&bull; {date}</span>
            </div>
        </div>
    )
}
