"use client";

import { cn } from "@/lib/utils";

const UNICORNS = [
    "Flipkart",
    "Swiggy",
    "Zomato",
    "PhonePe",
    "Meesho",
    "Ola",
    "Zepto",
    "Razorpay",
    "Paytm",
    "Nykaa",
    "Oyo",
    "Cred"
];

export function UnicornMarquee() {
    return (
        <section className="py-12 border-y bg-muted/20 overflow-hidden">
            <div className="container px-4 mx-auto text-center mb-8">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Trusted by founders • Inspired by India&apos;s Unicorn Ecosystem
                </p>
                <p className="text-xs text-muted-foreground/60">
                    91% of India&apos;s unicorns started small. Starto helps you begin your journey.
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                <div className="animate-marquee flex gap-16 items-center whitespace-nowrap py-4">
                    {/* Double the list to create seamless loop */}
                    {[...UNICORNS, ...UNICORNS].map((name, i) => (
                        <span
                            key={i}
                            className="text-2xl md:text-3xl font-bold text-muted-foreground/60 hover:text-foreground transition-all duration-300 cursor-default"
                        >
                            {name}
                        </span>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 flex gap-16 items-center whitespace-nowrap py-4 ml-16" aria-hidden="true">
                    {[...UNICORNS, ...UNICORNS].map((name, i) => (
                        <span
                            key={i}
                            className="text-2xl md:text-3xl font-bold text-muted-foreground/60 hover:text-foreground transition-all duration-300 cursor-default"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
