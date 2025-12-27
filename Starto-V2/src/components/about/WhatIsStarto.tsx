"use client";

import { CheckCircle2 } from "lucide-react";

const NOT_LIST = [
    "Not a marketplace",
    "Not a management tool",
    "Not a social network"
];

export function WhatIsStarto() {
    return (
        <section className="py-24 bg-foreground text-background">
            <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-6 text-background">So what is Starto?</h2>
                        <p className="text-lg text-background/80 leading-relaxed mb-8">
                            Starto is a local ecosystem discovery platform that helps founders, freelancers, investors, and space providers find each other — based on real location data.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <ul className="space-y-4 mb-8">
                            {NOT_LIST.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-background/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-xl font-bold text-center border-t border-white/10 pt-6">
                            Starto is a discovery layer, not a destination.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
