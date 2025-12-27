// src/components/maps/MapDashboard.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import ConnectionButton from "@/components/connections/ConnectionButton";
import { GoogleMap, Marker, useJsApiLoader, Circle, InfoWindow } from "@react-google-maps/api";

type NearbyPoint = {
    id: string;
    latitude: number;
    longitude: number;
    city?: string;
    distance_km?: number;
    [k: string]: any;
};

export default function MapDashboard({
    center,
    role = "freelancer",
    radiusKm = 5,
    externalPoints,
    onCenterChange
}: {
    center: { lat: number; lng: number };
    role?: "freelancer" | "startup" | "provider" | "investor";
    radiusKm?: number;
    externalPoints?: NearbyPoint[];
    onCenterChange?: (center: { lat: number; lng: number }) => void;
}) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const { isLoaded } = useJsApiLoader({ id: "starto-map-script", googleMapsApiKey: key, libraries: ["places"] });
    const [internalPoints, setInternalPoints] = useState<NearbyPoint[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<NearbyPoint | null>(null);

    // Use external points if provided, otherwise internal
    const points = externalPoints || internalPoints;

    const fetchNearby = useCallback(async () => {
        if (externalPoints) return; // Don't fetch if external points provided
        if (!center || !center.lat || !center.lng) return;
        const url = `/api/nearby/${role}s?lat=${center.lat}&lng=${center.lng}&radius=${radiusKm}`;
        try {
            const res = await fetch(url);
            const body = await res.json();
            setInternalPoints(body.data || []);
        } catch (e) {
            console.error("Failed to fetch nearby data", e);
        }
    }, [center, radiusKm, role, externalPoints]);

    useEffect(() => {
        if (!center) return;
        fetchNearby();
        // If you want real-time polling: setInterval(fetchNearby, 10000)
    }, [center, fetchNearby]);

    const handleMapDragEnd = (map: google.maps.Map) => {
        if (onCenterChange) {
            const newCenter = map.getCenter();
            if (newCenter) {
                onCenterChange({ lat: newCenter.lat(), lng: newCenter.lng() });
            }
        }
    };

    if (!isLoaded) return <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>;

    return (
        <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%", borderRadius: "0.5rem" }} // Changed height to 100% to fill container
            center={center}
            zoom={13}
            onDragEnd={() => { /* We need ref to map instance to get center, for now simplistic approach or skip */ }}
            onLoad={(map) => {
                map.addListener("dragend", () => {
                    const c = map.getCenter();
                    if (c && onCenterChange) onCenterChange({ lat: c.lat(), lng: c.lng() });
                });
            }}
            options={{
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [{ "weight": "2.00" }]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [{ "color": "#9c9c9c" }]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [{ "visibility": "on" }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{ "color": "#f2f2f2" }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry.fill",
                        "stylers": [{ "color": "#ffffff" }]
                    },
                    {
                        "featureType": "landscape.man_made",
                        "elementType": "geometry.fill",
                        "stylers": [{ "color": "#ffffff" }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [{ "color": "#eeeeee" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#7b7b7b" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.stroke",
                        "stylers": [{ "color": "#ffffff" }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [{ "visibility": "simplified" }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [{ "color": "#c8d7d4" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#070707" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.stroke",
                        "stylers": [{ "color": "#ffffff" }]
                    }
                ]
            }}
        >
            <Marker position={center} label="You" />
            <Circle center={center} radius={radiusKm * 1000} options={{ fillOpacity: 0.05, strokeOpacity: 0.2, strokeColor: "#2563EB", fillColor: "#2563EB" }} />
            {points.map((p) => (
                <Marker
                    key={p.id}
                    position={{ lat: p.latitude, lng: p.longitude }}
                    onClick={() => setSelectedPoint(p)}
                />
            ))}

            {selectedPoint && (
                <InfoWindow
                    position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }}
                    onCloseClick={() => setSelectedPoint(null)}
                >
                    <div className="p-2 min-w-[200px] bg-card rounded-md">
                        <h3 className="font-bold text-sm text-card-foreground">{selectedPoint.firmName || selectedPoint.companyName || selectedPoint.name || "User"}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{selectedPoint.city}</p>

                        {/* Rich Context */}
                        <div className="text-xs text-card-foreground mb-2 space-y-1">
                            {selectedPoint.skills && <p><strong className="text-muted-foreground">Skills:</strong> {Array.isArray(selectedPoint.skills) ? selectedPoint.skills.slice(0, 3).join(", ") : selectedPoint.skills}</p>}
                            {selectedPoint.industry && <p><strong className="text-muted-foreground">Industry:</strong> {selectedPoint.industry}</p>}
                            {selectedPoint.stage && <p><strong className="text-muted-foreground">Stage:</strong> {selectedPoint.stage}</p>}
                            {selectedPoint.providerType && <p><strong className="text-muted-foreground">Type:</strong> {selectedPoint.providerType}</p>}
                        </div>

                        {selectedPoint.distance_km && (
                            <p className="text-xs font-semibold mt-1 mb-2 text-primary">{selectedPoint.distance_km.toFixed(1)} km away</p>
                        )}
                        <ConnectionButton toUserId={selectedPoint.id} className="w-full text-xs py-1" />
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
