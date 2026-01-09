"use client"

import { useState, useEffect, use } from "react"
import { DashboardShell } from "@/components/ui/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, Link as LinkIcon, MapPin, Building, Banknote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ConnectionRequestModal } from "@/components/connections/ConnectionRequestModal"

export default function PublicInvestorProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true)
    const [investor, setInvestor] = useState<any>(null)
    const [error, setError] = useState(false)
    const [isConnectOpen, setIsConnectOpen] = useState(false)

    useEffect(() => {
        async function fetchInvestor() {
            try {
                // Fetch using the generic user/profile API or dedicated endpoint
                // Since dedicated might not exist, we'll try a direct fetch if we can, 
                // but realistically we should have an API. 
                // For now, I'll simulate or use a server action pattern if I could, but stick to client fetch.
                // Assuming /api/investors/[id] will be created or handled by generic route?
                // Actually, I'll create the api route for this momentarily if it fails, but let's assume standard pattern.
                const res = await fetch(`/api/investors/${id}`)
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setInvestor(data)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }
        fetchInvestor()
    }, [id])

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="space-y-4 max-w-3xl mx-auto">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            </DashboardShell>
        )
    }

    if (error || !investor) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-[50vh]">
                    <Briefcase className="h-16 w-16 mb-4 opacity-20" />
                    <h2 className="text-xl font-semibold">Investor Not Found</h2>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-card border rounded-xl p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex items-start gap-5">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
                                <Building className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{investor.user?.name || "Investor"}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
                                    <span className="font-medium text-foreground">{investor.firmName || "Independent Angel"}</span>
                                    <span>•</span>
                                    <Badge variant="secondary" className="rounded-full px-3">{investor.investorType || "Investor"}</Badge>
                                </div>
                                {(investor.city || investor.country) && (
                                    <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {investor.city}{investor.city && investor.country ? ", " : ""}{investor.country}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button onClick={() => setIsConnectOpen(true)} className="gap-2 w-full md:w-auto shadow-md hover:shadow-lg transition-shadow">
                            <LinkIcon className="h-4 w-4" />
                            Request to Connect
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Thesis & Details */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Thesis */}
                        <section className="bg-card border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" /> Investment Thesis
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {investor.thesisNote || "No specific thesis provided. Please connect to discuss potential opportunities."}
                            </p>
                        </section>

                        {/* Sectors */}
                        {investor.sectors && investor.sectors.length > 0 && (
                            <section className="bg-card border rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Focus Sectors</h2>
                                <div className="flex flex-wrap gap-2">
                                    {investor.sectors.map((sector: string) => (
                                        <Badge key={sector} variant="outline" className="px-3 py-1 text-sm bg-background">
                                            {sector}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Stages */}
                        {investor.stages && investor.stages.length > 0 && (
                            <section className="bg-card border rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Preferred Stages</h2>
                                <div className="flex flex-wrap gap-2">
                                    {investor.stages.map((stage: string) => (
                                        <Badge key={stage} variant="secondary" className="px-3 py-1 text-sm">
                                            {stage}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Key Stats */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Investment Criteria</h3>

                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Ticket Size</p>
                                <div className="flex items-center gap-2 text-lg font-medium">
                                    <Banknote className="h-5 w-5 text-green-600" />
                                    {investor.minTicketSize ? `$${(investor.minTicketSize / 1000)}k` : "N/A"} - {investor.maxTicketSize ? `$${(investor.maxTicketSize / 1000)}k` : "N/A"}
                                </div>
                            </div>

                            {investor.isPublic && (
                                <div className="pt-2">
                                    <Badge variant="outline" className="w-full justify-center py-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                                        Active & Public
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <ConnectionRequestModal
                    isOpen={isConnectOpen}
                    onClose={() => setIsConnectOpen(false)}
                    receiverId={investor.userId} // InvestorProfile links to User via userId
                    receiverName={investor.user?.name || investor.firmName || "Investor"}
                />
            </div>
        </DashboardShell>
    )
}
