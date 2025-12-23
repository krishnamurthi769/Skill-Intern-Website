"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, FileText, Globe, Award, TrendingUp } from "lucide-react"

export function ResourcesSection() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Founder Resources</h2>
                <p className="text-muted-foreground">Curated tools, guides, and portals for Indian founders.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Government & Policy */}
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Startup India Portal</CardTitle>
                        <CardDescription>Government of India</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Official portal for startup recognition, tax exemptions, and IPR benefits. Essential for every Indian startup.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://www.startupindia.gov.in/" target="_blank" rel="noopener noreferrer">
                                Visit Portal <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Funding & Grants */}
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Banknote className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">SIDBI Schemes</CardTitle>
                        <CardDescription>Funding & Finance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Direct loans, Fund of Funds for Startups (FFS), and credit guarantee schemes for MSMEs and startups.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://sidbi.in/en/schemes" target="_blank" rel="noopener noreferrer">
                                View Schemes <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Knowledge & Learning */}
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Y Combinator Library</CardTitle>
                        <CardDescription>Global Best Practices</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            The gold standard for startup advice. Essays on PMF, fundraising, and growth from Paul Graham and Sam Altman.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://www.ycombinator.com/library" target="_blank" rel="noopener noreferrer">
                                Read Library <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Market Intelligence */}
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Inc42 / YourStory</CardTitle>
                        <CardDescription>Indian Market News</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Review the latest funding news, startup stories, and market analysis specific to the Indian ecosystem.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" asChild>
                                <a href="https://inc42.com/" target="_blank" rel="noopener noreferrer">
                                    Inc42 <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </Button>
                            <Button variant="outline" className="flex-1" asChild>
                                <a href="https://yourstory.com/" target="_blank" rel="noopener noreferrer">
                                    YourStory <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Legal & Compliance */}
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">MCA Services</CardTitle>
                        <CardDescription>Ministry of Corp. Affairs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Company incorporation (SPICe+), annual filings, and regulatory compliance checks.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://www.mca.gov.in/content/mca/global/en/home.html" target="_blank" rel="noopener noreferrer">
                                MCA Portal <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Tech Stack */}
                <Card className="hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Digital India</CardTitle>
                        <CardDescription>Infrastructure & APIs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Access India Stack resources like UPI, DigiLocker, and Aadhaar APIs for building compliant tech products.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://digitalindia.gov.in/" target="_blank" rel="noopener noreferrer">
                                Digital India <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function Banknote({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
        </svg>
    )
}
