// src/app/dashboard/nearby/page.tsx
"use client";
import React, { useState } from "react";
import LocationSelector from "@/components/location/LocationSelector";
import MapDashboard from "@/components/maps/MapDashboard";

export default function NearbyPage() {
    // Default to Bangalore or some central location
    const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Nearby Talent</h1>
                <p className="text-muted-foreground">
                    Find freelancers near you. Drag the map or search a location.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* Filters / Search Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <h2 className="font-semibold mb-4">Location</h2>
                        <LocationSelector
                            onSelect={(loc) => {
                                console.log("Selected location:", loc);
                                setCenter({ lat: loc.latitude, lng: loc.longitude });
                            }}
                        />

                        <div className="mt-4 text-sm text-gray-500">
                            <p>Current Center:</p>
                            <p>Lat: {center.lat.toFixed(4)}</p>
                            <p>Lng: {center.lng.toFixed(4)}</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <h2 className="font-semibold mb-2">Filters</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Radius (km)</label>
                            <input type="range" min="1" max="50" defaultValue="5" className="w-full" onChange={(e) => {
                                // This would ideally update the state passed to MapDashboard
                                // For MVP simplicity, we fixed radius in MapDashboard props, but can lift state up here.
                            }} />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>1km</span>
                                <span>50km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Area */}
                <div className="lg:col-span-3">
                    <MapDashboard center={center} role="freelancer" radiusKm={5} />
                </div>
            </div>
        </div>
    );
}
