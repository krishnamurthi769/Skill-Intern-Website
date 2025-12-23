"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader, Circle, InfoWindow } from "@react-google-maps/api";
import { BRAND_MAP_STYLE, FUNCTIONAL_MAP_STYLE, HERO_MAP_STYLE, HERO_MAP_STYLE_LIGHT } from "./map-styles";
import ConnectionButton from "@/components/connections/ConnectionButton";
import { motion } from "framer-motion";

// --- Types ---

type MapMode = "brand" | "functional" | "hero";

type MapRole = "founder" | "freelancer" | "investor" | "space_provider";

type NearbyPoint = {
    id: string;
    latitude: number;
    longitude: number;
    city?: string;
    distance_km?: number;
    type?: string;
    [k: string]: any;
};

interface StartoMapProps {
    mode: MapMode;
    role?: MapRole; // Required if mode is functional
    center?: { lat: number; lng: number };
    radiusKm?: number;
    externalPoints?: NearbyPoint[]; // For functional mode override
    onCenterChange?: (center: { lat: number; lng: number }) => void;
    className?: string;
}

// --- Constants ---

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bangalore
const BRAND_CENTER = { lat: 37.7749, lng: -122.4194 }; // San Francisco
const HERO_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bangalore for Hero too

const BRAND_ZOOM = 13;
const FUNCTIONAL_ZOOM = 13;
const HERO_ZOOM = 14;

// Mock points for Brand Map (just visual clusters)
const BRAND_POINTS = [
    { id: "b1", latitude: 12.9716, longitude: 77.5946, type: "cluster" },
    { id: "b2", latitude: 12.9800, longitude: 77.6000, type: "cluster" },
    { id: "b3", latitude: 12.9600, longitude: 77.5800, type: "cluster" },
    { id: "b4", latitude: 12.9500, longitude: 77.6200, type: "cluster" },
    { id: "b5", latitude: 12.9900, longitude: 77.5700, type: "cluster" },
];

// Reference static points for Hero Map (Founders, Investors, etc with Icon types)
const HERO_POINTS: NearbyPoint[] = [
    { id: "h1", latitude: 12.9750, longitude: 77.6000, type: "founder" },
    { id: "h2", latitude: 12.9650, longitude: 77.5900, type: "investor" },
    { id: "h3", latitude: 12.9850, longitude: 77.6100, type: "freelancer" },
    { id: "h4", latitude: 12.9600, longitude: 77.6200, type: "provider" },
    { id: "h5", latitude: 12.9700, longitude: 77.5800, type: "founder" },
    { id: "h6", latitude: 12.9900, longitude: 77.6050, type: "investor" },
    { id: "h7", latitude: 12.9550, longitude: 77.5950, type: "freelancer" },
];

const LIBRARIES: ("places")[] = ["places"];

export default function StartoMap({
    mode,
    role = "founder",
    center = DEFAULT_CENTER,
    radiusKm = 5,
    externalPoints,
    onCenterChange,
    className = "",
}: StartoMapProps) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const { isLoaded } = useJsApiLoader({
        id: "starto-map-script",
        googleMapsApiKey: key,
        libraries: LIBRARIES
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [internalPoints, setInternalPoints] = useState<NearbyPoint[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<NearbyPoint | null>(null);
    const [mapCenter, setMapCenter] = useState(center);

    // --- Logic: Data Fetching (Functional) ---

    const fetchNearby = useCallback(async () => {
        if (mode !== "functional") return;
        if (externalPoints) return;

        // Map logical roles to API endpoints
        let apiEndpoint = `${role}s`; // default: freelancers, investors
        if (role === "founder") apiEndpoint = "startups";
        if (role === "space_provider") apiEndpoint = "providers";

        const url = `/api/nearby/${apiEndpoint}?lat=${mapCenter.lat}&lng=${mapCenter.lng}&radius=${radiusKm}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            const body = await res.json();
            setInternalPoints(body.data || []);
        } catch (e) {
            console.error("Failed to fetch nearby data", e);
        }
    }, [mode, role, externalPoints, mapCenter, radiusKm]);

    useEffect(() => {
        if (isLoaded && mode === "functional") {
            fetchNearby();
        }
    }, [isLoaded, mode, fetchNearby]);

    // --- Logic: Brand/Hero Animation ---

    useEffect(() => {
        if (!mapRef.current) return;

        if (mode === "hero" || mode === "brand") {
            const interval = setInterval(() => {
                if (mapRef.current) {
                    mapRef.current.panBy(0.5, 0); // Very subtle continuous pan
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isLoaded, mode]);

    // --- Render ---

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        if (mode === "functional" && onCenterChange) {
            map.addListener("dragend", () => {
                const c = map.getCenter();
                if (c) {
                    const newCenter = { lat: c.lat(), lng: c.lng() };
                    setMapCenter(newCenter);
                    onCenterChange(newCenter);
                }
            });
        }
    }, [mode, onCenterChange]);

    if (!isLoaded) return <div className={`w-full h-full min-h-[400px] bg-muted/20 animate-pulse rounded-xl ${className}`} />;

    // Determine points to show
    let points: NearbyPoint[] = [];
    if (mode === "functional") points = externalPoints || internalPoints;
    if (mode === "brand") points = BRAND_POINTS;
    if (mode === "hero") points = HERO_POINTS;

    // Determine Style
    let mapStyle: any[] = FUNCTIONAL_MAP_STYLE;
    if (mode === "brand") mapStyle = BRAND_MAP_STYLE;
    if (mode === "hero") mapStyle = HERO_MAP_STYLE_LIGHT; // Use Light Theme

    // Determine Zoom & Center
    const currentZoom = mode === "hero" ? HERO_ZOOM : (mode === "brand" ? BRAND_ZOOM : FUNCTIONAL_ZOOM);
    const currentCenter = mode === "hero" ? HERO_CENTER : (mode === "brand" ? BRAND_CENTER : center);

    const mapOptions: google.maps.MapOptions = {
        styles: mapStyle as any,
        disableDefaultUI: mode !== "functional", // Hide all UI for Brand/Hero
        zoomControl: mode === "functional",
        scrollwheel: mode === "functional",
        draggable: mode === "functional",
        keyboardShortcuts: mode === "functional",
        clickableIcons: mode === "functional",
    };

    // Helper for Custom Icons
    const getIcon = (type: string | undefined) => {
        if (!type || type === "cluster") return undefined; // use default or circle

        // Colors for Light Theme (High Contrast)
        // Founder = Primary Blue (#2563EB)
        // Investor = Green (#059669)
        // Freelancer = Purple (#9333ea)
        // Provider = Orange (#ea580c)

        let path = google.maps.SymbolPath.CIRCLE;
        let color = "#2563EB";
        let scale = 7;

        switch (type) {
            case "founder":
                color = "#2563EB"; // Blue
                break;
            case "investor":
                path = google.maps.SymbolPath.BACKWARD_CLOSED_ARROW;
                color = "#059669"; // Darker Green
                break;
            case "freelancer":
                color = "#9333ea"; // Purple
                break;
            case "provider":
                path = google.maps.SymbolPath.FORWARD_OPEN_ARROW;
                color = "#ea580c"; // Dark Orange
                break;
        }

        return {
            path,
            scale,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
        };
    };

    return (
        <div className={`relative w-full overflow-hidden rounded-xl ${className}`}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={currentCenter}
                zoom={currentZoom}
                onLoad={onLoad}
                options={mapOptions}
            >
                {/* User Location Marker (Functional Only) */}
                {mode === "functional" && (
                    <>
                        <Marker position={center} label="You" />
                        <Circle
                            center={center}
                            radius={radiusKm * 1000}
                            options={{
                                fillOpacity: 0.05,
                                strokeOpacity: 0.2,
                                strokeColor: "#2563EB",
                                fillColor: "#2563EB"
                            }}
                        />
                    </>
                )}

                {/* Points Rendering */}
                {points.map((p) => (
                    <React.Fragment key={p.id}>
                        <Marker
                            position={{ lat: p.latitude, lng: p.longitude }}
                            icon={mode === "functional" ? undefined : getIcon(p.type)}
                            label={mode === "hero" ? {
                                text: p.type ? (p.type.charAt(0).toUpperCase() + p.type.slice(1)) : "",
                                color: "black", // Dark text for Light Map
                                fontSize: "11px",
                                fontWeight: "bold",
                                className: "bg-white/90 px-2 py-0.5 rounded shadow-sm -mt-10 font-bold tracking-wide border border-gray-200"
                            } : undefined}
                            onClick={() => mode === "functional" && setSelectedPoint(p)}
                        />

                        {/* Brand Mode Visual Fluff */}
                        {(mode === "brand" || mode === "hero") && (
                            <Circle
                                center={{ lat: p.latitude, lng: p.longitude }}
                                radius={300}
                                options={{
                                    strokeColor: getIcon(p.type)?.fillColor || "#000000",
                                    strokeOpacity: 0.1,
                                    strokeWeight: 1,
                                    fillColor: getIcon(p.type)?.fillColor || "#000000",
                                    fillOpacity: 0.05,
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}

                {/* Info Window (Functional Only) */}
                {mode === "functional" && selectedPoint && (
                    <InfoWindow
                        position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }}
                        onCloseClick={() => setSelectedPoint(null)}
                    >
                        <div className="p-2 min-w-[200px] bg-card text-card-foreground">
                            <h3 className="font-bold text-sm">
                                {selectedPoint.firmName || selectedPoint.companyName || selectedPoint.name || "User"}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-1">{selectedPoint.city}</p>

                            <div className="text-xs mb-2 space-y-1">
                                {selectedPoint.skills && <p><strong className="text-muted-foreground">Skills:</strong> {Array.isArray(selectedPoint.skills) ? selectedPoint.skills.slice(0, 3).join(", ") : selectedPoint.skills}</p>}
                                {selectedPoint.industry && <p><strong className="text-muted-foreground">Industry:</strong> {selectedPoint.industry}</p>}
                            </div>

                            <ConnectionButton toUserId={selectedPoint.id} className="w-full text-xs py-1" />
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}
