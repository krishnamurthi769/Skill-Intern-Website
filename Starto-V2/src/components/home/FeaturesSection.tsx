"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Users, ShieldCheck, Banknote, Rocket, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: Sparkles,
        title: "Smart Matchmaking",
        description: "Our AI analyzes your project needs and matches you with the perfect talent instantly.",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        icon: Users,
        title: "Verified Talent",
        description: "Access a curated network of top 1% freelancers and agencies, vetted for quality.",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        icon: ShieldCheck,
        title: "Secure Payments",
        description: "Funds are held in escrow and released only when you're satisfied with the work.",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        icon: Banknote,
        title: "Zero-Equity Grants",
        description: "Get discovered by investors and apply for equity-free grants to fuel your growth.",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        icon: Rocket,
        title: "Growth Tools",
        description: "Access over $50k worth of perks, software credits, and resources for startups.",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        icon: GraduationCap,
        title: "Community & Events",
        description: "Join exclusive networking events, workshops, and a community of builders.",
        color: "text-primary",
        bg: "bg-primary/10"
    }
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                        Why Starto?
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Everything you need to <span className="text-primary">scale</span>.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We've built a comprehensive ecosystem to support every stage of your startup journey, from idea to IPO.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-muted/50 bg-background/50 backdrop-blur-sm hover:border-primary/20 hover:bg-muted/50 transition-all duration-300 group">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
