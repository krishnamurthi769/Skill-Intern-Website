"use client";

import MapContainer from "@/components/map/MapContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Autocomplete, useJsApiLoader, Marker } from "@react-google-maps/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { startoMapStyle } from "@/components/map/startoMapStyle";

const LIBRARIES: ("places")[] = ["places"];

// Analysis Type interface
interface AnalysisResult {
    competition: string;
    demand: string;
    risk: string;
    score: number;
    ecosystem: {
        coworking: number;
        investors: number;
        startups: number;
    }
}

export default function ExplorePage() {
    const { isLoaded } = useJsApiLoader({
        id: "starto-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    // --- State ---
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number, address: string } | null>(null);
    const [industry, setIndustry] = useState<string>("");
    const [budget, setBudget] = useState<string>("medium");

    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [trialsLeft, setTrialsLeft] = useState<number>(3);
    const [showLoginOverlay, setShowLoginOverlay] = useState(false);

    const { data: session } = useSession();

    // --- Refs ---
    const mapRef = useRef<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // --- Options ---
    const INDUSTRIES = [
        "SaaS / Software", "Fintech", "E-commerce", "HealthTech", "EdTech",
        "Retail / Food", "Manufacturing", "Real Estate", "Logistics"
    ];

    // --- Init ---
    useEffect(() => {
        const attempts = localStorage.getItem("starto_trials");
        if (attempts) {
            const used = parseInt(attempts);
            setTrialsLeft(Math.max(0, 3 - used));
        }
    }, []);

    // --- Handlers ---

    const handleMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setGeocoding(true);
        setSelectedLocation({ lat, lng, address: "Fetching address..." });
        setMapCenter({ lat, lng });

        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat, lng } });

            // Priority: Sublocality > Locality > Administrative Level 2
            const bestResult = response.results.find(r =>
                r.types.includes("sublocality") ||
                r.types.includes("locality") ||
                r.types.includes("administrative_area_level_2")
            );

            if (bestResult) {
                // Use the clearer address (e.g. "Indiranagar, Bengaluru")
                const parts = bestResult.formatted_address.split(",");
                const shortAddress = parts.length > 2 ? parts.slice(0, 2).join(",") : bestResult.formatted_address;
                setSelectedLocation({ lat, lng, address: shortAddress });
            } else if (response.results[0]) {
                // Fallback to whatever we have (but try to skip street numbers)
                const address = response.results[0].formatted_address;
                // Heuristic: If starts with a number, maybe strip it? 
                // Better: just take the 2nd and 3rd part if it looks like a street address.
                const parts = address.split(",");
                const shortAddress = parts.length > 2 ? parts.slice(1, 3).join(",") : address;
                setSelectedLocation({ lat, lng, address: shortAddress });
            } else {
                setSelectedLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)} ` });
            }
        } catch (error) {
            console.error("Geocoding failed", error);
            setSelectedLocation({ lat, lng, address: "Selected Location" });
        } finally {
            setGeocoding(false);
        }
    };

    const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (!place || !place.geometry || !place.geometry.location) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setMapCenter({ lat, lng });
            setSelectedLocation({
                lat,
                lng,
                address: place.formatted_address || place.name || "Selected Location"
            });
        }
    };

    const handleAnalyze = async () => {
        // If logged in, bypass all checks
        if (!session && trialsLeft <= 0) {
            setShowLoginOverlay(true);
            return;
        }

        if (!selectedLocation || !selectedLocation.lat || !industry) {
            toast.error("Please search and select a location from the dropdown");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/explore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                    industry,
                    budget,
                    placeId: "" // Not strictly needed if we send lat/lng
                })
            });

            if (!res.ok) throw new Error("Analysis failed");

            const data = await res.json();
            setAnalysis(data);

            // Decrement trials ONLY if guest
            if (!session) {
                const currentUsed = parseInt(localStorage.getItem("starto_trials") || "0");
                const newUsed = currentUsed + 1;
                localStorage.setItem("starto_trials", newUsed.toString());
                setTrialsLeft(Math.max(0, 3 - newUsed));

                if (3 - newUsed <= 0) {
                    toast.info("You've used all your free trials!", {
                        description: "Create an account to continue exploring."
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setAnalysis(null);
        setSelectedLocation(null);
        setIndustry("");
        setBudget("medium");
        // Also clear marker by clearing selectedLocation (done above)
    };

    return (
        <div className="relative w-full h-screen bg-[#171717] text-white flex flex-col overflow-hidden">

            {/* ZONE 1: MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <MapContainer
                    isLoaded={isLoaded}
                    userLocation={mapCenter}
                    onLoad={handleMapLoad}
                    onClick={handleMapClick}
                    options={{ styles: startoMapStyle }}
                >
                    {selectedLocation && (
                        <Marker
                            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                            animation={google.maps.Animation.DROP}
                        />
                    )}
                </MapContainer>
            </div>

            {/* ZONE 2 & 3: FIXED BOTTOM PANEL */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center p-4 pointer-events-none">
                <Card className="w-full max-w-xl bg-[#111]/95 border-t border-white/10 shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-500 rounded-t-2xl rounded-b-none md:rounded-2xl md:mb-4">

                    {/* --- STATE: RESULTS --- */}
                    {analysis ? (
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold truncate max-w-[250px]">{selectedLocation?.address}</h3>
                                    <p className="text-sm text-muted-foreground">Market Opportunity Analysis</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-primary">{analysis.score}/100</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Viability Score</div>
                                </div>
                            </div>

                            {/* Core Signals */}
                            <div className="grid grid-cols-3 gap-3">
                                <SignalCard label="Market Saturation" value={analysis.competition} />
                                <SignalCard label="Consumer Demand" value={analysis.demand} />
                                <SignalCard label="Market Risk" value={analysis.risk} />
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* Ecosystem Stats */}
                            <div className="grid grid-cols-3 gap-4 py-2">
                                <StatItem label="Hubs" value={analysis.ecosystem.coworking} />
                                <StatItem label="Active Competitors" value={analysis.ecosystem.startups} />
                                <StatItem label="Capital Flow" value={analysis.ecosystem.investors} />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={handleReset}>
                                    <RefreshCw className="mr-2 h-4 w-4" /> Try Another Location
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={async () => {
                                        // Save Logic
                                        try {
                                            const res = await fetch("/api/locations/save", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    latitude: selectedLocation?.lat,
                                                    longitude: selectedLocation?.lng,
                                                    address: selectedLocation?.address,
                                                    ...analysis
                                                })
                                            });
                                            if (res.status === 401) setShowLoginOverlay(true);
                                            else if (res.ok) toast.success("Location Saved!");
                                            else throw new Error();
                                        } catch { toast.error("Error saving"); }
                                    }}
                                >
                                    📌 Save Analysis
                                </Button>
                            </div>
                        </CardContent>
                    ) : (
                        /* --- STATE: INPUTS --- */
                        <CardContent className="p-6 space-y-5">

                            {/* 1. Location Selection */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    1. Selected Location
                                </Label>
                                <div className="relative">
                                    {isLoaded ? (
                                        <Autocomplete
                                            onLoad={onLoadAutocomplete}
                                            onPlaceChanged={onPlaceChanged}
                                        >
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-primary animate-pulse" />
                                                <Input
                                                    className="pl-9 bg-background border-input focus-visible:ring-primary"
                                                    placeholder="Search location or pin on map"
                                                    value={selectedLocation ? selectedLocation.address : ""}
                                                    onChange={(e) => {
                                                        // Update address while typing, keeping lat/lng if we are just refining
                                                        // But really, if they type, we 'invalidate' the lat/lng until they select.
                                                        // Use partial object to allow typing
                                                        if (selectedLocation) {
                                                            setSelectedLocation({ ...selectedLocation, address: e.target.value });
                                                        } else {
                                                            setSelectedLocation({ lat: 0, lng: 0, address: e.target.value });
                                                        }
                                                    }}
                                                    readOnly={geocoding}
                                                />
                                                {geocoding && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                                            </div>
                                        </Autocomplete>
                                    ) : <Input disabled placeholder="Loading maps..." />}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {/* 2. Industry Selection */}
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        2. Industry <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={industry} onValueChange={setIndustry}>
                                        <SelectTrigger className="bg-background border-input">
                                            <SelectValue placeholder="Select Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 3. Budget Selection */}
                                <div className="w-[140px] space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        3. Budget
                                    </Label>
                                    <Select value={budget} onValueChange={setBudget}>
                                        <SelectTrigger className="bg-background border-input">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                size="lg"
                                className="w-full text-lg font-bold shadow-lg shadow-primary/20"
                                disabled={!selectedLocation || !industry || loading}
                                onClick={handleAnalyze}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing localized market signals...
                                    </>
                                ) : (
                                    <>Explore Market {!session && <span className="ml-2 text-xs font-normal opacity-70">({trialsLeft} left)</span>}</>
                                )}
                            </Button>

                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Login Overlay */}
            {showLoginOverlay && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="max-w-md w-full bg-[#111] border-white/10 text-white">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Get the Full Report?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <p className="text-gray-400">
                                You've hit the limit for guest exploration.
                                Create a free account to unlock detailed breakdowns, saved reports, and network access.
                            </p>
                            <div className="grid gap-3 pt-4">
                                <Link href="/login?callbackUrl=/explore" className="w-full">
                                    <Button className="w-full text-lg" size="lg">Join Starto (Free)</Button>
                                </Link>
                                <Button variant="ghost" onClick={() => setShowLoginOverlay(false)}>Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Sub-components for cleaner code
function SignalCard({ label, value }: { label: string, value: string }) {
    const color =
        value === "High" ? "text-red-400" :
            value === "Low" ? "text-green-400" : "text-yellow-400";

    return (
        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className={cn("font-bold text-sm", color)}>{value}</div>
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: number }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="font-mono font-bold">{value}</span>
        </div>
    );
}
