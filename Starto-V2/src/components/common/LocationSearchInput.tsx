"use client";

import React, { useState, useRef, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

const libraries: "places"[] = ["places"];

interface LocationResult {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

interface LocationSearchInputProps {
    defaultValue?: string;
    onLocationSelect: (location: LocationResult) => void;
    placeholder?: string;
}

export default function LocationSearchInput({ defaultValue, onLocationSelect, placeholder }: LocationSearchInputProps) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: key,
        libraries,
    });

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState(defaultValue || "");

    useEffect(() => {
        setInputValue(defaultValue || "");
    }, [defaultValue]);

    const onLoad = (autoC: google.maps.places.Autocomplete) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address || "";

                // Parse address components
                let city = "";
                let state = "";
                let country = "";
                let pincode = "";

                place.address_components?.forEach(component => {
                    const types = component.types;
                    if (types.includes("locality")) {
                        city = component.long_name;
                    } else if (types.includes("administrative_area_level_1")) {
                        state = component.long_name;
                    } else if (types.includes("country")) {
                        country = component.long_name;
                    } else if (types.includes("postal_code")) {
                        pincode = component.long_name;
                    }
                });

                // Fallback for City
                if (!city) {
                    place.address_components?.forEach(component => {
                        if (component.types.includes("administrative_area_level_2")) {
                            city = component.long_name;
                        }
                    })
                }

                setInputValue(address);
                onLocationSelect({
                    latitude: lat,
                    longitude: lng,
                    address,
                    city,
                    state,
                    country,
                    pincode
                });
            } else {
                console.warn("No geometry found for place", place);
            }
        }
    };

    if (!isLoaded) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading Maps...</div>;

    return (
        <div className="relative w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder || "Search location..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </Autocomplete>
        </div>
    );
}
