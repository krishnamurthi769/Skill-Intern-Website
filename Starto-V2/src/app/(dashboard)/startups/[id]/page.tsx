"use client"

import { useState, use } from "react"
import { useStartup } from "@/hooks/useStartup"
import { DashboardShell } from "@/components/ui/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, DollarSign, FileText, Briefcase, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { ProposalDialog } from "@/components/jobs/proposal-dialog"
import { RequestConnectionButton } from "@/components/connections/RequestConnectionButton"

// ... imports ...

export default function StartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data, isLoading, error } = useStartup(id);
    // Removed isConnectOpen state

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex gap-4 items-center border-b pb-6">
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    if (error || !data) {
        return (
            <DashboardShell>
                <div className="p-8 text-center text-red-500">
                    Failed to load profile.
                </div>
            </DashboardShell>
        );
    }

    const { startup } = data;

    return (
        <DashboardShell>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div>
                        {/* ... existing header content ... */}
                        <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{startup.name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    Tech &bull; San Francisco, CA (Remote Friendly)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        {startup.valuation && (
                            <Card className="flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900">
                                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                                    <DollarSign className="h-4 w-4 text-green-700 dark:text-green-100" />
                                </div>
                                <div>
                                    <div className="text-xs text-green-600 dark:text-green-300 font-semibold uppercase">Valuation</div>
                                    <div className="font-bold text-green-900 dark:text-green-100">
                                        ${(Number(startup.valuation) / 1000000).toFixed(1)}M
                                    </div>
                                </div>
                            </Card>
                        )}

                        <RequestConnectionButton
                            receiverUserId={startup.ownerId}
                            receiverName={startup.name}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: About & Pitch */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4">About</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We are building the future of {startup.name}. Our mission is to leverage AI and
                                scalable tech to solve problems for millions of users.
                                (Placeholder description since it wasn't in the schema, but this makes the UI look real).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" /> Pitch Deck & Resources
                            </h2>
                            {startup.pitchDeck ? (
                                <Card className="bg-muted/50 border-dashed">
                                    <CardContent className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-background rounded-md border shadow-sm">
                                                <FileText className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Series A Pitch Deck</div>
                                                <div className="text-sm text-muted-foreground">PDF &bull; 2.4 MB</div>
                                            </div>
                                        </div>
                                        <Button variant="outline">Download</Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <p className="text-muted-foreground italic">No public documents available.</p>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Open Jobs */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="h-5 w-5" /> Open Positions
                        </h2>
                        <div className="space-y-4">
                            {(startup.jobs || []).length === 0 ? (
                                <Card>
                                    <CardContent className="p-6 text-center text-muted-foreground">
                                        No active listings.
                                    </CardContent>
                                </Card>
                            ) : (
                                (startup.jobs || []).map((job) => (
                                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary" className="text-xs">
                                                    {job.category || "General"}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base mt-2">{job.title}</CardTitle>
                                            <CardDescription className="line-clamp-2 text-xs">
                                                {job.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-3 pt-0">
                                            <div className="text-lg font-bold">
                                                ${Number(job.budget).toLocaleString()}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <ProposalDialog
                                                taskId={job.id}
                                                taskTitle={job.title}
                                                trigger={<Button size="sm" className="w-full">Submit Proposal</Button>}
                                            />
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
