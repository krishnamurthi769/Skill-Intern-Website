"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedLocation {
    id: string;
    address: string;
    score: number;
    competition: string;
    demand: string;
    risk: string;
    createdAt: string;
}

export function SavedLocationsWidget() {
    const { data: locations, isLoading } = useQuery({
        queryKey: ["saved-locations"],
        queryFn: async () => {
            const res = await fetch("/api/locations/save");
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            return json.data as SavedLocation[];
        }
    });

    if (isLoading) {
        return <Skeleton className="h-[200px] w-full rounded-xl" />;
    }

    if (!locations || locations.length === 0) {
        return null; // Don't show if empty
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Tracked Markets
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {locations.map((loc) => (
                        <div key={loc.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium truncate max-w-[200px] sm:max-w-xs" title={loc.address}>
                                    {loc.address.split(",")[0]}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Score: <span className="font-bold text-primary">{loc.score}/100</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {loc.competition} Comp
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    {loc.demand} Demand
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
