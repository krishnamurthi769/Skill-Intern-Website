"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, BookOpen, Coins, FileText, Hammer, Scale, Globe, Lightbulb } from "lucide-react"
import Link from "next/link"

interface ResourceItem {
    title: string;
    description: string;
    href: string;
    tags: string[];
    official?: boolean;
}

const RESOURCES: Record<string, { icon: any, description: string, items: ResourceItem[] }> = {
    "Funding & Capital": {
        icon: Coins,
        description: "Access grants, accelerators, and venture capital opportunities.",
        items: [
            {
                title: "Startup India Seed Fund",
                description: "Official Govt of India scheme providing financial assistance for proof of concept and prototype development.",
                href: "https://seedfund.startupindia.gov.in/",
                tags: ["Grant", "Govt", "Early Stage"],
                official: true
            },
            {
                title: "Y Combinator",
                description: "The world's premier startup accelerator. $500k investment for 7% equity.",
                href: "https://www.ycombinator.com/apply",
                tags: ["Accelerator", "Global", "Pre-Seed"],
            },
            {
                title: "Antler India",
                description: "Day zero investor backing founders from the snippet stage.",
                href: "https://www.antler.co/location/india",
                tags: ["VC", "India", "Day Zero"],
            },
            {
                title: "SIDBI Fund of Funds",
                description: "Government fund designed to support Alternative Investment Funds (AIFs).",
                href: "https://www.sidbi.in/en/products-initiatives/fund-of-funds-for-startups",
                tags: ["Govt", "Fund of Funds"],
                official: true
            }
        ]
    },
    "Essential Tools": {
        icon: Hammer,
        description: "The modern stack for high-growth startups.",
        items: [
            {
                title: "Linear",
                description: "The industry standard for issue tracking and product project management.",
                href: "https://linear.app/",
                tags: ["Productivity", "Product"],
            },
            {
                title: "Mercury",
                description: "Banking built for startups. Zero fees, high yield, and venture debt access.",
                href: "https://mercury.com/",
                tags: ["Finmtech", "Banking"],
            },
            {
                title: "Notion for Startups",
                description: "All-in-one workspace. Eligible startups get up to $1000 credit.",
                href: "https://www.notion.so/startups",
                tags: ["Docs", "Perks"],
            },
            {
                title: "Deel",
                description: "Hire international employees and contractors legally in minutes.",
                href: "https://www.deel.com/",
                tags: ["HR", "Hiring"],
            }
        ]
    },
    "Legal & Compliance": {
        icon: Scale,
        description: "Navigate regulations and incorporation effortlessly.",
        items: [
            {
                title: "Razorpay Rize",
                description: "Incorporation and compliance platform for Indian startups. Includes banking integration.",
                href: "https://razorpay.com/rize/",
                tags: ["India", "Incorporation"],
            },
            {
                title: "Vakilsearch",
                description: "Legal, tax, and compliance services on-demand.",
                href: "https://vakilsearch.com/",
                tags: ["Legal", "Services"],
            },
            {
                title: "Clerky",
                description: "The standard for US Delaware C-Corp incorporation.",
                href: "https://www.clerky.com/",
                tags: ["US Incorporation", "Legal"],
            }
        ]
    },
    "Knowledge Base": {
        icon: BookOpen,
        description: "Wisdom from the world's best founders and operators.",
        items: [
            {
                title: "Paul Graham Essays",
                description: "Foundational reading for any technology entrepreneur.",
                href: "http://paulgraham.com/articles.html",
                tags: ["Wisdom", "Must Read"],
            },
            {
                title: "YC Startup School",
                description: "Free online course for founders, by Y Combinator.",
                href: "https://www.startupschool.org/",
                tags: ["Course", "Free"],
            },
            {
                title: "Lenny's Newsletter",
                description: "Top-tier advice on product, growth, and people management.",
                href: "https://www.lennysnewsletter.com/",
                tags: ["Product", "Growth"],
            },
            {
                title: "First Round Review",
                description: "Actionable tactical advice from seasoned operators.",
                href: "https://review.firstround.com/",
                tags: ["Tactics", "Management"],
            }
        ]
    }
}

export function ResourcesSection() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pt-4">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Founder Resources</h2>
                <p className="text-muted-foreground">Curated collection of tools, funding sources, and knowledge for builders.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {Object.entries(RESOURCES).map(([category, { icon: Icon, description, items }]) => (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-semibold">{category}</h3>
                            <span className="text-sm text-muted-foreground ml-2 hidden md:inline-block">• {description}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item) => (
                                <Link key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="h-full border bg-card text-card-foreground rounded-lg p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-0.5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h4>
                                                {item.official && (
                                                    <Badge variant="secondary" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-200">Official</Badge>
                                                )}
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {item.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground bg-muted/20">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
