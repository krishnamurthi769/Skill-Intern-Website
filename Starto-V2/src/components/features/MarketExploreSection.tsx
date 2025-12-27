"use client";

import { motion } from "framer-motion";
import { BarChart3, AlertTriangle, Target, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SIGNALS = [
    {
        icon: Target,
        title: "Local competition density",
        description: "Know who else is building in your space nearby."
    },
    {
        icon: Activity,
        title: "Demand indicators",
        description: "See if the market is actually searching for your solution."
    },
    {
        icon: AlertTriangle,
        title: "Risk level",
        description: "Understand market saturation before you commit."
    },
    {
        icon: BarChart3,
        title: "Ecosystem maturity",
        description: "Is this location ready for your startup stage?"
    }
];

export function MarketExploreSection() {
    return (
        <section className="py-24 bg-muted/30 border-y">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-3xl mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Explore a location before you build</h2>
                    <p className="text-lg text-muted-foreground">
                        Pick any location. Choose an industry. See real signals, not assumptions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SIGNALS.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full bg-background border-border/50 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                                        <s.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                                    <p className="text-muted-foreground text-sm">{s.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    No login required for first 3 searches.
                </div>
            </div>
        </section>
    );
}
