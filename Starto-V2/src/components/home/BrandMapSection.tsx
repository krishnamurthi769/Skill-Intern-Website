"use client";

import StartoMap from "@/components/map-engine/StartoMap";
import { motion } from "framer-motion";

export function BrandMapSection() {
    return (
        <section className="relative w-full py-24 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
            {/* Context Text Overlay */}
            <div className="absolute top-10 z-10 text-center space-y-4 px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                >
                    Analyze demand anywhere.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-400 text-lg md:text-xl"
                >
                    See opportunities before you build. Your startup map, decoded.
                </motion.p>
            </div>

            {/* The Map */}
            <div className="w-full h-[600px] md:h-[700px] opacity-80 mix-blend-screen scale-110 pointer-events-none">
                <StartoMap mode="brand" className="h-full w-full" />
            </div>

            {/* Bottom Gradient for smooth transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
        </section>
    );
}
