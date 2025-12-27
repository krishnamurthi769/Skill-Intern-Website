"use client";

import { X } from "lucide-react";

const NOT_DOING = [
    "No fake metrics",
    "No revenue dashboards",
    "No forced transactions",
    "No middleman commissions (for now)"
];

export function AntiFeaturesSection() {
    return (
        <section className="py-24 bg-foreground text-background">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2 text-background">What Starto does not do</h2>
                        <p className="text-background/60 mb-8">We focus on what matters: connection.</p>

                        <ul className="space-y-4">
                            {NOT_DOING.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg font-medium">
                                    <div className="w-6 h-6 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                                        <X className="h-4 w-4 text-background" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm text-center">
                        <p className="text-xl font-medium leading-relaxed">
                            "Starto is a discovery layer,<br />not a control layer."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
