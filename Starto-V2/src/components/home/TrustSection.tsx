"use client";

import { ShieldCheck, Lock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Profiles",
        description: "Every founder, freelancer, and investor is verified to ensure a safe ecosystem."
    },
    {
        icon: Lock,
        title: "Secure Payments",
        description: "Funds are held in escrow until milestones are met. No risk for either party."
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Join thousands of builders supporting each other's growth."
    }
];

const testimonials = [
    {
        quote: "Starto helped us find our lead investor and key engineering hires in under 2 weeks.",
        author: "Sarah J.",
        role: "Founder, TechFlow",
        initials: "SJ"
    },
    {
        quote: "As a freelancer, I love the task matching. No more bidding wars, just quality work.",
        author: "Rahul M.",
        role: "Senior Developer",
        initials: "RM"
    }
];

export function TrustSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-muted/30 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Trusted by Builders</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-background p-6 rounded-xl shadow-sm border">
                                <p className="text-lg italic mb-6 text-muted-foreground">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{t.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{t.author}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
