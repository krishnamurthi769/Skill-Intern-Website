"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturesHero() {
    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Features built for discovering real startup ecosystems
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Starto helps founders, freelancers, investors, and space providers discover real opportunities around them — before money, before teams, before risk.
                    </p>

                    <Link href="/explore">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                            Explore Your Market
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
