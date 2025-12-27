"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, MapPin, Linkedin } from "lucide-react";
import Link from "next/link";

export function FoundingTeam() {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-3">Built by founders from the same ecosystem</h2>
                    <p className="text-muted-foreground text-base">
                        Starto isn’t built from a boardroom. It’s built from the same problems it’s trying to solve.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                    {/* Krishna Murthi Card */}
                    <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                        <CardHeader className="pb-4 flex flex-row items-start gap-4 space-y-0">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl">Krishna Murthi</CardTitle>
                                <p className="text-sm font-medium text-primary">Founder & CEO</p>
                                <div className="flex items-center text-xs text-muted-foreground pt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>Karnataka, India</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col space-y-4">
                            <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                <p>
                                    B.Tech Computer Science graduate (2025) from GITAM University.
                                </p>
                                <p>
                                    Building Starto to solve the exact problems faced by founders outside metro ecosystems - visibility, access, and local discovery.
                                </p>
                                <p>
                                    Focused on building real-world systems, not demo dashboards.
                                </p>
                            </div>

                            <div className="pt-2 mt-auto">
                                <Link
                                    href="https://www.linkedin.com/in/krichnamurthi/"
                                    target="_blank"
                                    className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Linkedin className="h-3 w-3 mr-1.5" />
                                    Krishna Murthi
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Akshay Hangaragi Card */}
                    <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                        <CardHeader className="pb-4 flex flex-row items-start gap-4 space-y-0">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl">Akshay Hangaragi</CardTitle>
                                <p className="text-sm font-medium text-primary">Co-Founder & Data Engineer</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col space-y-4">
                            <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                <p>
                                    Data Engineer with experience in building scalable data systems.
                                </p>
                                <p>
                                    AWS practitioner and M.Tech candidate (Software Engineering) at BITS Pilani.
                                </p>
                                <p>
                                    Works on Starto’s data foundation - location intelligence, ecosystem signals, and real-world analysis.
                                </p>
                            </div>

                            <div className="pt-2 mt-auto">
                                <Link
                                    href="https://www.linkedin.com/in/akshay-hangaragi-0a3428174/"
                                    target="_blank"
                                    className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Linkedin className="h-3 w-3 mr-1.5" />
                                    Akshay Hangaragi
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Micro-Section: Why two of us? */}
                <div className="max-w-2xl mx-auto text-center bg-muted/30 rounded-lg p-8 border border-muted">
                    <h3 className="text-lg font-semibold mb-3">Why two of us?</h3>
                    <div className="space-y-1 text-muted-foreground text-sm italic">
                        <p>One builds the product from the ground.</p>
                        <p>One builds the data that makes it truthful.</p>
                    </div>
                    <p className="text-foreground font-medium mt-3 text-sm">
                        Together, we’re building Starto for founders who don’t start with unfair advantages.
                    </p>
                </div>
            </div>
        </section>
    );
}
