"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

type FilterBarProps = {
    targetRole: "startup" | "freelancer" | "investor" | "provider";
    onFilterChange: (filters: any) => void;
};

export default function FilterBar({ targetRole, onFilterChange }: FilterBarProps) {
    const [filters, setFilters] = useState({
        city: "",
        radius: "5",
        // specific filters
        skills: "",
        industry: "",
        stage: "",
        spaceType: ""
    });

    const handleChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="flex flex-wrap gap-4 bg-muted/50 border border-border p-4 rounded-lg mb-6 items-end">
            {/* Common Filters */}
            <div className="flex-1 min-w-[150px]">
                <label className="text-xs text-muted-foreground block mb-1">City</label>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="San Francisco..."
                        className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={filters.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                    />
                </div>
            </div>

            <div className="min-w-[100px]">
                <label className="text-xs text-muted-foreground block mb-1">Radius (km)</label>
                <select
                    className="w-full py-2 px-3 bg-background border border-input rounded text-sm text-foreground focus:border-primary outline-none"
                    value={filters.radius}
                    onChange={(e) => handleChange("radius", e.target.value)}
                >
                    <option value="2">2 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                </select>
            </div>

            {/* Role Specific Filters */}
            {targetRole === "freelancer" && (
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-muted-foreground block mb-1">Skills (comma sep)</label>
                    <input
                        placeholder="React, Node, Design..."
                        className="w-full px-4 py-2 bg-background border border-input rounded text-sm text-foreground focus:border-primary outline-none"
                        value={filters.skills}
                        onChange={(e) => handleChange("skills", e.target.value)}
                    />
                </div>
            )}

            {targetRole === "startup" && (
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-muted-foreground block mb-1">Industry</label>
                    <select
                        className="w-full py-2 px-3 bg-background border border-input rounded text-sm text-foreground focus:border-primary outline-none"
                        value={filters.industry}
                        onChange={(e) => handleChange("industry", e.target.value)}
                    >
                        <option value="">All Industries</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Healthtech">Healthtech</option>
                        <option value="AI">AI</option>
                        <option value="Ecommerce">Ecommerce</option>
                    </select>
                </div>
            )}

            {targetRole === "investor" && (
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-muted-foreground block mb-1">Preferred Stage</label>
                    <select
                        className="w-full py-2 px-3 bg-background border border-input rounded text-sm text-foreground focus:border-primary outline-none"
                        value={filters.stage}
                        onChange={(e) => handleChange("stage", e.target.value)}
                    >
                        <option value="">All Stages</option>
                        <option value="Idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="Growth">Growth</option>
                        <option value="Scale">Scale</option>
                    </select>
                </div>
            )}

            {targetRole === "provider" && (
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs text-muted-foreground block mb-1">Space Type</label>
                    <select
                        className="w-full py-2 px-3 bg-background border border-input rounded text-sm text-foreground focus:border-primary outline-none"
                        value={filters.spaceType}
                        onChange={(e) => handleChange("spaceType", e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Co-working">Co-working</option>
                        <option value="Private Office">Private Office</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Gym">Gym</option>
                    </select>
                </div>
            )}

        </div>
    );
}
