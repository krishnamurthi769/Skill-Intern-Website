// src/components/location/LocationSelector.tsx
"use client";
import React, { useEffect, useRef } from "react";

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

export default function LocationSelector({ onSelect, placeholder = "Search location", initialValue = "" }: Props) {
    const ref = useRef<HTMLInputElement | null>(null);
    const autoRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        // Check if google is available. It should be loaded by the parent or script tag.
        if (typeof google === "undefined" || !google.maps || !google.maps.places) {
            console.warn("Google Maps API not loaded");
            return;
        }

        const input = ref.current;
        autoRef.current = new google.maps.places.Autocomplete(input, {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: [] }, // specify if you want only IN
        });

        autoRef.current.addListener("place_changed", () => {
            const place = autoRef.current!.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const address = place.formatted_address || place.name || input.value;

            // parse components
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
        };
    }, [onSelect]);

    return (
        <input
            ref={ref}
            defaultValue={initialValue}
            placeholder={placeholder}
            className="w-full rounded border px-3 py-2 bg-background border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
    );
}
