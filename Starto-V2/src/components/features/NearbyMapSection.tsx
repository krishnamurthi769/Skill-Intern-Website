"use client";

import { BadgeCheck } from "lucide-react";
import StartoMap from "@/components/map-engine/StartoMap";

const TYPES = [
    "Founders near you",
    "Freelancers near you",
    "Investors near you",
    "Space providers near you"
];

export function NearbyMapSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">See who’s already around you</h2>
                    <ul className="space-y-4 mb-8">
                        {TYPES.map((t, i) => (
                            <li key={i} className="flex items-center gap-3 text-lg">
                                <BadgeCheck className="h-5 w-5 text-primary" />
                                {t}
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-muted-foreground italic border-l-2 pl-4 border-primary/20">
                        Locations are user-provided and verified through activity, not scraped guesses.
                    </p>
                </div>
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border shadow-inner">
                    <StartoMap mode="hero" className="w-full h-full" />
                </div>
            </div>
        </section>
    );
}
