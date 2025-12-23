"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Check, X, MessageSquare, Calendar } from "lucide-react"

export function InquiriesSection() {
    const inquiries = [
        {
            id: "1",
            startup: "Flow AI Solutions",
            founder: "Alex Chen",
            type: "Tech Office",
            budget: "$4,500/mo",
            lease: "12 Months",
            message: "We are an AI startup looking for a quiet space for 15 devs. Need 24/7 access.",
            status: "New",
            date: "2 hours ago"
        },
        {
            id: "2",
            startup: "GreenEarth Cafe",
            founder: "Sarah Jones",
            type: "Retail / Cafe",
            budget: "$2,800/mo",
            lease: "36 Months",
            message: "Looking for a ground floor space with high foot traffic for our organic cafe.",
            status: "Reviewing",
            date: "1 day ago"
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
                <p className="text-muted-foreground mt-1">Manage leads from interested startups.</p>
            </div>

            <div className="space-y-4">
                {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{inquiry.startup[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-lg">{inquiry.startup}</h3>
                                                <p className="text-sm text-muted-foreground">Founder: {inquiry.founder}</p>
                                            </div>
                                        </div>
                                        <Badge variant={inquiry.status === "New" ? "default" : "secondary"}>
                                            {inquiry.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block">Looking For</span>
                                            <span className="font-medium">{inquiry.type}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Budget</span>
                                            <span className="font-medium text-primary">{inquiry.budget}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Duration</span>
                                            <span className="font-medium">{inquiry.lease}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Received</span>
                                            <span className="font-medium">{inquiry.date}</span>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-3 rounded-md border border-border text-sm italic text-muted-foreground">
                                        "{inquiry.message}"
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                                    <Button variant="default" size="sm" className="w-full">
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <MessageSquare className="mr-2 h-4 w-4" /> Chat
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
