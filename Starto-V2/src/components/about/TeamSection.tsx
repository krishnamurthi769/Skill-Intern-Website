"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const team = [
    {
        name: "Krishna Murthi",
        role: "Founder & CEO",
        image: "/founder.jpg", // Updated Founder Image
        bio: "Visionary leader passionate about solving the 0 to 1 journey for Indian founders. Previously built and scaled multiple ventures.",
        social: {
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
        }
    },
    {
        name: "Akshay Hangaragi",
        role: "Co-Founder",
        image: "/co-founder.jpg", // Updated Co-Founder Image
        bio: "Tech veteran with a deep love for scalable systems and AI. Building the technical backbone of Starto.",
        social: {
            linkedin: "https://www.linkedin.com/in/akshay-hangaragi-0a3428174/",
            twitter: "https://twitter.com"
        }
    }
]

export function TeamSection() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                        Meet the <span className="text-primary">Visionaries</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        The minds behind the mission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="overflow-hidden border-none shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="aspect-square relative overflow-hidden bg-muted">
                                    {/* Using a blurred placeholder effect or external avatar service */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                                        <h3 className="text-2xl font-bold">{member.name}</h3>
                                        <p className="text-white/80 font-medium">{member.role}</p>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {member.bio}
                                    </p>
                                    <div className="flex gap-4">
                                        <Link href={member.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                                            <Linkedin className="h-5 w-5" />
                                        </Link>
                                        <Link href={member.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                                            <Twitter className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
