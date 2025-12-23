"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function BillingSection() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Billing & Payments</h2>
                <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" /> Payment Methods
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">₹ 0.00</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">₹ 0.00</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Escrow</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">₹ 0.00</div></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="history">
                <TabsList>
                    <TabsTrigger value="history">Transaction History</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>
                <TabsContent value="history" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>View all your payments and refunds.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                No transactions yet.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="invoices" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                No invoices generated.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
