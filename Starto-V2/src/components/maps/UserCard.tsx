"use client";

import ConnectionButton from "@/components/connections/ConnectionButton";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";

interface UserCardProps {
    user: any;
    onHover?: () => void;
    onClick?: () => void;
}

export default function UserCard({ user, onHover, onClick }: UserCardProps) {
    // API returns distanceKm, legacy might use distance_km
    const distance = user.distanceKm ?? user.distance_km;

    return (
        <div
            className="p-4 border border-border bg-card rounded-lg hover:bg-accent/50 transition-colors cursor-pointer flex flex-col gap-3 group relative"
            onMouseEnter={onHover}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    {user.image && (
                        <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                        <h3 className="font-bold text-card-foreground text-lg leading-tight">
                            {user.firmName || user.companyName || user.name || "User"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.headline || user.city}</p>
                    </div>
                </div>
                {distance !== undefined && (
                    <Badge variant="outline" className="font-mono text-xs">
                        {typeof distance === 'number' ? distance.toFixed(1) : distance} km
                    </Badge>
                )}
            </div>

            {/* Match Score Badge */}
            {user.matchScore !== undefined && (
                <div className="flex items-center gap-2">
                    <Badge className={`${user.matchScore >= 80 ? "bg-green-600 hover:bg-green-700" : "bg-indigo-500 hover:bg-indigo-600"} text-white border-0`}>
                        {Math.round(user.matchScore)}% Match
                    </Badge>
                    {user.matchScore >= 80 && <span className="text-xs text-green-600 font-medium">✨ Top Pick</span>}
                </div>
            )}

            {/* AI Reason */}
            {user.reason && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded flex items-start gap-2">
                    <Zap className="w-3 h-3 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="italic leading-snug text-xs">"{user.reason}"</span>
                </div>
            )}

            {/* Context Stats */}
            <div className="text-sm text-card-foreground space-y-1">
                {user.skills && user.skills.length > 0 && (
                    <p className="line-clamp-1"><span className="text-muted-foreground text-xs">Skills:</span> {user.skills.slice(0, 3).join(", ")}</p>
                )}
                {user.industry && <p><span className="text-muted-foreground text-xs">Industry:</span> {user.industry}</p>}
            </div>

            <div className="mt-auto pt-2">
                <ConnectionButton toUserId={user.userId || user.id} className="w-full py-1 text-sm h-8" />
            </div>
        </div>
    );
}
