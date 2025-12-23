"use client";

import Link from "next/link";
import { MoveRight, Rocket, Briefcase, TrendingUp, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roles = [
    {
        title: "I'm a Founder",
        description: "Build your dream team, find workspaces, and access funding opportunities.",
        icon: Rocket,
        href: "/onboarding",
        color: "text-primary",
        bg: "bg-primary/5",
        cta: "Launch Startup"
    },
    {
        title: "I'm a Freelancer",
        description: "Find verified projects, get paid securely, and grow your career.",
        icon: Briefcase,
        href: "/onboarding",
        color: "text-primary",
        bg: "bg-primary/5",
        cta: "Start Earning"
    },
    {
        title: "I'm an Investor",
        description: "Discover high-potential startups and manage your portfolio with AI insights.",
        icon: TrendingUp,
        href: "/onboarding",
        color: "text-primary",
        bg: "bg-primary/5",
        cta: "Discover Startups"
    },
    {
        title: "I'm a Provider",
        description: "List your office space and get verified tenants effortlessly.",
        icon: Building2,
        href: "/onboarding",
        color: "text-primary",
        bg: "bg-primary/5",
        cta: "List Space"
    }
];

export function RoleSelection() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Choose Your Path</h2>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Starto connects the entire startup ecosystem. Select your role to get started.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role) => (
                        <Card key={role.title} className="group hover:shadow-xl transition-all duration-300 border-none shadow-md">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${role.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <role.icon className={`h-6 w-6 ${role.color}`} />
                                </div>
                                <CardTitle className="text-xl">{role.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base min-h-[80px]">
                                    {role.description}
                                </CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between hover:bg-transparent hover:text-primary group-hover:translate-x-1 transition-transform p-0" asChild>
                                    <Link href={role.href}>
                                        <span className="font-semibold">{role.cta}</span>
                                        <MoveRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
