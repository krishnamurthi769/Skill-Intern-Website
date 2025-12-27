"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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

    const { data: session } = useSession();

    // -- STATE --
    const [role, setRole] = useState("freelancer");
    const [city, setCity] = useState("Bangalore"); // Display text for search input
    const [radius, setRadius] = useState(20);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 });

    // "Base" Location (User's actual location)
    const [baseLocation, setBaseLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false); // True if we are NOT at base location

    // Sync with session location once loaded (Only happens once effectively)
    useEffect(() => {
        if (session?.user?.latitude && session.user?.longitude) {
            const userLoc = {
                lat: Number(session.user.latitude),
                lng: Number(session.user.longitude),
                city: session.user.city || "Unknown"
            };
            setBaseLocation(userLoc);

            // Initial Set if not already searching
            if (!isSearching) {
                setMapCenter({ lat: userLoc.lat, lng: userLoc.lng });
                setCity(userLoc.city);
            }
        }
    }, [session]);

    // Connection Modal State
    const [selectedProfileForConnect, setSelectedProfileForConnect] = useState<NearbyProfile | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<NearbyProfile | null>(null);

    // Fetch logic
    const { data, isFetching } = useQuery({
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
    const hasResults = profiles.length > 0;

    // -- Jitter Logic for Overlapping Markers --
    const processedProfiles = profiles.map((p, i, arr) => {
        const isDuplicate = arr.filter(o => Math.abs(Number(o.latitude) - Number(p.latitude)) < 0.0001 && Math.abs(Number(o.longitude) - Number(p.longitude)) < 0.0001).length > 1;

        if (!isDuplicate) return p;

        // Apply deterministic noise based on index
        // 0.0002 deg is roughly 20 meters
        const angle = (i * (360 / arr.length)) * (Math.PI / 180);
        const radius = 0.0002 + (i % 2) * 0.0001;

        return {
            ...p,
            latitude: Number(p.latitude) + Math.sin(angle) * radius,
            longitude: Number(p.longitude) + Math.cos(angle) * radius
        };
    });

    // -- HANDLERS --

    const handleReset = () => {
        if (baseLocation) {
            setMapCenter({ lat: baseLocation.lat, lng: baseLocation.lng });
            setCity(baseLocation.city);
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden relative font-sans">

            {/* Top Control Bar (Floating) */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-2 pointer-events-none">
                <div className="bg-background/95 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-xl pointer-events-auto flex flex-col md:flex-row items-center gap-3 w-full max-w-4xl mx-auto">

                    {/* 1. Location Indicator & Search */}
                    <div className="flex items-center gap-2 flex-1 w-full md:w-auto min-w-[200px] border-r border-border/50 pr-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isSearching ? "bg-yellow-500/10 text-yellow-500" : "bg-primary/10 text-primary"}`}>
                            {isSearching ? <Search className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 relative">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5 ml-1">
                                {isSearching ? "Searching Near" : "Your Base Location"}
                            </span>
                            <div className="relative">
                                <Input
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        // Debounce logic handled below
                                        const val = e.target.value;
                                        const timeoutId = setTimeout(() => {
                                            if (val.length > 2 && !!window.google) {
                                                const geocoder = new google.maps.Geocoder();
                                                geocoder.geocode({ address: val }, (results, status) => {
                                                    if (status === "OK" && results && results[0]) {
                                                        const loc = results[0].geometry.location;
                                                        setMapCenter({ lat: loc.lat(), lng: loc.lng() });
                                                        setIsSearching(true);
                                                    }
                                                });
                                            }
                                        }, 1000);
                                    }}
                                    className="h-7 text-sm font-semibold bg-transparent border-none focus-visible:ring-0 p-0 pl-1 w-full"
                                />
                            </div>
                        </div>
                        {isSearching && (
                            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-6 px-2 hover:bg-destructive/10 hover:text-destructive">
                                Reset
                            </Button>
                        )}
                    </div>

                    {/* 2. Radius Selector */}
                    <div className="flex flex-col w-[100px] border-r border-border/50 px-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Radius</span>
                        <select
                            className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                        >
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                            <option value={50}>50 km</option>
                        </select>
                    </div>

                    {/* 3. Role Tabs */}
                    <div className="flex bg-muted/50 rounded-xl p-1 gap-1 flex-wrap justify-center">
                        {[
                            { id: "freelancer", icon: User, label: "Freelancer", color: "text-blue-500" },
                            { id: "investor", icon: Briefcase, label: "Investor", color: "text-green-500" },
                            { id: "startup", icon: Building, label: "Startup", color: "text-purple-500" },
                            { id: "space", icon: Users, label: "Space", color: "text-orange-500" }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setRole(item.id); setSelectedMarker(null); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-transparent ${role === item.id
                                    ? "bg-background text-foreground shadow-sm border-border"
                                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                    }`}
                            >
                                <item.icon className={`w-3.5 h-3.5 ${role === item.id ? item.color : ""}`} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAP LEGEND (Bottom Right) */}
            <div className="absolute bottom-6 right-4 z-10 bg-background/90 backdrop-blur border p-3 rounded-lg shadow-lg pointer-events-auto space-y-2 min-w-[140px]">
                <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Map Legend</h4>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0ea5e9] border border-white shadow-sm" />
                    <span className="text-xs font-medium">Freelancer</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e] border border-white shadow-sm" />
                    <span className="text-xs font-medium">Investor</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#a855f7] border border-white shadow-sm" />
                    <span className="text-xs font-medium">Startup</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f97316] border border-white shadow-sm" />
                    <span className="text-xs font-medium">Space</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-white shadow-sm ring-1 ring-black/10" />
                    <span className="text-xs font-bold">You (Base)</span>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 w-full h-full relative">
                <MapContainer isLoaded={isLoaded} userLocation={mapCenter}>

                    {/* USER BASE LOCATION MARKER */}
                    {baseLocation && isLoaded && window.google && (
                        <Marker
                            position={{ lat: baseLocation.lat, lng: baseLocation.lng }}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: "#22d3ee", // Cyan-400
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeWeight: 2,
                            }}
                            title="Your Base Location"
                            zIndex={999}
                        />
                    )}

                    {processedProfiles.map((profile) => (
                        <Marker
                            key={profile.profileId}
                            position={{
                                lat: Number(profile.latitude) || 12.9716,
                                lng: Number(profile.longitude) || 77.5946
                            }}
                            onClick={() => setSelectedMarker(profile)}
                            icon={
                                // Simplified Icon Logic to match Legend
                                role === "freelancer" ? MAP_ICONS.freelancer :
                                    role === "investor" ? MAP_ICONS.investor :
                                        role === "startup" ? MAP_ICONS.startup :
                                            MAP_ICONS.space
                            }
                        />
                    ))}
                </MapContainer>

                {/* Empty State Overlay */}
                {isLoaded && !hasResults && !isFetching && (
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur border border-border px-5 py-3 rounded-xl text-center shadow-lg pointer-events-none max-w-sm">
                        <p className="font-bold text-sm text-foreground">No {role}s found nearby.</p>
                        <p className="text-xs text-muted-foreground mt-1">Try increasing the radius to <b>{radius < 50 ? "20 or 50 km" : "see more"}</b> or search for a major city.</p>
                    </div>
                )}

                {/* Selected Profile Card Overlay */}
                {selectedMarker && (
                    <div className="absolute bottom-8 left-4 md:left-8 md:bottom-8 w-full md:w-80 z-10 pr-8 md:pr-0">
                        <Card className="shadow-2xl animate-in fade-in slide-in-from-bottom-4 border-primary/20">
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
                                    <p className="text-xs text-muted-foreground truncate font-medium">
                                        {selectedMarker.headline || selectedMarker.firmName || selectedMarker.industry || selectedMarker.companyName || role}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setSelectedMarker(null)}>
                                    <span className="sr-only">Close</span>
                                    ×
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-3">
                                    <MapPin className="w-3 h-3 text-primary" />
                                    {selectedMarker.city || "Unknown City"}
                                    {selectedMarker.distance_km && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-auto">{selectedMarker.distance_km.toFixed(1)} km away</span>}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {(selectedMarker.skills || selectedMarker.sectors || []).slice(0, 3).map((tag: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 h-5 font-normal bg-secondary/50">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full h-8 text-xs font-bold" onClick={() => setSelectedProfileForConnect(selectedMarker)}>
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
