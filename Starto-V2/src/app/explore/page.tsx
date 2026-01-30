"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, TrendingUp, AlertTriangle, Users, Sparkles, DollarSign, Store, X, ArrowRight, Activity } from "lucide-react";
import LocationSearchInput from "@/components/common/LocationSearchInput";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeBusiness, AnalysisResult } from "@/lib/business-analyzer";
import MapContainer from "@/components/map/MapContainer";
import { useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { startoMapStyle } from "@/components/map/startoMapStyle";
import { useTheme } from "next-themes"; // For Light/Dark Map Style handling
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { LimitReachedModal } from "@/components/explore/LimitReachedModal";

const libraries: "places"[] = ["places"];

function ExploreContent() {

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const { isLoaded } = useJsApiLoader({
        id: "starto-map-script",
        googleMapsApiKey: key,
        libraries
    });

    const { theme } = useTheme();
    const { data: session } = useSession();
    const searchParams = useSearchParams();

    // --- State ---
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [step, setStep] = useState<"input" | "analyzing" | "result">("input");

    // Handle URL Params (from Homepage)
    useEffect(() => {
        const query = searchParams.get("search");
        if (query) {
            setDomain(query);
            // Optional: You could auto-trigger analyze here if location was pre-filled or defaulted.
        }
    }, [searchParams]);

    // Inputs
    const [location, setLocation] = useState<{ address: string, lat: number, lng: number } | null>(null);
    const [domain, setDomain] = useState("");
    const [budget, setBudget] = useState("Medium");

    // Analysis
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [realCompetitors, setRealCompetitors] = useState<any[]>([]); // Store real places
    const [selectedCompetitor, setSelectedCompetitor] = useState<any | null>(null); // For InfoWindow

    // Map State
    const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    // Sync map with location selection
    useEffect(() => {
        if (location) {
            setMapCenter({ lat: location.lat, lng: location.lng });
        }
    }, [location]);

    // --- Actions ---

    const handleAnalyze = async () => {
        if (!domain || !location) return;

        // --- LIMIT CHECK ---
        if (!session) {
            const count = parseInt(localStorage.getItem("explore_trials") || "0");
            if (count >= 3) {
                setShowLimitModal(true);
                return;
            }
            localStorage.setItem("explore_trials", (count + 1).toString());
        }

        setStep("analyzing");
        setRealCompetitors([]); // Clear old

        // 1. Trigger Real Google Places Search if Map is Ready
        if (mapInstance && window.google) {
            const service = new google.maps.places.PlacesService(mapInstance);
            const request = {
                location: new google.maps.LatLng(location.lat, location.lng),
                radius: 1500, // 1.5km radius
                keyword: domain // e.g. "Chai Shop"
            };

            service.nearbySearch(request, (results, status) => {
                let foundPlaces: any[] = [];
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    foundPlaces = results.map(p => ({
                        id: p.place_id,
                        name: p.name,
                        lat: p.geometry?.location?.lat(),
                        lng: p.geometry?.location?.lng(),
                        rating: p.rating,
                        address: p.vicinity,
                        types: p.types
                    }));
                }

                setRealCompetitors(foundPlaces);

                // 2. Run Analysis based on REAL data
                setTimeout(() => {
                    const analysis = analyzeBusiness(domain, location.address, budget, foundPlaces);
                    setResult(analysis);
                    setStep("result");

                    // Zoom slightly to fit (optional)
                    if (foundPlaces.length > 0) {
                        const bounds = new google.maps.LatLngBounds();
                        bounds.extend({ lat: location.lat, lng: location.lng });
                        foundPlaces.slice(0, 10).forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
                        mapInstance.fitBounds(bounds);
                    } else {
                        mapInstance.setZoom(14);
                        mapInstance.panTo({ lat: location.lat, lng: location.lng });
                    }

                }, 1500); // Small delay for UX "Scanning" feel
            });
        } else {
            // Fallback if map not ready (should happen rarely)
            setTimeout(() => {
                const analysis = analyzeBusiness(domain, location.address, budget, []);
                setResult(analysis);
                setStep("result");
            }, 1000);
        }
    };

    const handleReset = () => {
        setStep("input");
        setResult(null);
        setRealCompetitors([]);
        setSelectedCompetitor(null);
        if (location && mapInstance) {
            mapInstance.setZoom(14);
            mapInstance.panTo({ lat: location.lat, lng: location.lng });
        }
    };

    return (
        <div className="relative w-full h-screen bg-gray-100 dark:bg-black overflow-hidden flex flex-col">

            {/* --- LAYER 1: FULL SCREEN MAP --- */}
            <div className="absolute inset-0 z-0">
                <MapContainer
                    isLoaded={isLoaded}
                    userLocation={mapCenter}
                    onLoad={(map) => setMapInstance(map)}
                    options={{
                        styles: theme === "light" ? [] : startoMapStyle, // Use default for Light, Starto Dark for Dark
                        disableDefaultUI: true,
                        zoomControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                        clickableIcons: true,
                        backgroundColor: theme === "light" ? "#f3f4f6" : "#050505",
                    }}
                >
                    {/* User Pin */}
                    {location && (
                        <Marker
                            position={{ lat: location.lat, lng: location.lng }}
                            animation={google.maps.Animation.DROP}
                        />
                    )}

                    {/* REAL Competitor Markers */}
                    {step === "result" && realCompetitors.map((comp) => (
                        <Marker
                            key={comp.id}
                            position={{ lat: comp.lat, lng: comp.lng }}
                            onClick={() => setSelectedCompetitor(comp)}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                fillColor: "#ef4444", // Red for competitors
                                fillOpacity: 0.9,
                                scale: 7,
                                strokeColor: "white",
                                strokeWeight: 2,
                            }}
                        />
                    ))}

                    {/* InfoWindow for Competitors */}
                    {selectedCompetitor && (
                        <InfoWindow
                            position={{ lat: selectedCompetitor.lat, lng: selectedCompetitor.lng }}
                            onCloseClick={() => setSelectedCompetitor(null)}
                        >
                            <div className="p-2 min-w-[200px] text-black">
                                <h3 className="font-bold text-sm">{selectedCompetitor.name}</h3>
                                <p className="text-xs text-gray-600 mb-1">{selectedCompetitor.address}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                        ★ {selectedCompetitor.rating || "N/A"}
                                    </span>
                                    <span className="text-[10px] text-gray-400 capitalize">
                                        {selectedCompetitor.types?.[0]?.replace(/_/g, " ")}
                                    </span>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </MapContainer>
            </div>

            {/* --- LAYER 2: APP OVERLAYS --- */}

            {/* Top Gradient Fade */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/80 dark:from-black/80 to-transparent pointer-events-none z-10" />

            {/* Navigation */}
            {/* Navigation */}
            <div className="absolute top-4 left-4 md:top-6 md:right-6 z-30">
                <a href="/dashboard">
                    <Button variant="outline" className="bg-white/80 dark:bg-black/50 backdrop-blur-md border-gray-200 dark:border-white/10 text-xs font-medium h-9 px-4 hover:bg-white dark:hover:bg-black/80 transition-all shadow-sm">
                        ← <span className="hidden md:inline">Back to Dashboard</span><span className="md:hidden">Back</span>
                    </Button>
                </a>
            </div>

            {/* INPUT PANEL (Floating Top Left) */}
            {/* INPUT PANEL (Floating Top Left on Desktop / Bottom Sheet on Mobile) */}
            <div className={`absolute z-20 w-full md:max-w-[360px] 
                bottom-0 left-0 right-0 md:top-24 md:left-8 md:bottom-auto 
                ${step === 'result' ? 'hidden md:block' : 'block'} 
            `}>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl md:rounded-2xl rounded-t-3xl border-t md:border border-gray-200 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                    <div className="p-5 space-y-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                                <Image src="/logo-v2.png" alt="Starto" fill className="object-cover" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none">Starto</h2>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Market Intelligence</p>
                            </div>
                        </div>

                        {/* 1. Location */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider ml-1">Location</label>
                            <LocationSearchInput
                                placeholder="Search City, Area..."
                                defaultValue={location?.address}
                                onLocationSelect={(loc) => setLocation({ address: loc.address, lat: loc.latitude, lng: loc.longitude })}
                            />
                        </div>

                        {/* 2. Domain */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider ml-1">Business Domain</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-9 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 h-10 focus:bg-gray-200 dark:focus:bg-white/10 transition-colors"
                                    placeholder="e.g. Chai Shop, Gym..."
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 3. Budget */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider ml-1">Est. Budget (INR)</label>
                            <div className="grid grid-cols-3 gap-1">
                                {["Low", "Medium", "High"].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setBudget(level)}
                                        className={`
                                            h-9 rounded-md text-xs font-medium transition-all border
                                            ${budget === level
                                                ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg"
                                                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10"}
                                        `}
                                    >
                                        <span className="block text-[10px] opacity-70">
                                            {level === "Low" ? "₹" : level === "Medium" ? "₹₹" : "₹₹₹"}
                                        </span>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Btn */}
                        <Button
                            onClick={handleAnalyze}
                            disabled={!location || !domain || step === "analyzing"}
                            className="w-full h-11 bg-primary text-white dark:text-black font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-2"
                        >
                            {step === "analyzing" ? (
                                <span className="flex items-center gap-2">Scanning Real World...</span>
                            ) : (
                                <span className="flex items-center gap-2">Analyze Market <ArrowRight className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>


            {/* RESULTS PANEL (Floating Right Side) */}
            <AnimatePresence>
                {step === "result" && result && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="absolute md:top-24 md:right-8 md:bottom-6 bottom-0 left-0 right-0 z-40 w-full md:max-w-[380px] flex flex-col h-[70vh] md:h-auto pointer-events-none"
                    >
                        {/* Scrollable Container */}
                        <div className="bg-white/95 dark:bg-[#0A0A0A] backdrop-blur-xl border-t md:border border-gray-200 dark:border-white/10 rounded-t-3xl md:rounded-2xl shadow-[0_-10px_50px_rgba(0,0,0,0.2)] flex flex-col h-full pointer-events-auto overflow-hidden">

                            {/* Header */}
                            <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{domain}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" /> {location?.address?.split(',')[0]}
                                    </p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={handleReset}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

                                {/* 1. Demand Score */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demand Score</h4>
                                        <Badge className={`border ${result.demand.score > 70 ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20" : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"}`}>
                                            {result.demand.label}
                                        </Badge>
                                    </div>
                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.demand.score}%` }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className={`absolute top-0 left-0 h-full rounded-full ${result.demand.score > 70 ? "bg-green-500" : "bg-yellow-500"}`}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                        {result.demand.details}
                                    </p>
                                </div>

                                {/* 2. Competition & Risk Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5">
                                        <div className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> Competition
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{result.competition.density}</div>
                                        <div className="text-xs text-gray-500 mt-1">{result.competition.count} Nearby</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5">
                                        <div className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Risk Level
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{result.risk.level}</div>
                                        <div className="text-xs text-gray-500 mt-1">{result.risk.factors.length} factors</div>
                                    </div>
                                </div>

                                {/* 3. Risk Factors */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Risk Factors</h4>
                                    <ul className="space-y-2">
                                        {result.risk.factors.map((f, i) => (
                                            <li key={i} className="text-xs text-red-600 dark:text-red-200 flex items-start gap-2 bg-red-50 dark:bg-red-500/10 p-2 rounded border border-red-100 dark:border-red-500/20">
                                                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 4. Starto Suggestions */}
                                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Starto Insights
                                    </h4>
                                    <div className="space-y-3">
                                        {result.suggestions.map((s, i) => (
                                            <div key={i} className="flex gap-3 text-xs text-gray-700 dark:text-gray-200">
                                                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-mono font-bold text-[10px]">
                                                    {i + 1}
                                                </div>
                                                <span className="leading-snug">{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-center">
                                <Button variant="link" className="text-xs text-gray-500 hover:text-black dark:hover:text-white h-auto p-0">
                                    View Full Report Details
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile / Empty State Hint */}
            {!result && (
                <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center pointer-events-none">
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400 animate-pulse">
                        Use the panel to analyze a market opportunity
                    </div>
                </div>
            )}

            <LimitReachedModal open={showLimitModal} />
        </div >
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-black text-white">Loading Intelligence...</div>}>
            <ExploreContent />
        </Suspense>
    )
}
