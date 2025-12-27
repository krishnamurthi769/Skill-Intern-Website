"use client";

import { motion } from "framer-motion";

export function AboutHero() {
    return (
        <section className="py-24 md:py-32 bg-background flex flex-col items-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                    Why Starto exists
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Starto was built to solve one problem: people outside startup hubs don’t get visibility, access, or the right connections — even when the opportunity exists.
                </p>
            </motion.div>
        </section>
    );
}
