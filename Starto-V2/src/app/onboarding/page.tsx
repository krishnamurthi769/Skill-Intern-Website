"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Rocket, Briefcase, TrendingUp, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const roles = [
    {
        id: "startup",
        title: "I'm a Founder",
        description: "I want to launch my startup, find a team, and raise capital.",
        icon: Rocket,
        color: "text-primary",
        bg: "bg-primary/5",
        features: ["Post Jobs", "Raise Funding", "Find Space"],
    },
    {
        id: "freelancer",
        title: "I'm a Freelancer",
        description: "I want to find premium projects and join startup teams.",
        icon: Briefcase,
        color: "text-primary",
        bg: "bg-primary/5",
        features: ["Find Projects", "Get Contracts", "Get Paid"],
    },
    {
        id: "investor",
        title: "I'm an Investor",
        description: "I want to discover high-growth startups and manage deals.",
        icon: TrendingUp,
        color: "text-primary",
        bg: "bg-primary/5",
        features: ["View Pitch Decks", "Manage Portfolio", "ROI Tracking"],
    },
    {
        id: "provider",
        title: "I'm a Provider",
        description: "I want to list workspace or services for startups.",
        icon: Building2,
        color: "text-primary",
        bg: "bg-primary/5",
        features: ["List Properties", "Manage Bookings", "Earn Rent"],
    }
];

export default function RoleSelectionPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = async (role: string) => {
        setLoading(true);

        try {
            const res = await fetch("/api/onboarding/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            if (!res.ok) throw new Error("Failed to set role");

            const data = await res.json();

            // Update session with new activeRole
            await update({ activeRole: data.activeRole });

            router.push("/onboarding/profile");
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 space-y-4"
            >
                <h1 className="text-4xl font-bold tracking-tight">Welcome to Starto</h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    How are you planning to use the platform? This will tailor your experience.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {roles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card
                            className={`h-full cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-xl group relative overflow-hidden ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => !loading && handleRoleSelect(role.id)}
                        >
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`p-4 rounded-2xl ${role.bg} group-hover:scale-110 transition-transform`}>
                                        <role.icon className={`w-8 h-8 ${role.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-2xl mb-2 group-hover:text-primary transition-colors">{role.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{role.description}</p>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {role.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center text-primary font-semibold text-sm">
                                    Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
