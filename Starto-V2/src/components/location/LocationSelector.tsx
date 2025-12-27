// src/components/location/LocationSelector.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

type Props = {
    onSelect: (payload: {
        address: string;
        latitude: number;
        longitude: number;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    }) => void;
    placeholder?: string;
    initialValue?: string;
};

const LIBRARIES: ("places")[] = ["places"];

export default function LocationSelector({ onSelect, placeholder = "Search location", initialValue = "" }: Props) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const { isLoaded } = useJsApiLoader({
        id: "starto-map-script",
        googleMapsApiKey: key,
        libraries: LIBRARIES
    });

    const inputRef = useRef<HTMLInputElement | null>(null);
    const autoRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!isLoaded || !inputRef.current) return;

        // Initialize Autocomplete
        autoRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            types: ["geocode", "establishment"],
            fields: ["geometry", "formatted_address", "address_components", "name"]
        });

        const listener = autoRef.current.addListener("place_changed", () => {
            const place = autoRef.current?.getPlace();
            if (!place || !place.geometry || !place.geometry.location) return;

            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const address = place.formatted_address || place.name || inputRef.current?.value || "";

            // Parse Components
            const comp = (place.address_components || []).reduce((acc: any, c: any) => {
                for (const t of c.types) acc[t] = c.long_name;
                return acc;
            }, {});

            onSelect({
                address,
                latitude,
                longitude,
                city: comp.locality || comp.postal_town || comp.sublocality,
                state: comp.administrative_area_level_1 || comp.administrative_area_level_2,
                country: comp.country,
                pincode: comp.postal_code,
            });
        });

        return () => {
            if (autoRef.current) {
                google.maps.event.clearInstanceListeners(autoRef.current);
            }
            if (listener) listener.remove();
        };
    }, [isLoaded, onSelect]);

    if (!isLoaded) {
        return (
            <input
                disabled
                placeholder="Loading map..."
                className="w-full rounded border px-3 py-2 bg-background border-input opacity-50 cursor-wait"
            />
        );
    }

    return (
        <input
            ref={inputRef}
            defaultValue={initialValue}
            placeholder={placeholder}
            className="w-full rounded border px-3 py-2 bg-background border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
    );
}
