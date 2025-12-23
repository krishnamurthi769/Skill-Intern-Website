"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { AIStartupInsights } from "@/lib/ai/openai"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface AIInsightsWithMeta extends AIStartupInsights {
    lastUpdated?: string;
}

function InsightsSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export function AIInsightsCard() {
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [insights, setInsights] = useState<AIInsightsWithMeta | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchInsights = async () => {
        try {
            const res = await fetch("/api/ai/startup-analyze", { method: "GET" })
            if (res.ok) {
                const data = await res.json()
                if (data) {
                    setInsights(data)
                }
            }
        } catch (err) {
            console.error("Failed to fetch existing insights", err)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchInsights()
    }, [])

    const handleGenerate = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/ai/startup-analyze", {
                method: "POST",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to generate insights")
            }

            const data = await res.json()
            setInsights(data)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <Card className="border-indigo-500/20 shadow-lg bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/10 dark:to-neutral-950">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="h-5 w-5" />
                                AI Startup Analyst
                            </CardTitle>
                            <CardDescription>
                                Get instant strategic feedback on your startup profile.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <InsightsSkeleton />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-indigo-500/20 shadow-lg bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/10 dark:to-neutral-950">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="h-5 w-5" />
                            AI Startup Analyst
                        </CardTitle>
                        <CardDescription>
                            Get instant strategic feedback on your startup profile.
                        </CardDescription>
                    </div>

                    {insights && insights.lastUpdated && (
                        <div className="flex items-center text-xs text-muted-foreground bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3 mr-1" />
                            Updated {formatDistanceToNow(new Date(insights.lastUpdated), { addSuffix: true })}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!insights && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-indigo-50/50 dark:bg-indigo-950/10 rounded-lg border border-dashed border-indigo-200 dark:border-indigo-800">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
                            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Unlock Strategic Insights</h4>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm px-4">
                            Our AI Analyst will evaluate your stage, industry, and team to identify key strengths, risks, and hiring priorities.
                        </p>
                        <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                            <Sparkles className="mr-2 h-4 w-4" /> Generate Analysis
                        </Button>
                        {error && (
                            <div className="mt-4 flex items-center text-red-500 text-sm bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded">
                                <XCircle className="h-4 w-4 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {isLoading && (
                    <div className="py-4">
                        <InsightsSkeleton />
                        <p className="mt-4 text-center text-sm text-muted-foreground animate-pulse">Running advanced analysis on your startup profile...</p>
                    </div>
                )}

                {insights && !isLoading && (
                    <div className="space-y-6 animate-in fade-in duration-500 mt-2">
                        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border">
                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Summary</h4>
                            <p className="text-lg leading-relaxed">{insights.summary}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Strengths */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Strengths
                                </h4>
                                <ul className="space-y-1">
                                    {insights.strengths.map((item, i) => (
                                        <li key={i} className="text-sm bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-md">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Gaps */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-amber-600 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" /> Risks & Gaps
                                </h4>
                                <ul className="space-y-1">
                                    {insights.gaps.map((item, i) => (
                                        <li key={i} className="text-sm bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-md">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Recommended Roles */}
                        <div>
                            <h4 className="font-semibold mb-3">Recommended Hires</h4>
                            <div className="flex flex-wrap gap-2">
                                {insights.recommended_roles.map((role, i) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <h4 className="font-semibold mb-3">Suggested Next Steps</h4>
                            <ul className="space-y-2">
                                {insights.suggested_next_steps.map((step, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </span>
                                        <span className="mt-1">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={isLoading} className="text-muted-foreground">
                                <Sparkles className="mr-2 h-3 w-3" /> Refresh Analysis
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
