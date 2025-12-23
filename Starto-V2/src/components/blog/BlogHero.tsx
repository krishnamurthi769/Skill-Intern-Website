"use client"

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function BlogHero() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container px-4 md:px-6 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary text-sm">
                        Starto Chronicles
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        Building in <span className="text-primary">Public</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Insights, engineering challenges, and stories from the team building the operating system for Indian startups.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
