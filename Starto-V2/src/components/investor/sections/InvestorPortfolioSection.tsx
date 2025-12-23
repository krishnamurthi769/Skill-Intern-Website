"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrendingUp, PieChart, ArrowUpRight, Search, Filter, MoreHorizontal, FileText, Download } from "lucide-react"

export function InvestorPortfolioSection() {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Investment Portfolio</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <PieChart className="h-4 w-4" />
                        <span>Overview as of {currentDate}</span>
                    </div>
                </div>
                <Button>
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Record New Investment
                </Button>
            </div>

            {/* Portfolio Metrics */}
            <div className="grid gap-6 md:grid-cols-3">
                <PortfolioMetricCard
                    title="Total Invested Capital"
                    value="₹ 4.5 Cr"
                    subtext="Across 8 companies"
                    icon={PieChart}
                />
                <PortfolioMetricCard
                    title="Current Portfolio Value"
                    value="₹ 12.8 Cr"
                    subtext="+184% Unwin realized gain"
                    icon={TrendingUp}
                    trend="success"
                />
                <PortfolioMetricCard
                    title="Avg. Ownership"
                    value="4.2%"
                    subtext="Diluted"
                    icon={FileText}
                />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background p-1">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-muted/50 border-dashed">
                        Active Investments
                    </Button>
                    <Button variant="ghost" size="sm">
                        Exited
                    </Button>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search portfolio..."
                            className="pl-8 bg-background"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Investments Table */}
            <Card className="border-muted/60 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Stage</th>
                                    <th className="px-6 py-4">Invested Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Performance (MOIC)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <InvestmentRow
                                    company="Nova Robotics"
                                    stage="Seed"
                                    date="Jan 12, 2024"
                                    amount="₹ 50,00,000"
                                    equity="2.5%"
                                    moic="3.2x"
                                    status="Performing"
                                    logo="N"
                                />
                                <InvestmentRow
                                    company="Bloom Health"
                                    stage="Pre-Seed"
                                    date="Mar 05, 2024"
                                    amount="₹ 25,00,000"
                                    equity="1.8%"
                                    moic="1.5x"
                                    status="Performing"
                                    logo="B"
                                />
                                <InvestmentRow
                                    company="AgroTech Solutions"
                                    stage="Series A"
                                    date="Nov 20, 2023"
                                    amount="₹ 1,20,00,000"
                                    equity="5.0%"
                                    moic="1.1x"
                                    status="Underperforming"
                                    logo="A"
                                />
                                <InvestmentRow
                                    company="FinFlow"
                                    stage="Seed"
                                    date="Aug 15, 2023"
                                    amount="₹ 75,00,000"
                                    equity="3.0%"
                                    moic="4.5x"
                                    status="Unicorn Potential"
                                    logo="F"
                                />
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function PortfolioMetricCard({ title, value, subtext, icon: Icon, trend }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs ${trend === 'success' ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                    {subtext}
                </p>
            </CardContent>
        </Card>
    )
}

function InvestmentRow({ company, stage, date, amount, equity, moic, status, logo }: any) {
    let statusColor = "bg-green-100 text-green-700 hover:bg-green-100/80";
    if (status === "Underperforming") statusColor = "bg-orange-100 text-orange-700 hover:bg-orange-100/80";
    if (status === "Unicorn Potential") statusColor = "bg-purple-100 text-purple-700 hover:bg-purple-100/80";

    return (
        <tr className="hover:bg-muted/30 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {logo}
                    </div>
                    <div>
                        <div className="font-semibold">{company}</div>
                        <div className="text-xs text-muted-foreground">{equity} Equity</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <Badge variant="outline" className="font-normal">{stage}</Badge>
            </td>
            <td className="px-6 py-4 text-muted-foreground">
                {date}
            </td>
            <td className="px-6 py-4 font-mono font-medium">
                {amount}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold">{moic}</span>
                    <Progress value={parseFloat(moic) * 20} className="w-16 h-1.5" />
                </div>
            </td>
            <td className="px-6 py-4">
                <Badge className={`font-normal border-0 ${statusColor}`}>
                    {status}
                </Badge>
            </td>
            <td className="px-6 py-4 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Investment Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View Term Sheet
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" /> Investment Report
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download K-1 / Tax
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    )
}
