"use client";

import { Activity, Target, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: Activity,
        title: "Demand Signals",
        description: "Identify high-demand areas before you invest.",
        delay: 0
    },
    {
        icon: Target,
        title: "Competition",
        description: "See existing players and find your gap.",
        delay: 0.2
    },
    {
        icon: ShieldCheck,
        title: "Risk Insights",
        description: "Data-backed validation to reduce failure.",
        delay: 0.4
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-muted/30 border-b border-border/50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Market Intelligence, Simplified.</h2>
                    <p className="text-sm text-muted-foreground">Based on real-world data.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: step.delay, duration: 0.5 }}
                            className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
