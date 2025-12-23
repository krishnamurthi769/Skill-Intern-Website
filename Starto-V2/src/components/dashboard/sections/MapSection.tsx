"use client";

import React, { useState } from "react";
import StartoMap from "@/components/map-engine/StartoMap";
import LocationSelector from "@/components/location/LocationSelector";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Building2, User, Warehouse } from "lucide-react";

type UserRole = "founder" | "freelancer" | "investor" | "provider";
type TargetRole = "founder" | "freelancer" | "investor" | "space_provider";

interface MapSectionProps {
    userRole: UserRole;
}

export function MapSection({ userRole }: MapSectionProps) {
    const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
    // Default target based on User Role
    const [targetRole, setTargetRole] = useState<TargetRole>(() => {
        if (userRole === "founder") return "freelancer";
        return "founder";
    });

    const isFounder = userRole === "founder";

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Explore Ecosystem</h2>
                    <p className="text-muted-foreground">Find opportunities and connections nearby.</p>
                </div>

                {/* Founder Toggle Controls */}
                {isFounder && (
                    <div className="flex gap-2 bg-muted p-1 rounded-lg">
                        <Button
                            variant={targetRole === "freelancer" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTargetRole("freelancer")}
                            className="text-xs"
                        >
                            <User className="w-3 h-3 mr-1" /> Freelancers
                        </Button>
                        <Button
                            variant={targetRole === "investor" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTargetRole("investor")}
                            className="text-xs"
                        >
                            <Building2 className="w-3 h-3 mr-1" /> Investors
                        </Button>
                        <Button
                            variant={targetRole === "space_provider" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTargetRole("space_provider")}
                            className="text-xs"
                        >
                            <Warehouse className="w-3 h-3 mr-1" /> Spaces
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
                {/* Sidebar Controls */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <Card className="border-muted/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LocationSelector
                                onSelect={(loc) => {
                                    setCenter({ lat: loc.latitude, lng: loc.longitude });
                                }}
                            />
                            <div className="mt-4 text-xs text-muted-foreground">
                                <p>Center Lat: {center.lat.toFixed(4)}</p>
                                <p>Center Lng: {center.lng.toFixed(4)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-muted/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Radius (km)</label>
                                <input type="range" min="1" max="50" defaultValue="5" className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>1km</span>
                                    <span>50km</span>
                                </div>
                            </div>
                            {/* Add more filters here later (Industry, etc.) */}
                        </CardContent>
                    </Card>
                </div>

                {/* Map Area */}
                <div className="lg:col-span-9 h-full rounded-xl overflow-hidden border border-border shadow-sm">
                    <StartoMap
                        mode="functional"
                        role={targetRole}
                        center={center}
                        onCenterChange={setCenter}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
