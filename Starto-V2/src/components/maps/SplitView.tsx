
"use client";

import React, { useState, useEffect, useCallback } from "react";
import FilterBar from "./FilterBar";
import MapDashboard from "./MapDashboard";
import UserCard from "./UserCard";
import { Sparkles, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SplitViewProps {
    role: "startup" | "freelancer" | "investor" | "provider"; // The CURRENT user's role
    initialCenter: { lat: number; lng: number };
}

export default function SplitView({ role, initialCenter }: SplitViewProps) {
    const [targetRole, setTargetRole] = useState<any>(role === "startup" ? "freelancer" : "startup");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState(initialCenter);
    const [filters, setFilters] = useState<any>({ radius: "50" }); // Default 50km

    const isStartup = role === "startup";

    // Unified Fetch Logic
    const fetchResults = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                // Pass current user location context if needed, but API likely pulls from DB profile (as implemented).
                // However, for map drag updates, we technically want to search *around the map center*?
                // The API implementation uses THE USER'S DB LOCATION. 
                // To support "Search this area", we should pass lat/lng to API.
                // The API I wrote uses `startup.latitude`, ignoring query params for current loc.
                // This is fine for "Explore Nearby" (User's location).
                // If we want "Search Here" feature, we need to update API.
                // For now, let's stick to the prompt: "Founder opens Explore Nearby".
                role: targetRole,
                radius: filters.radius
            });

            const res = await fetch(`/api/explore/nearby?${query.toString()}`);
            const data = await res.json();

            if (data.matches) {
                setResults(data.matches);
                // Optionally update map center to user's location if provided in metadata
                if (data.metadata?.userLocation?.lat) {
                    // setCenter(data.metadata.userLocation); // Only on first load?
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [targetRole, filters]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Explore Nearby</h2>
                    <p className="text-sm text-muted-foreground">Find {targetRole}s within {filters.radius}km</p>
                </div>
                {isStartup && (
                    <div className="flex bg-muted p-1 rounded-md">
                        {["freelancer", "investor"].map(r => (
                            <button
                                key={r}
                                onClick={() => setTargetRole(r)}
                                className={`px-4 py-2 text-sm rounded-sm capitalize transition-all ${targetRole === r
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {r}s
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <FilterBar targetRole={targetRole} onFilterChange={setFilters} />

            <div className="flex-1 flex gap-4 overflow-hidden relative">
                {/* Unified List View (Left) */}
                <div className="w-1/3 overflow-y-auto pr-2 space-y-3 pb-20 no-scrollbar">

                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex flex-col gap-3 border p-4 rounded-lg">
                                    <div className="flex justify-between">
                                        <div className="flex gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[120px]" />
                                                <Skeleton className="h-3 w-[80px]" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-neutral-50 dark:bg-neutral-900 border-dashed">
                            <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                                <Info className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground">No matches found</p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                                Try increasing your radius or updating your location settings.
                            </p>
                        </div>
                    )}

                    {!loading && results.map((result: any) => (
                        <UserCard
                            key={result.id}
                            user={result}
                            // Map dashboard interaction could go here
                            onHover={() => setCenter({ lat: result.location.lat, lng: result.location.lng })}
                        />
                    ))}
                </div>

                {/* Map View (Right) */}
                <div className="w-2/3 h-full rounded-lg overflow-hidden relative border border-border">
                    <MapDashboard
                        center={center}
                        radiusKm={parseFloat(filters.radius || "50")}
                        role={targetRole}
                        externalPoints={results.map((r: any) => ({
                            id: r.id,
                            latitude: r.location.lat,
                            longitude: r.location.lng,
                            title: r.name,
                            type: targetRole
                        }))}
                        onCenterChange={setCenter}
                    />

                    {/* Floating Legend / Info */}
                    <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg shadow border text-xs space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span>Top Match ({">"}80%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                            <span>Good Match</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
