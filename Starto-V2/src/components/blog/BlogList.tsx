"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const posts = [
    {
        title: "Scaling Websockets for 10k+ Concurrent Connections",
        excerpt: "How we optimized our real-time messaging infrastructure to handle peak loads during demo days using optimizing various layers of stack.",
        author: "Aditya Sharma",
        authorRole: "CTO",
        date: "Dec 15, 2024",
        readTime: "8 min read",
        category: "Engineering",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "The Future of Freelancing in India",
        excerpt: "Why the gig economy is shifting towards specialized, high-trust networks and how Starto is leading this transition.",
        author: "Krishna Murthi",
        authorRole: "CEO",
        date: "Dec 10, 2024",
        readTime: "5 min read",
        category: "Vision",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Designing for Trust: Our Verification System",
        excerpt: "A deep dive into the UX decisions and technical checks that go into verifying every freelancer and startup on our platform.",
        author: "Design Team",
        authorRole: "Product Design",
        date: "Dec 05, 2024",
        readTime: "6 min read",
        category: "Design",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Zero-Equity Grants: A Game Changer",
        excerpt: "We explain how our equity-free grant program works and why it's crucial for early-stage founders to retain ownership.",
        author: "Community",
        authorRole: "Starto Team",
        date: "Nov 28, 2024",
        readTime: "4 min read",
        category: "Community",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2000&auto=format&fit=crop"
    }
]

export function BlogList() {
    return (
        <section className="py-12 bg-muted/30 min-h-[50vh]">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                    {posts.map((post, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full flex flex-col border-none shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge className="bg-background/80 backdrop-blur text-foreground hover:bg-background/90">{post.category}</Badge>
                                    </div>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <CardHeader className="space-y-4">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 flex items-center justify-between border-t p-6 mt-auto">
                                    <div className="text-sm">
                                        <span className="font-semibold block">{post.author}</span>
                                        <span className="text-muted-foreground text-xs">{post.authorRole}</span>
                                    </div>
                                    <Button variant="ghost" className="group/btn" asChild>
                                        <Link href="#">
                                            Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
