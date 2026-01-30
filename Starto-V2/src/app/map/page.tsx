"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import MapContainer from "@/components/map/MapContainer";
import { startoMapStyle } from "@/components/map/startoMapStyle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Map as MapIcon, List, X } from "lucide-react";
import { Marker, OverlayView } from "@react-google-maps/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Types
type Need = {
    id: string;
    founderId: string;
    category: string;
    description: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    createdAt: string;
    founder: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
        city: string;
        image: string | null;
    }
};

type Helper = {
    id: string;
    name: string;
    role: "FREELANCER" | "INVESTOR" | "PROVIDER"; // Using existing enum stats
    latitude: number;
    longitude: number;
    city: string;
    image: string | null;
    // ... profiles
};

function MapContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const containerRef = useRef(null);
    const [query, setQuery] = useState(initialQuery);

    const [needs, setNeeds] = useState<Need[]>([]);
    const [helpers, setHelpers] = useState<Helper[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState<Need | Helper | null>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default BLR
    const [showMapMobile, setShowMapMobile] = useState(false); // Mobile Toggle State

    // Fetch Data
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`/api/map?category=${query}`);
                const data = await res.json();
                if (data.needs) setNeeds(data.needs);
                if (data.helpers) setHelpers(data.helpers);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load map data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [query]);

    // GSAP Feed Animation
    useGSAP(() => {
        if (!loading && (needs.length > 0 || helpers.length > 0)) {
            gsap.fromTo(".feed-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, { dependencies: [loading, needs, helpers], scope: containerRef });

    // Handle Card Click (Focus Map)
    const handleCardClick = (item: Need | Helper) => {
        setSelectedItem(item);

        // Extract coordinates safely based on type
        // Check if 'founder' exists to distinguish "Need" from "Helper"
        let lat: number | undefined;
        let lng: number | undefined;

        if ('founder' in item) {
            const need = item as Need;
            lat = need.founder?.latitude;
            lng = need.founder?.longitude;
        } else {
            const helper = item as Helper;
            lat = helper.latitude;
            lng = helper.longitude;
        }

        if (lat && lng) {
            setMapCenter({ lat, lng });
            // On mobile, switch to map view automatically
            if (window.innerWidth < 768) {
                setShowMapMobile(true);
            }
        }
    };

    // Render Pin Icon based on Type
    const getPinIcon = (type: string) => {
        // Red for Need (Founder), Blue for Freelancer, Green Investor, Purple Provider
        let color = "red";
        if (type === "FREELANCER") color = "blue";
        if (type === "INVESTOR") color = "green";
        if (type === "PROVIDER" || type === "SPACE_PROVIDER") color = "purple";

        return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
    };

    return (
        <div ref={containerRef} className="flex h-screen w-full bg-[#050505] text-white overflow-hidden relative">

            {/* MOBILE TOGGLE BUTTON */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-2xl bg-primary text-black hover:bg-white transition-transform active:scale-95"
                    onClick={() => setShowMapMobile(!showMapMobile)}
                >
                    {showMapMobile ? <List className="h-6 w-6" /> : <MapIcon className="h-6 w-6" />}
                </Button>
            </div>

            {/* LEFT PANEL: FEED (Swiggy Style) */}
            {/* Logic: Hidden on mobile if map is shown, Block on desktop always */}
            <div className={`w-full md:w-[400px] lg:w-[450px] flex flex-col border-r border-white/10 z-20 bg-[#111] transition-transform duration-300 absolute inset-0 md:relative ${showMapMobile ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                {/* Header */}
                <div className="p-4 border-b border-white/10 space-y-4">
                    <h1 className="text-xl font-bold">Discover</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for help..."
                            className="pl-10 bg-white/5 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-white/20"
                        />
                    </div>
                    {/* Filters Row */}
                    <div className="flex gap-2 text-xs overflow-x-auto pb-2 custom-scrollbar">
                        <FilterBadge active label="All" />
                        <FilterBadge label="Tech" />
                        <FilterBadge label="Design" />
                        <FilterBadge label="Investing" />
                    </div>
                </div>

                {/* Feed List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {loading ? <div className="text-center text-gray-500 py-10">Loading...</div> : (
                        <>
                            {/* Section: Needs (Priority) */}
                            {needs.length > 0 && (
                                <div className="space-y-3">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest sticky top-0 bg-[#111] py-2 z-10">
                                        Needs Nearby
                                    </h2>
                                    {needs.map(need => (
                                        <div
                                            key={need.id}
                                            onClick={() => handleCardClick(need as any)}
                                            className={`feed-item group p-4 rounded-xl border cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg ${selectedItem?.id === need.id ? 'bg-white/10 border-primary/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="text-sm font-bold text-red-400">WANT HELP</span>
                                                </div>
                                                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">{need.urgency}</span>
                                            </div>
                                            <h3 className="font-bold text-lg leading-tight mb-1">{need.category}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2">{need.description}</p>

                                            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden relative">
                                                        {need.founder.image ? (
                                                            <Image src={need.founder.image} alt={need.founder.name} fill className="object-cover" />
                                                        ) : <div className="w-full h-full bg-gray-600" />}
                                                    </div>
                                                    <span className="text-xs text-gray-300">{need.founder.name}</span>
                                                </div>
                                                <Button size="sm" className="h-7 text-xs bg-white text-black hover:bg-gray-200">
                                                    I Can Help
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Section: Helpers */}
                            {helpers.length > 0 && (
                                <div className="space-y-3 mt-6">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest sticky top-0 bg-[#111] py-2 z-10">
                                        People
                                    </h2>
                                    {helpers.map(helper => (
                                        <div
                                            key={helper.id}
                                            onClick={() => handleCardClick(helper as any)}
                                            className={`feed-item p-3 rounded-lg flex items-center gap-3 cursor-pointer border transition-all hover:bg-white/5 ${selectedItem?.id === helper.id ? 'bg-white/10 border-blue-500/50' : 'bg-transparent border-transparent hover:border-white/10'}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden shrink-0 relative">
                                                {helper.image ? (
                                                    <Image src={helper.image} alt={helper.name} fill className="object-cover" />
                                                ) : <div className="w-full h-full bg-gray-600" />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm truncate">{helper.name}</h4>
                                                <p className="text-xs text-blue-400 capitalize">{helper.role.toLowerCase()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: MAP */}
            {/* Logic: Hidden on mobile unless toggled, Block on desktop always */}
            <div className={`fixed inset-0 z-10 md:static md:flex-1 bg-[#050505] transition-transform duration-300 ${showMapMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                {/* Mobile Header Overlay to Close Map */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <Button variant="secondary" size="sm" onClick={() => setShowMapMobile(false)} className="shadow-xl bg-[#111] text-white border border-white/10">
                        <X className="mr-2 h-4 w-4" /> Close Map
                    </Button>
                </div>

                <MapContainer
                    isLoaded={true} // Assuming script loaded in layout or handled by wrapper
                    userLocation={mapCenter}
                    onLoad={(map) => { }}
                    options={{ styles: startoMapStyle, disableDefaultUI: true, backgroundColor: "#050505" }}
                >
                    {/* Render Pins */}
                    {needs.map(need => (
                        <Marker
                            key={`need-${need.id}`}
                            position={{ lat: need.founder.latitude || 0, lng: need.founder.longitude || 0 }}
                            icon={{ url: getPinIcon("NEED") }}
                            onClick={() => {
                                setSelectedItem(need as any);
                                // Optional: On mobile, clicking a pin could show a bottom sheet card?
                                // For now, just focus.
                            }}
                            animation={google.maps.Animation.DROP}
                        />
                    ))}
                    {helpers.map(helper => (
                        <Marker
                            key={`helper-${helper.id}`}
                            position={{ lat: helper.latitude || 0, lng: helper.longitude || 0 }}
                            icon={{ url: getPinIcon(helper.role) }}
                            onClick={() => setSelectedItem(helper as any)}
                        />
                    ))}
                </MapContainer>

                {/* Optional: Map Overlay or Floating Actions */}
            </div>

        </div>
    );
}

export default function V2MapPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#050505] text-white">Loading Map...</div>}>
            <MapContent />
        </Suspense>
    )
}

function FilterBadge({ label, active }: { label: string, active?: boolean }) {
    return (
        <button className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${active ? "bg-white text-black" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
            {label}
        </button>
    )
}
