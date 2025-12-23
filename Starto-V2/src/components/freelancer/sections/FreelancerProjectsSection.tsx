"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, Calendar, Eye, MessageSquare, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function FreelancerProjectsSection() {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button>
                        <Search className="mr-2 h-4 w-4" /> Find New Work
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="pl-8 bg-background"
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-muted-foreground/20">All</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-muted">Active</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-muted">Completed</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-muted">Disputed</Badge>
                </div>
            </div>

            {/* Projects Table */}
            <Card className="border-muted/60 shadow-sm">
                <CardHeader className="px-6 py-4 border-b">
                    <CardTitle className="text-base">Active Contracts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-3">Project Name</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Budget</th>
                                    <th className="px-6 py-3">Timeline</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Progress</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <ProjectRow
                                    name="React Dashboard Refactor"
                                    client="TechFlow Inc"
                                    budget="₹ 80,000"
                                    timeline="Due in 2 days"
                                    status="Active"
                                    progress={85}
                                />
                                <ProjectRow
                                    name="Landing Page Redesign"
                                    client="GreenEarth NGO"
                                    budget="₹ 45,000"
                                    timeline="Due next week"
                                    status="Active"
                                    progress={40}
                                />
                                <ProjectRow
                                    name="Mobile App MVP"
                                    client="StartupX"
                                    budget="₹ 1,20,000"
                                    timeline="Completed"
                                    status="Completed"
                                    progress={100}
                                />
                                <ProjectRow
                                    name="SEO Optimization"
                                    client="EcoStore"
                                    budget="₹ 15,000"
                                    timeline="Due tomorrow"
                                    status="Reviewing"
                                    progress={95}
                                />
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ProjectRow({ name, client, budget, timeline, status, progress }: any) {
    let badgeVariant = "default" as any;
    if (status === "Completed") badgeVariant = "secondary"; // Or a specific success variant if available
    if (status === "Reviewing") badgeVariant = "outline";
    if (status === "Disputed") badgeVariant = "destructive";

    return (
        <tr className="hover:bg-muted/30 transition-colors group">
            <td className="px-6 py-4 font-medium flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-primary" />
                </div>
                {name}
            </td>
            <td className="px-6 py-4 text-muted-foreground">{client}</td>
            <td className="px-6 py-4 font-mono">{budget}</td>
            <td className="px-6 py-4 text-muted-foreground">{timeline}</td>
            <td className="px-6 py-4">
                <Badge variant={badgeVariant} className="font-normal">{status}</Badge>
            </td>
            <td className="px-6 py-4 align-middle">
                <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{progress}%</div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Contract</DropdownMenuItem>
                            <DropdownMenuItem>Submit Work</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Report Issue</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    )
}
