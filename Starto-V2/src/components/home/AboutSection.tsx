"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Users, Globe2, Trophy, ArrowRight, HeartHandshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutSection() {
    return (
        <section id="about" className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    {/* Left: Narrative */}
                    <div className="space-y-8">
                        <div>
                            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors pointer-events-none">
                                Our Mission
                            </Badge>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                We are building the <br />
                                <span className="text-primary">Operating System</span> for <br />
                                Indian Startups.
                            </h2>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Starto isn't just a platform; it's a movement to democratize entrepreneurship in Bharat.
                            We believe that every great idea deserves the right team, capital, and infrastructure to scale from a garage in Bangalore to the global stage.
                        </p>

                        <div className="flex flex-col gap-4 border-l-4 border-primary/20 pl-6 py-2">
                            <p className="font-medium italic text-foreground/80">
                                "Our goal is simple: To reduce the friction of starting up. By connecting Founders, Freelancers, deeply integrated Service Providers, and Investors in one unified ecosystem, we are accelerating the pace of innovation in India."
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">A</div>
                                <div>
                                    <div className="text-sm font-bold">Krishna Murthi</div>
                                    <div className="text-xs text-muted-foreground">Founder & CEO, Starto</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button size="lg" className="rounded-full px-8" asChild>
                                <Link href="/onboarding">Join the Revolution</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                                <Link href="https://www.linkedin.com/company/startoindia/" target="_blank">Connect on LinkedIn <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Vision Grid */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <StatsCard
                            icon={Rocket}
                            value="All-in-One"
                            label="Unified Ecosystem"
                            description="Founders, Freelancers, & Investors on one platform."
                        />
                        <StatsCard
                            icon={Users}
                            value="Top 1%"
                            label="Curated Talent"
                            description="Access verified experts to build your MVP."
                        />
                        <StatsCard
                            icon={HeartHandshake}
                            value="Smart"
                            label="Capital Connect"
                            description="AI-driven matchmaking with the right investors."
                        />
                        <StatsCard
                            icon={Globe2}
                            value="India 1st"
                            label="Built for Bharat"
                            description="Designed for the unique needs of Indian founders."
                        />
                    </div>
                </div>

                {/* Bottom: Values */}
                <div className="mt-24 grid gap-8 md:grid-cols-3">
                    <ValueCard
                        title="Bharat First"
                        description="Built for the unique diverse needs of the Indian market, supporting local languages and regional nuances."
                    />
                    <ValueCard
                        title="Trust & Safety"
                        description="Every profile is verified. Every payment is secured. We prioritize safety above all else."
                    />
                    <ValueCard
                        title="Community Led"
                        description="We are more than software. We are a community of builders helping builders succeed."
                    />
                </div>
            </div>
        </section>
    )
}

function StatsCard({ icon: Icon, value, label, description }: any) {
    return (
        <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-6 space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                <div className="font-semibold">{label}</div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

function ValueCard({ title, description }: any) {
    return (
        <div className="group space-y-3 p-6 rounded-2xl bg-background border hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 flex items-center justify-center rounded-full border bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}
