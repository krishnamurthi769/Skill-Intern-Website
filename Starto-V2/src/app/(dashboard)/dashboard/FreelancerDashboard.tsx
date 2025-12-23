"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Star, Clock, Calendar, Search, ArrowUpRight } from "lucide-react"
import { FreelancerProjectsSection } from "@/components/freelancer/sections/FreelancerProjectsSection"
import { FreelancerProfileSection } from "@/components/freelancer/sections/FreelancerProfileSection"
import { FreelancerSettingsSection } from "@/components/freelancer/sections/FreelancerSettingsSection"
import { MapSection } from "@/components/dashboard/sections/MapSection"

interface FreelancerDashboardProps {
    section?: string;
}

export default function FreelancerDashboard({ section }: FreelancerDashboardProps) {
    if (section === "projects") {
        return <FreelancerProjectsSection />
    }
    if (section === "profile") {
        return <FreelancerProfileSection />
    }
    if (section === "settings") {
        return <FreelancerSettingsSection />
    }
    if (section === "map") {
        return <MapSection userRole="freelancer" />
    }

    // Default Overview
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Freelancer Dashboard</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Update Availability</Button>
                    <Button>
                        <Search className="mr-2 h-4 w-4" /> Find Work
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ProStatsCard
                    title="Earnings (MTD)"
                    value="₹ 1,24,000"
                    icon={Briefcase}
                    trend="Top 10%"
                    description="vs platform avg"
                    variant="success"
                />
                <ProStatsCard
                    title="Job Success"
                    value="98%"
                    icon={Star}
                    trend="Super Rated"
                    variant="default"
                />
                <ProStatsCard
                    title="Hours Logged"
                    value="128h"
                    icon={Clock}
                    description="This month"
                />
                <ProStatsCard
                    title="Active Projects"
                    value="2"
                    icon={Users}
                    description="In progress"
                />
            </div>

            {/* Main Content */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                {/* Active Projects (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card className="h-full border-muted/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Active Projects</CardTitle>
                            <CardDescription>Track time and deliverables for current contracts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Client / Project</th>
                                            <th className="px-6 py-3">Budget</th>
                                            <th className="px-6 py-3">Deadline</th>
                                            <th className="px-6 py-3 text-right">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <ProjectRow
                                            client="TechFlow Inc"
                                            project="React Dashboard Refactor"
                                            budget="₹ 80,000"
                                            deadline="In 2 days"
                                            progress={85}
                                        />
                                        <ProjectRow
                                            client="GreenEarth NGO"
                                            project="Landing Page Redesign"
                                            budget="₹ 45,000"
                                            deadline="Next Week"
                                            progress={40}
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
                            <CardTitle className="text-base">Recommended For You</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <JobCard
                                title="Senior Next.js Developer"
                                budget="₹ 2L - 5L"
                                type="Contract"
                            />
                            <JobCard
                                title="UI/UX Designer for Fintech"
                                budget="₹ 50k - 1L"
                                type="Project"
                            />
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                                View all matches <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ProStatsCard({ title, value, icon: Icon, trend, variant, description }: any) {
    const bgClass = variant === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-primary/5';
    const iconClass = variant === 'success' ? 'text-green-600' : 'text-primary';

    return (
        <Card className="border-muted/60 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${bgClass}`}>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>
                    {trend && (
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{title}</div>
                    {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
                </div>
            </CardContent>
        </Card>
    )
}

function ProjectRow({ client, project, budget, deadline, progress }: any) {
    return (
        <tr className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-4">
                <div className="font-medium">{project}</div>
                <div className="text-xs text-muted-foreground">{client}</div>
            </td>
            <td className="px-6 py-4 font-mono">{budget}</td>
            <td className="px-6 py-4">
                <Badge variant="outline" className="font-normal bg-background">{deadline}</Badge>
            </td>
            <td className="px-6 py-4 text-right align-middle">
                <div className="w-24 ml-auto bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{progress}%</div>
            </td>
        </tr>
    )
}

function JobCard({ title, budget, type }: any) {
    return (
        <div className="p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="font-medium text-sm line-clamp-1">{title}</div>
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{budget}</span>
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{type}</Badge>
            </div>
        </div>
    )
}
