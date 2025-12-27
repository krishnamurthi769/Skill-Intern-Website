"use client";
import React, { useState, useEffect, Suspense } from "react";

export const dynamic = "force-dynamic";
import LocationSelector from "@/components/location/LocationSelector";
import { useUser } from "@/hooks/useUser";
import StartoMap from "@/components/map-engine/StartoMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "next/navigation";



function NearbyContent() {
    const { dbUser } = useUser();
    const searchParams = useSearchParams();
    const defaultTab = searchParams?.get("tab") || "freelancer";

    // Default center (Bangalore) fallback if user location missing
    const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
    const [radius, setRadius] = useState([5]);
    const [activeRole, setActiveRole] = useState<string>(defaultTab);
    const [locName, setLocName] = useState("Bangalore, India");

    // 1. Sync Center with User Location on Mount
    useEffect(() => {
        if (dbUser?.latitude && dbUser?.longitude) {
            setCenter({ lat: dbUser.latitude, lng: dbUser.longitude });
            setLocName(dbUser.city || "My Location");
        }
    }, [dbUser]);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header / Controls */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sticky top-0 z-10">
                <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                Nearby Ecosystem
                                <Badge variant="outline" className="text-xs font-normal">
                                    {locName}
                                </Badge>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Discover opportunities within {radius}km of your location.
                            </p>
                        </div>

                        {/* Radius Slider */}
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <span className="text-sm font-medium whitespace-nowrap">Radius: {radius}km</span>
                            <Slider
                                value={radius}
                                min={1}
                                max={50}
                                step={1}
                                onValueChange={setRadius}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Role Tabs - Mutually Exclusive */}
                    <Tabs defaultValue={defaultTab} value={activeRole} onValueChange={setActiveRole} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                            <TabsTrigger value="founder">Startups</TabsTrigger>
                            <TabsTrigger value="freelancer">Talent</TabsTrigger>
                            <TabsTrigger value="investor">Investors</TabsTrigger>
                            <TabsTrigger value="space_provider">Spaces</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-4">
                    {/* Map */}
                    <div className="lg:col-span-3 h-full relative border-r">
                        <StartoMap
                            mode="functional"
                            role={activeRole as any}
                            center={center}
                            onCenterChange={setCenter}
                            className="w-full h-full"
                        />
                        {/* Floating Filters Button (Mobile) could go here */}
                    </div>

                    {/* Sidebar / List View (Optional for future, currently Filters or Empty State) */}
                    <div className="lg:col-span-1 p-4 overflow-y-auto bg-muted/10 hidden lg:block">
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <h3 className="font-semibold text-sm">Refine Location</h3>
                                    <LocationSelector
                                        onSelect={(loc) => {
                                            setCenter({ lat: loc.latitude, lng: loc.longitude });
                                            setLocName(loc.city || "Unknown Location");
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground pt-2">
                                        Changing this updates your temporary view. Go to Settings to update your permanent base.
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="p-4 rounded-lg border border-dashed text-center space-y-3">
                                <h4 className="font-medium text-sm">Quick Tips</h4>
                                <ul className="text-xs text-muted-foreground text-left space-y-2 list-disc pl-4">
                                    <li>Green pins are verified startups.</li>
                                    <li>Use the radius slider to expand your search.</li>
                                    <li>Click on any pin to Connect via WhatsApp.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NearbyPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading nearby ecosystem...</div>}>
            <NearbyContent />
        </Suspense>
    );
}
