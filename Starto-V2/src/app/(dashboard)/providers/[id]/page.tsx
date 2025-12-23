"use client"

import { useState, useEffect, use } from "react"
import { DashboardShell } from "@/components/ui/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Warehouse, Link as LinkIcon, MapPin, Layers, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ConnectionRequestModal } from "@/components/connections/ConnectionRequestModal"

export default function PublicProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isLoading, setIsLoading] = useState(true)
    const [provider, setProvider] = useState<any>(null)
    const [error, setError] = useState(false)
    const [isConnectOpen, setIsConnectOpen] = useState(false)

    useEffect(() => {
        async function fetchProvider() {
            try {
                const res = await fetch(`/api/providers/${id}`)
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setProvider(data)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProvider()
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

    if (error || !provider) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-[50vh]">
                    <Warehouse className="h-16 w-16 mb-4 opacity-20" />
                    <h2 className="text-xl font-semibold">Space Provider Not Found</h2>
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
                            <div className="h-20 w-20 rounded-lg bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center shrink-0 border-2 border-orange-100 dark:border-orange-900/30">
                                <Warehouse className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{provider.companyName || provider.user?.name || "Space Provider"}</h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
                                    <Badge variant="outline" className="rounded-md border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                        {provider.providerType || "Workspace"}
                                    </Badge>
                                </div>
                                {(provider.city || provider.country) && (
                                    <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {provider.city}{provider.city && provider.country ? ", " : ""}{provider.country}
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
                    {/* Left Column: Description & Spaces */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-card border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">About the Space</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {provider.description || "No description provided. Contact for more details."}
                            </p>
                        </section>

                        {/* Future: Photo Gallery or Spaces List could go here */}
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-6">
                            <h3 className="font-semibold text-lg border-b pb-2">Space Details</h3>

                            <div className="flex items-start gap-3">
                                <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Capacity</p>
                                    <p className="text-muted-foreground">{provider.capacity ? `${provider.capacity} People` : "Flexible"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Pricing Range</p>
                                    <p className="text-muted-foreground">
                                        {provider.minPrice ? `${provider.minPrice}` : "Contact"}
                                        {provider.maxPrice ? ` - ${provider.maxPrice}` : ""}
                                        {provider.priceUnit ? ` / ${provider.priceUnit}` : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ConnectionRequestModal
                    isOpen={isConnectOpen}
                    onClose={() => setIsConnectOpen(false)}
                    receiverId={provider.userId} // ProviderProfile links to User via userId
                    receiverName={provider.companyName || provider.user?.name || "Provider"}
                />
            </div>
        </DashboardShell>
    )
}
