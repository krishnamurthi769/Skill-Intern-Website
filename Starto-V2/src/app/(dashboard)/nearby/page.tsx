"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapContainer from "@/components/map/MapContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Briefcase, Building, Users, Search } from "lucide-react";
import { ConnectionRequestModal } from "@/components/connections/ConnectionRequestModal";
import { useJsApiLoader, Marker } from "@react-google-maps/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MAP_ICONS } from "@/lib/map-icons";

const LIBRARIES: ("places")[] = ["places"];

interface NearbyProfile {
    profileId: string;
    userId: string;
    name: string | null;
    image: string | null;
    role: string | null;
    city: string | null;
    distance_km: number | null;
    latitude: number;
    longitude: number;

    // Extra fields
    headline?: string;
    skills?: string[];
    firmName?: string;
    investorType?: string;
    stage?: string;
    industry?: string;
    companyName?: string;
    providerType?: string;
    sectors?: string[];
}

export default function NearbyPage() {
    const { isLoaded } = useJsApiLoader({
        id: "starto-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    const [role, setRole] = useState("freelancer");
    const [city, setCity] = useState("Bangalore");
    const [radius, setRadius] = useState(20);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 });

    // Connection Modal State
    const [selectedProfileForConnect, setSelectedProfileForConnect] = useState<NearbyProfile | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<NearbyProfile | null>(null);

    // Fetch logic
    const { data } = useQuery({
        queryKey: ["nearby", role, city, radius, mapCenter.lat, mapCenter.lng],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set("role", role);
            if (city) params.set("city", city);
            params.set("radius", radius.toString());
            params.set("lat", mapCenter.lat.toString());
            params.set("lng", mapCenter.lng.toString());

            const res = await fetch(`/api/nearby?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch nearby users");
            return res.json() as Promise<{ data: NearbyProfile[] }>;
        },
    });

    const profiles = data?.data || [];

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden relative">
            {/* Top Control Bar (Floating) */}
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-2 pointer-events-none">
                <div className="bg-background/90 backdrop-blur border p-2 rounded-xl shadow-lg pointer-events-auto flex items-center gap-2 max-w-2xl w-full">
                    {/* Role Tabs */}
                    <div className="flex bg-muted rounded-lg p-1 gap-1">
                        {[
                            { id: "freelancer", icon: User, label: "Freelancer" },
                            { id: "investor", icon: Briefcase, label: "Investor" },
                            { id: "startup", icon: Building, label: "Startup" },
                            { id: "space", icon: Users, label: "Space" }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setRole(item.id); setSelectedMarker(null); }}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${role === item.id
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/50"
                                    }`}
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-border mx-2" />

                    {/* City Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-2 top-2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City..."
                            className="pl-8 h-9 bg-transparent border-none focus-visible:ring-0"
                        />
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 w-full h-full relative">
                <MapContainer isLoaded={isLoaded} userLocation={mapCenter}>
                    {profiles.map((profile) => (
                        <Marker
                            key={profile.profileId}
                            position={{
                                lat: Number(profile.latitude) || 12.9716, // Fallback if invalid
                                lng: Number(profile.longitude) || 77.5946
                            }}
                            onClick={() => setSelectedMarker(profile)}
                            icon={
                                role === "freelancer" ? MAP_ICONS.freelancer :
                                    role === "investor" ? MAP_ICONS.investor :
                                        role === "startup" ? MAP_ICONS.startup :
                                            MAP_ICONS.space
                            }
                        />
                    ))}
                </MapContainer>

                {/* Selected Profile Card Overlay */}
                {selectedMarker && (
                    <div className="absolute bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 z-10">
                        <Card className="shadow-2xl animate-in slide-in-from-bottom-5">
                            <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                                    {selectedMarker.image ? (
                                        <img src={selectedMarker.image} alt={selectedMarker.name || ""} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="text-base truncate">{selectedMarker.name || "Unknown User"}</CardTitle>
                                    <p className="text-xs text-muted-foreground truncate scroll-m-20">
                                        {selectedMarker.headline || selectedMarker.firmName || selectedMarker.industry || selectedMarker.companyName || role}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedMarker(null)}>
                                    <span className="sr-only">Close</span>
                                    ×
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                    <MapPin className="w-3 h-3" />
                                    {selectedMarker.city || "Unknown City"}
                                    {selectedMarker.distance_km && ` • ${selectedMarker.distance_km.toFixed(1)} km away`}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {(selectedMarker.skills || selectedMarker.sectors || []).slice(0, 3).map((tag: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 h-5">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full h-8 text-xs" onClick={() => setSelectedProfileForConnect(selectedMarker)}>
                                    Connect
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>

            {/* Connection Modal */}
            {selectedProfileForConnect && (
                <ConnectionRequestModal
                    isOpen={!!selectedProfileForConnect}
                    onClose={() => setSelectedProfileForConnect(null)}
                    receiverId={selectedProfileForConnect.userId}
                    receiverName={selectedProfileForConnect.name || "User"}
                />
            )}
        </div>
    );
}
