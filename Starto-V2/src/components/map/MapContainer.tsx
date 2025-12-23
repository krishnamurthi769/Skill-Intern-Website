"use client";

import { GoogleMap } from "@react-google-maps/api";
import { ReactNode, useCallback, useState } from "react";

const containerStyle = {
    width: "100%",
    height: "100%",
};

// Starto Custom Dark Theme
import { startoMapStyle } from "./startoMapStyle";


const center = {
    lat: 12.9716, // Bangalore
    lng: 77.5946,
};

interface MapContainerProps {
    isLoaded: boolean;
    children?: ReactNode;
    userLocation?: { lat: number; lng: number } | null;
    onLoad?: (map: google.maps.Map) => void;
    onClick?: (e: google.maps.MapMouseEvent) => void;
    options?: google.maps.MapOptions;
}

export default function MapContainer({ isLoaded, children, userLocation, onLoad, onClick, options }: MapContainerProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const handleLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
        if (onLoad) onLoad(map);
    }, [onLoad]);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#0b0b0b] text-muted-foreground animate-pulse">
                Loading Map...
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || center}
            zoom={13}
            onLoad={handleLoad}
            onUnmount={onUnmount}
            onClick={onClick}
            options={{
                styles: startoMapStyle,
                disableDefaultUI: true,
                backgroundColor: "#171717",
                clickableIcons: false, // Cleaner map
                gestureHandling: "greedy", // Better mobile handling
                ...options,
            }}
        >
            {children}
        </GoogleMap>
    );
}
