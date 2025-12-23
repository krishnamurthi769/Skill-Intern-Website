"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useContracts } from "@/hooks/useContracts"
import { Loader2, Briefcase, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export function ContractsSection() {
    const { data: contracts, isLoading } = useContracts()

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Active Contracts</h2>

            {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid gap-4">
                    {contracts?.length === 0 ? (
                        <Card>
                            <CardHeader><CardTitle>Ongoing Work</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground text-sm border border-dashed p-8 text-center rounded-lg">
                                    No active contracts. Accept a proposal to start one.
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        contracts?.map((contract: any) => (
                            <Card key={contract.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            <span className="font-semibold text-lg">{contract.project.title}</span>
                                        </div>
                                        <div className="text-muted-foreground text-sm space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span>Freelancer: <span className="text-foreground font-medium">{contract.freelancer.user.name}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                <span>Started {formatDistanceToNow(new Date(contract.createdAt))} ago</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="text-2xl font-bold flex items-center">
                                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                                            {Number(contract.amount).toLocaleString()}
                                        </div>
                                        <Button size="sm" asChild>
                                            <Link href={`/startup/contracts/${contract.id}`}>View Milestones</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
