"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wallet, History, CreditCard, PlusCircle, ArrowDownLeft, Download } from "lucide-react"

export function InvestorBillingSection() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Financials & Capital Calls</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your bank accounts for capital deployment and view transaction history.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Linked Bank Accounts */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5" /> Investment Accounts
                        </CardTitle>
                        <CardDescription>
                            Bank accounts linked for capital calls and distributions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium">Chase Private Client •••• 8821</div>
                                    <div className="text-sm text-muted-foreground">USD Wiring Account</div>
                                </div>
                            </div>
                            <Badge variant="secondary">Primary</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium">HDFC Bank •••• 3390</div>
                                    <div className="text-sm text-muted-foreground">INR Wiring Account</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Funding Source
                        </Button>
                    </CardFooter>
                </Card>

                {/* Capital Deployment Summary */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" /> Deployment Summary
                        </CardTitle>
                        <CardDescription>
                            Overview of your recent capital movements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <span className="text-xs text-green-600 font-medium uppercase">Capital Deployed</span>
                                <div className="text-xl font-bold text-green-700 mt-1">₹ 4.5 Cr</div>
                                <span className="text-xs text-green-600/80">YTD 2024</span>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <span className="text-xs text-blue-600 font-medium uppercase">Commitments</span>
                                <div className="text-xl font-bold text-blue-700 mt-1">₹ 10.0 Cr</div>
                                <span className="text-xs text-blue-600/80">Active Funds</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Pending Capital Calls</h4>
                            <div className="flex justify-between items-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
                                <div>
                                    <div className="font-bold text-orange-900">₹ 25,00,000</div>
                                    <div className="text-xs text-orange-700">Due Dec 25 • Nova Robotics Series A</div>
                                </div>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                                    Wire Funds
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Dec 15, 2024</TableCell>
                                <TableCell className="font-medium">Bloom Health - Seed Round</TableCell>
                                <TableCell>Investment</TableCell>
                                <TableCell><Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge></TableCell>
                                <TableCell className="text-right font-mono">₹ 25,00,000</TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Nov 01, 2024</TableCell>
                                <TableCell className="font-medium">Quarterly Management Fee</TableCell>
                                <TableCell>Fee</TableCell>
                                <TableCell><Badge variant="outline">Processing</Badge></TableCell>
                                <TableCell className="text-right font-mono">₹ 1,50,000</TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Aug 12, 2024</TableCell>
                                <TableCell className="font-medium">FinFlow - Series A</TableCell>
                                <TableCell>Investment</TableCell>
                                <TableCell><Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge></TableCell>
                                <TableCell className="text-right font-mono">₹ 75,00,000</TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
