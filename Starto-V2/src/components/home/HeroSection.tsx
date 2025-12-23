"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import StartoMap from "@/components/map-engine/StartoMap";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <div className="relative w-full h-[90vh] overflow-hidden bg-white text-foreground flex items-center justify-center">
            {/* Layer 1: REAL Map Background (Custom Theme) */}
            <div className="absolute inset-0 z-0 opacity-100">
                <StartoMap mode="hero" className="w-full h-full" />
            </div>

            {/* Layer 2: Light Gradient Overlay (Fade) */}
            {/* Fade from top (White) to transparent, then to White at bottom for seamless transition */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/90 via-white/50 to-white/90 pointer-events-none" />

            {/* Layer 3: Hero Content */}
            <div className="relative z-20 container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center h-full pt-12">

                {/* Visual Anchor / Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">Live Market Intelligence</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-gray-900"
                >
                    Explore your startup<br />
                    market <span className="text-primary">before you build.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="max-w-[700px] text-lg md:text-2xl text-gray-600 mb-10 font-medium leading-relaxed"
                >
                    Indicative market signals based on real-world data.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button size="lg" className="rounded-full h-14 px-8 text-xl shadow-lg shadow-primary/25 font-bold" asChild>
                        <Link href="/explore">👉 Explore Your Market</Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
