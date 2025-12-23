"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, MoreHorizontal, Filter, Calendar } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TasksSection() {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button asChild>
                        <Link href="/startup/tasks/new">
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Task
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search tasks..."
                        className="pl-8 bg-background"
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-muted-foreground/20">All</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-muted">Active</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-muted">Completed</Badge>
                </div>
            </div>

            {/* Tasks Table */}
            <Card className="border-muted/60 shadow-sm">
                <CardHeader className="px-6 py-4 border-b">
                    <CardTitle className="text-base">All Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-3">Task Name</th>
                                    <th className="px-6 py-3">Budget</th>
                                    <th className="px-6 py-3">Applicants</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Posted</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <TaskRow
                                    title="Develop MVP for AI Platform"
                                    category="Engineering"
                                    budget="₹ 4,00,000"
                                    applicants={12}
                                    status="Active"
                                    date="2 days ago"
                                />
                                <TaskRow
                                    title="Design System Implementation"
                                    category="Design"
                                    budget="₹ 1,50,000"
                                    applicants={5}
                                    status="Reviewing"
                                    date="1 week ago"
                                />
                                <TaskRow
                                    title="Marketing Campaign Strategy"
                                    category="Marketing"
                                    budget="₹ 80,000"
                                    applicants={8}
                                    status="Draft"
                                    date="Just now"
                                />
                                <TaskRow
                                    title="Mobile App User Testing"
                                    category="QA"
                                    budget="₹ 25,000"
                                    applicants={18}
                                    status="Closed"
                                    date="1 month ago"
                                />
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function TaskRow({ title, category, budget, applicants, status, date }: any) {
    let badgeVariant = "default" as any;
    if (status === "Reviewing") badgeVariant = "secondary";
    if (status === "Draft") badgeVariant = "outline";
    if (status === "Closed") badgeVariant = "destructive";

    return (
        <tr className="hover:bg-muted/30 transition-colors group">
            <td className="px-6 py-4">
                <div className="font-medium text-foreground">{title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{category}</div>
            </td>
            <td className="px-6 py-4 font-mono text-muted-foreground">{budget}</td>
            <td className="px-6 py-4">
                <div className="flex -space-x-2">
                    {[...Array(Math.min(3, applicants))].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                    {applicants > 3 && (
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                            +{applicants - 3}
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <Badge variant={badgeVariant} className="font-normal">{status}</Badge>
            </td>
            <td className="px-6 py-4 text-muted-foreground">{date}</td>
            <td className="px-6 py-4 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Close Task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    )
}
