"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ProposalsSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Received Proposals</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Inbox</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground text-sm border border-dashed rounded-lg p-8 text-center">
                        No new proposals. (Placeholder)
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
