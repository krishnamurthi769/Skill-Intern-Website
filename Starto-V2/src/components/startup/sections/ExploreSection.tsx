"use client"

import SplitView from "@/components/maps/SplitView"

export function ExploreSection() {
    return (
        <div className="h-full">
            <SplitView
                role="startup"
                initialCenter={{ lat: 37.7749, lng: -122.4194 }} // Default to SF or use user location context if available
            />
        </div>
    )
}
