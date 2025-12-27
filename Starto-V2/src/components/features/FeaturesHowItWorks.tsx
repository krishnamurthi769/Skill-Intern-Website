"use client";

import { Search, MapPin, MessageSquare } from "lucide-react";

const STEPS = [
    {
        icon: Search,
        title: "Explore a location"
    },
    {
        icon: MapPin,
        title: "Discover people nearby"
    },
    {
        icon: MessageSquare,
        title: "Connect directly"
    }
];

export function FeaturesHowItWorks() {
    return (
        <section className="py-24 bg-background border-b">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                                <s.icon className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="font-bold text-lg">{s.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
