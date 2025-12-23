"use client";

import { CheckCircle2, UserPlus, Zap } from "lucide-react";

const steps = [
    {
        title: "Sign Up & Choose Role",
        description: "Create your profile as a Founder, Freelancer, Investor, or Provider.",
        icon: UserPlus,
    },
    {
        title: "Get AI Recommendations",
        description: "Our AI Engine matches you with the right tasks, funding, and resources.",
        icon: Zap,
    },
    {
        title: "Collaborate & Grow",
        description: "Hire talent, secure funding, and scale your startup with ease.",
        icon: CheckCircle2,
    },
];

export function HowItWorks() {
    return (
        <section className="py-24">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">How Starto Works</h2>
                    <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                        Three simple steps to launch your journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-[300px]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                    {/* Connecting Line (Desktop Only) */}
                    <div className="absolute top-8 left-[16%] right-[16%] h-0.5 bg-border -z-0 hidden md:block border-t border-dashed" />
                </div>
            </div>
        </section>
    );
}
