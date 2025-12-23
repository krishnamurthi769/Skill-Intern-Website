"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TRENDING_STARTUPS = [
    { name: "FinFlow", sector: "Fintech", stage: "Seed", logo: "FF" },
    { name: "AgriSense", sector: "AgriTech", stage: "Series A", logo: "AS" },
    { name: "DocAI", sector: "HealthTech", stage: "Pre-Seed", logo: "DA" },
];

const OPEN_TASKS = [
    { title: "React Native Developer", budget: "$40/hr", type: "Mobile App" },
    { title: "Pitch Deck Designer", budget: "$500", type: "Design" },
    { title: "SEO Specialist", budget: "$1200", type: "Marketing" },
];

export function MarketplacePreview() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Live Marketplace</h2>
                        <p className="text-muted-foreground text-lg max-w-[600px]">
                            See what's happening right now on Starto.
                        </p>
                    </div>
                    {/* <Button variant="outline">View All Activity</Button> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Trending Startups */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                🔥 Trending Startups
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {TRENDING_STARTUPS.map((startup, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{startup.logo}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{startup.name}</p>
                                            <p className="text-xs text-muted-foreground">{startup.sector}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{startup.stage}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Open Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                💼 New Opportunities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {OPEN_TASKS.map((task, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background transition-colors">
                                    <div>
                                        <p className="font-medium">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">{task.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm text-green-600 dark:text-green-400">{task.budget}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
