"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin } from "lucide-react";
import LocationSelector from "@/components/location/LocationSelector";
import { toast } from "sonner";

export default function OnboardingLocationPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleContinue = async () => {
        if (!selectedLocation?.city || !selectedLocation?.latitude) {
            toast.error("Please select a valid location to continue.");
            return;
        }

        setLoading(true);
        try {
            // Update User Location
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    city: selectedLocation.city,
                    state: selectedLocation.state,
                    country: selectedLocation.country,
                    pincode: selectedLocation.pincode,
                    // address: selectedLocation.address // Optional, if you want to save exact address
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to save location: ${res.status}`);
            }

            // Update session
            await update({
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                city: selectedLocation.city
            });

            // Redirect to Profile Step (Core Flow Reordered)
            router.push("/onboarding/profile");
            toast.success("All set! Welcome to Starto.");

        } catch (error) {
            console.error(error);
            toast.error("Failed to save location. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Where are you based?</h2>
                    <p className="mt-2 text-muted-foreground">
                        Your location helps us connect you with nearby opportunities.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-left">
                    <label className="block text-sm font-medium mb-3">Search your city or area</label>
                    <LocationSelector onSelect={(loc) => setSelectedLocation(loc)} />

                    <div className="mt-6">
                        <button
                            onClick={handleContinue}
                            disabled={loading}
                            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Enter Dashboard"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
