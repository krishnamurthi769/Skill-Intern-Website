"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Calendar, MoreHorizontal, Search, Filter, Warehouse, MapPin, Plus } from "lucide-react"

export function ProviderPropertiesSection() {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Properties</h2>
                    <div className="flex items-center text-muted-foreground mt-1 gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{currentDate}</span>
                    </div>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Space
                </Button>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background p-1">
                <Tabs defaultValue="all" className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">All Spaces</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search properties..."
                            className="pl-8 bg-background"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Properties Table */}
            <Card className="border-muted/60 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-4">Property Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4">Occupancy</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <PropertyRow
                                    title="Hub #1 - Private Office"
                                    type="Private Office"
                                    location="Koramangala, Bangalore"
                                    price="₹ 45,000 /mo"
                                    occupancy="100%"
                                    status="Booked"
                                />
                                <PropertyRow
                                    title="Desk A4 - Open Workspace"
                                    type="Hot Desk"
                                    location="Indiranagar, Bangalore"
                                    price="₹ 8,000 /mo"
                                    occupancy="85%"
                                    status="Active"
                                />
                                <PropertyRow
                                    title="Conference Room B"
                                    type="Meeting Room"
                                    location="HSR Layout, Bangalore"
                                    price="₹ 1,500 /hr"
                                    occupancy="40%"
                                    status="Active"
                                />
                                <PropertyRow
                                    title="Studio 5 - Creative Space"
                                    type="Studio"
                                    location="Whitefield, Bangalore"
                                    price="₹ 25,000 /mo"
                                    occupancy="0%"
                                    status="Maintenance"
                                />
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function PropertyRow({ title, type, location, price, occupancy, status }: any) {
    // Status Badge Logic
    let statusVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    if (status === 'Active') statusVariant = "default"; // Use primary/brand color for active
    if (status === 'Booked') statusVariant = "default";
    if (status === 'Maintenance') statusVariant = "destructive";

    return (
        <tr className="hover:bg-muted/30 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Warehouse className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</div>
                        <div className="text-xs text-muted-foreground">{type}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                </div>
            </td>
            <td className="px-6 py-4 font-mono font-medium">
                {price}
            </td>
            <td className="px-6 py-4">
                <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden mb-1">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: occupancy }}
                    ></div>
                </div>
                <span className="text-xs text-muted-foreground">{occupancy} Filled</span>
            </td>
            <td className="px-6 py-4">
                <Badge variant={statusVariant} className="font-normal">
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Property</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Unlist Property</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    )
}
