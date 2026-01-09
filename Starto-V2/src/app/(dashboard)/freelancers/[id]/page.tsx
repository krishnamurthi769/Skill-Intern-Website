"use client"

import { useState, useEffect, use } from "react"
import { DashboardShell } from "@/components/ui/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton" // Assuming Skeleton exists
import { User, Link as LinkIcon, Briefcase } from "lucide-react"
import { RequestConnectionButton } from "@/components/connections/RequestConnectionButton"

// ... imports ...

export default function PublicFreelancerProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true)
    const [freelancer, setFreelancer] = useState<any>(null)
    const [error, setError] = useState(false)
    // Removed isConnectOpen state

    useEffect(() => {
        // Fetch freelancer data
        async function fetchFreelancer() {
            try {
                // Fetch from API
                const res = await fetch(`/api/freelancers/${id}`)
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setFreelancer(data)
            } catch (err) {
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFreelancer()
    }, [id])

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </DashboardShell>
        )
    }

    if (error || !freelancer) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <User className="h-12 w-12 mb-4 opacity-20" />
                    <h2 className="text-xl font-semibold">Freelancer Not Found</h2>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{freelancer.name || "Freelancer"}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Briefcase className="h-4 w-4" />
                            {freelancer.role || "Freelancer"}
                        </p>
                        {/* Skills optional */}
                        {freelancer.skills && freelancer.skills.length > 0 && (
                            <div className="flex gap-2 mt-3">
                                {freelancer.skills.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <RequestConnectionButton
                            receiverUserId={freelancer.userId}
                            receiverName={freelancer.name}
                        />
                    </div>
                </div>

                {/* Minimum Render Only */}
            </div>
        </DashboardShell>
    )
}


