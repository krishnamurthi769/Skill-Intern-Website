"use client";

import MapContainer from "@/components/map/MapContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2, RefreshCw, Sparkles, Lightbulb, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { startoMapStyle } from "@/components/map/startoMapStyle";
import { EcosystemMarkers } from "@/components/map/EcosystemMarkers";

const LIBRARIES: ("places")[] = ["places"];

// [ICONS] Copied from EcosystemMarkers to ensure visual consistency in Legend
const LEGEND_ICONS = {
    startup: <path d="M3 21h18M5 21V7l8-4 8 4v14M6 10h2v2H6v-2zm0 4h2v2H6v-2zm0 4h2v2H6v-2zm4-8h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-8h2v2h-2v-2zm0 4h2v2h-2v-2z" />,
    investor: <path d="M20 7h-4V4c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zM10 4h4v3h-4V4zm-6 5h16v10H4V9z" />,
    space: <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />,
    freelancer: <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" />
};

const LEGEND_COLORS = {
    startup: "#a78bfa",
    investor: "#4ade80",
    space: "#fb923c",
    freelancer: "#22d3ee"
};

// Analysis Type interface
interface AnalysisResult {
    competition: string;
    demand: string;
    risk: string;
    score: number;
    analysisType: string;
    ecosystem: {
        coworking: number;
        investors: number;
        startups: number;
    };
    reasons: string[];
    industryInsight: string;
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
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    const { data: session } = useSession();

    // --- Refs ---
    const mapRef = useRef<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

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
        setMapInstance(map);
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

        if (!mapInstance) {
            toast.error("Map not ready. Please wait.");
            return;
        }

        setLoading(true);

        try {
            const service = new google.maps.places.PlacesService(mapInstance);
            const location = new google.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
            const radius = 2000;

            const getCount = (keyword: string) => {
                return new Promise<number>((resolve) => {
                    service.nearbySearch({ location, radius, keyword }, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                            resolve(results.length);
                        } else {
                            resolve(0);
                        }
                    });
                });
            };

            const [techCount, coworkingCount, investorCount, collegeCount, cafeCount] = await Promise.all([
                getCount(industry),
                getCount("coworking space"),
                getCount("Venture Capital"),
                getCount("university"),
                getCount("cafe")
            ]);

            if (!isMounted.current) return;

            const reasons: string[] = [];
            let industryInsight = "";

            const isTech = ["SaaS", "Fintech", "Software", "Tech", "AI"].some(t => industry.includes(t));

            // --- REASON ENGINE 2.0 (Deterministic) ---
            if (isTech) {
                // TALENT SIGNAL (University/Colleges)
                if (collegeCount > 3) reasons.push("Talent: Strong access to skilled graduates from nearby institutions.");
                else reasons.push("Talent: Recruitment may be challenging due to low density of technical institutes.");

                // INFRA SIGNAL (Coworking)
                if (coworkingCount > 2) reasons.push(`Infrastructure: ${coworkingCount} active hubs indicate a supportive startup culture.`);
                else reasons.push("Infrastructure: Lack of flexible workspace options nearby.");

                // CAPITAL SIGNAL (VCs)
                if (investorCount > 0) reasons.push(`Capital: ${investorCount} Venture Capital firms found in the immediate vicinity.`);
                else reasons.push("Capital: No immediate VC presence; fundraising may require travel.");

                industryInsight = `For a ${industry} startup, this location ${collegeCount > 2 ? "offers good talent access" : "has likely talent gaps"} and ${investorCount > 0 ? "excellent investor proximity" : "limited local funding options"}.`;
            } else {
                // RETAIL / LIFESTYLE LOGIC
                // FOOTFALL SIGNAL (Cafes/Gyms proxy)
                if (cafeCount > 15) reasons.push("Demand: High daily footfall suggested by density of existing cafes/spots.");
                else reasons.push("Demand: Lower organic foot traffic detected in this specific zone.");

                // COMPETITION SIGNAL
                reasons.push(`Competition: ${techCount} direct competitors active nearby.`);
                if (techCount > 10) reasons.push("Market: High saturation suggests intense pricing pressure.");
                else reasons.push("Market: Early-mover advantage possible in this underserved area.");

                industryInsight = `For ${industry}, success here depends on ${cafeCount > 10 ? "standing out in a busy market" : "drawing destination traffic to a quieter spot"}.`;
            }

            // Calculations
            const demandScoreVal = isTech
                ? Math.min(10, (coworkingCount + collegeCount))
                : Math.min(10, Math.floor(cafeCount / 2));

            const demandLabel = demandScoreVal > 7 ? "High" : demandScoreVal > 3 ? "Medium" : "Low";

            let competitionLabel = "Medium";
            if (techCount > 15) competitionLabel = "High";
            if (techCount < 3) competitionLabel = "Low";

            let riskLabel = "Low";
            if (isTech && (coworkingCount === 0 || collegeCount === 0)) riskLabel = "High";
            if (!isTech && cafeCount < 5) riskLabel = "High";

            // Total Score
            let totalScore = 0;
            if (isTech) {
                totalScore = 30 + (coworkingCount * 5) + (investorCount * 8) + (collegeCount * 3);
            } else {
                // Retail score based on footfall (cafes) and moderate competition
                totalScore = 30 + (cafeCount * 3) + (techCount * 1);
            }

            if (riskLabel === "High") totalScore -= 20;
            if (totalScore > 96) totalScore = 96;
            if (totalScore < 15) totalScore = 15;

            setAnalysis({
                competition: competitionLabel,
                demand: demandLabel,
                risk: riskLabel,
                score: totalScore,
                analysisType: "Deep Signal Analysis",
                ecosystem: {
                    coworking: coworkingCount,
                    investors: investorCount,
                    startups: techCount
                },
                reasons,
                industryInsight
            });

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

        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze market signals.");
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
        <div className="relative w-full h-screen bg-[#050505] text-white flex flex-col overflow-hidden">

            {/* 0. MINIMAL TOP NAVBAR */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                {/* Logo */}
                <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-black text-xl group-hover:scale-105 transition-transform">S</div>
                    <span className="font-bold text-2xl tracking-tight text-white">Starto</span>
                </Link>

                {/* Right Actions */}
                <div className="pointer-events-auto">
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-white/10">
                                    <Avatar className="h-9 w-9 border border-white/10">
                                        <AvatarImage src={session.user?.image || ""} />
                                        <AvatarFallback className="bg-primary/20 text-primary">
                                            {session.user?.name?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-white">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <Link href="/dashboard">
                                    <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/profile">
                                    <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <Link href="/api/auth/signout">
                                    <DropdownMenuItem className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" className="bg-white text-black border-white hover:bg-gray-200 hover:text-black font-bold backdrop-blur-md px-6">
                                Log in
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* ZONE 1: MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <MapContainer
                    isLoaded={isLoaded}
                    userLocation={mapCenter}
                    onLoad={handleMapLoad}
                    onClick={handleMapClick}
                    options={{
                        styles: startoMapStyle,
                        disableDefaultUI: true,
                        backgroundColor: "#050505",
                        clickableIcons: false,
                        gestureHandling: "greedy",
                    }}
                >
                    {selectedLocation && (
                        <Marker
                            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                            animation={google.maps.Animation.DROP}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            }}
                        />
                    )}
                    <EcosystemMarkers
                        map={mapInstance}
                        center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : (mapCenter || { lat: 12.9716, lng: 77.5946 })}
                        industry={industry} // Dynamic Industry
                        // Explore Mode: Always hide Freelancers (People). Hide Investors if not logged in.
                        hiddenTypes={session ? ["freelancer"] : ["freelancer", "investor"]}
                    />
                </MapContainer>
            </div>



            // ... existing code ...

            {/* MAP LEGEND (Floating) */}
            <div className={cn("absolute top-20 right-4 md:bottom-6 md:right-6 md:top-auto z-40 bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 shadow-2xl pointer-events-auto", analysis && "hidden md:block")}>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Map Legend</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={LEGEND_COLORS.startup} stroke="black" strokeWidth="1.5">
                            {LEGEND_ICONS.startup}
                        </svg>
                        <span className="text-xs font-medium text-gray-300">Startups</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={LEGEND_COLORS.space} stroke="black" strokeWidth="1.5">
                            {LEGEND_ICONS.space}
                        </svg>
                        <span className="text-xs font-medium text-gray-300">Coworking Spaces</span>
                    </div>

                    {/* Conditional Legend Items (Investors) */}
                    <div className={cn("flex items-center gap-3 transition-opacity", !session && "opacity-50")} title={!session ? "Login to view" : ""}>
                        <div className="relative">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={LEGEND_COLORS.investor} stroke="black" strokeWidth="1.5">
                                {LEGEND_ICONS.investor}
                            </svg>
                            {!session && (
                                <div className="absolute -top-1 -right-1 bg-black rounded-full p-0.5 border border-white/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-300">Investors {!session && <span className="text-[10px] text-gray-500 ml-1">(Login)</span>}</span>
                    </div>

                    {/* Conditional Legend Items (Freelancers) */}
                    <div className={cn("flex items-center gap-3 transition-opacity", !session && "opacity-50")} title={!session ? "Login to view" : ""}>
                        <div className="relative">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={LEGEND_COLORS.freelancer} stroke="black" strokeWidth="1.5">
                                {LEGEND_ICONS.freelancer}
                            </svg>
                            {!session && (
                                <div className="absolute -top-1 -right-1 bg-black rounded-full p-0.5 border border-white/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-300">Freelancers {!session && <span className="text-[10px] text-gray-500 ml-1">(Login)</span>}</span>
                    </div>
                </div>
            </div>

            {/* ZONE 2 & 3: FIXED BOTTOM PANEL */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center p-4 pointer-events-none">
                <Card className="w-full max-w-xl bg-[#111]/95 border-t border-white/10 shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-500 rounded-t-2xl rounded-b-none md:rounded-2xl md:mb-4">

                    {/* --- STATE: RESULTS --- */}
                    {analysis ? (
                        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {/* Header: Address & Score */}
                            <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg md:text-2xl font-bold text-white leading-tight break-words">{selectedLocation?.address}</h3>
                                    <p className="text-xs md:text-lg text-gray-300 font-medium mt-1">Market Opportunity Analysis</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className={cn("text-3xl md:text-5xl font-black leading-none", analysis.score > 70 ? "text-green-400" : analysis.score > 40 ? "text-yellow-400" : "text-red-400")}>
                                        {analysis.score}<span className="text-sm md:text-2xl text-gray-500 font-bold ml-0.5">/100</span>
                                    </div>
                                    <div className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Viability Score</div>
                                </div>
                            </div>

                            {/* Core Signals */}
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                                <SignalCard label="Saturation" value={analysis.competition} />
                                <SignalCard label="Demand" value={analysis.demand} />
                                <SignalCard label="Risk" value={analysis.risk} />
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* Ecosystem Stats */}
                            <div className="grid grid-cols-3 gap-2 md:gap-4 py-1 text-center">
                                <div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-white leading-none">{analysis.ecosystem.coworking}</div>
                                    <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mt-1">Hubs</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-white leading-none">{analysis.ecosystem.startups}</div>
                                    <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mt-1">Competitors</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-white leading-none">{analysis.ecosystem.investors}</div>
                                    <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mt-1">Capital</div>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 w-full" />

                            {/* REASON ENGINE LAYER */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-yellow-500" /> Analysis Reasoning
                                </h4>
                                <ul className="space-y-2">
                                    {analysis.reasons && analysis.reasons.length > 0 ? (
                                        analysis.reasons.map((reason, i) => {
                                            const [key, val] = reason.includes(":") ? reason.split(":") : ["", reason];
                                            return (
                                                <li key={i} className="text-xs md:text-sm text-gray-300 flex items-start gap-2 leading-relaxed">
                                                    <span className="text-blue-400 mt-1 text-[10px] shrink-0">●</span>
                                                    <span>
                                                        {key && <span className="text-white font-semibold">{key}:</span>}
                                                        {val}
                                                    </span>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="text-xs md:text-sm text-gray-500 italic">
                                            Insufficient ecosystem signals detected for this area.
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* INDUSTRY INSIGHT LAYER */}
                            {analysis.industryInsight && (
                                <div className="bg-blue-500/10 border border-blue-500/20 p-3 md:p-4 rounded-lg flex gap-3 text-xs md:text-sm text-blue-200">
                                    <Lightbulb className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-blue-400 mt-0.5" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Strategic Insight</span>
                                        <p className="italic leading-relaxed">"{analysis.industryInsight}"</p>
                                    </div>
                                </div>
                            )}

                            {/* HONESTY DISCLAIMER */}
                            <div className="text-[10px] text-center text-gray-500 pt-2 border-t border-white/5 leading-tight">
                                Insights are based on observable ecosystem signals and industry requirements. Not predictive guarantees.
                            </div>

                            <div className="flex gap-2 min-h-[44px]">
                                <Button variant="outline" className="flex-1 h-auto py-2 text-xs md:text-sm" onClick={handleReset}>
                                    <RefreshCw className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Try Another
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="flex-1 h-auto py-2 text-xs md:text-sm"
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
                        <CardContent className="p-4 md:p-6 space-y-5">

                            {/* 1. Location Selection */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    1. Area to Analyze
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

                            <div className="flex flex-col md:flex-row gap-4">
                                {/* 2. Industry Selection */}
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        2. Startup Domain <span className="text-red-500">*</span>
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
                                <div className="w-full md:w-[140px] space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        3. Investment Capacity
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
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing local ecosystem signals...
                                    </>
                                ) : (
                                    <>
                                        Analyze Market
                                        {!session && (
                                            <span className="ml-2 text-xs font-normal opacity-70 bg-white/10 px-2 py-0.5 rounded-full">
                                                {trialsLeft} free left
                                            </span>
                                        )}
                                    </>
                                )}
                            </Button>

                        </CardContent>
                    )
                    }
                </Card >
            </div >

            {/* Login Overlay */}
            {
                showLoginOverlay && (
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
                )
            }
        </div >
    );
}

// Sub-components for cleaner code
function SignalCard({ label, value }: { label: string, value: string }) {
    let color = "text-yellow-400";

    if (label === "Demand") {
        if (value === "High") color = "text-green-400";
        if (value === "Low") color = "text-red-400";
    } else {
        // Default (Risk/Saturation): High is Bad
        if (value === "High") color = "text-red-400";
        if (value === "Low") color = "text-green-400";
    }

    return (
        <div className="bg-white/5 md:bg-white/10 rounded-lg p-2 md:p-3 text-center border border-white/5 md:border-white/10">
            <div className="text-[10px] md:text-xs text-gray-400 md:text-gray-200 font-bold mb-0.5 md:mb-1">{label}</div>
            <div className={cn("font-bold text-xs md:text-sm", color)}>{value}</div>
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
