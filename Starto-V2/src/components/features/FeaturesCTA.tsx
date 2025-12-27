"use client";

import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturesCTA() {
    return (
        <section className="py-32 bg-background text-center">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
                    Explore your local startup ecosystem
                </h2>
                <Link href="/explore">
                    <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg">
                        Explore Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
