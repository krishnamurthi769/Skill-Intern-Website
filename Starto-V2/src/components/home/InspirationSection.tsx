"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, Briefcase, TrendingUp, User } from "lucide-react"; // Icons for roles
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PERSONAS = [
    {
        icon: User,
        role: "Founder",
        reality: "Starting from a Tier-3 city",
        relevance: "Uses Starto to understand demand before risking capital"
    },
    {
        icon: Briefcase,
        role: "Freelancer",
        reality: "Working remotely from a small town",
        relevance: "Connects with high-growth startups beyond local clients"
    },
    {
        icon: TrendingUp,
        role: "Investor",
        reality: "Looking for deals outside metro hubs",
        relevance: "Discovers untapped founders with verified traction"
    },
    {
        icon: Building2,
        role: "Space Provider",
        reality: "Has unused capacity in a growing city",
        relevance: "Lists verified functional spaces for serious builders"
    }
];

export function InspirationSection() {
    return (
        <section className="py-24 bg-background border-y relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            Built for founders starting from anywhere
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                            India’s startup success didn’t begin with unicorns.<br className="hidden md:block" />
                            It began with one founder, one place, and one decision.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-24">
                    {PERSONAS.map((persona, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Card className="h-full border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 group">
                                <CardContent className="p-4 md:p-6 flex flex-col items-start text-left h-full">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                                        <persona.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{persona.role}</h3>
                                    <p className="text-sm font-medium text-foreground/80 mb-1">
                                        {persona.reality}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                                        {persona.relevance}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col items-center gap-6"
                >
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Starto connects local ecosystems before capital.
                    </p>
                    <Link href="/explore">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full hover:bg-primary/5 border-primary/20 text-primary">
                            Explore your local startup ecosystem
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
