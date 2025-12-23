"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

export function VisitsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Scheduled Visits</h1>
                <p className="text-muted-foreground mt-1">Manage property tours and viewings.</p>
            </div>
            <Card>
                <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No visits scheduled today</h3>
                    <p className="text-muted-foreground mb-4">When a startup schedules a tour, it will appear here.</p>
                    <Button>Schedule Manual Visit</Button>
                </CardContent>
            </Card>
        </div>
    )
}

export function ContractsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
                <p className="text-muted-foreground mt-1">Manage leases and legal agreements.</p>
            </div>
            <div className="grid gap-4">
                <Card className="hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Lease - Creative Studio Loft</h3>
                            <p className="text-sm text-muted-foreground">Tenant: DesignPro Inc. • Expiring: Dec 2026</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white shadow hover:bg-green-600">Active</span>
                            <Button variant="outline" size="sm">View</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
