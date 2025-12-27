import { useEffect, useState } from "react";
import { Marker, OverlayView } from "@react-google-maps/api";

type EntityType = "startup" | "investor" | "freelancer" | "space";

interface EcosystemEntity {
    id: string;
    lat: number;
    lng: number;
    type: EntityType;
    name: string;
    realName: string;
    category: string;
    stat: string;
}

const COLORS = {
    startup: "#a78bfa",
    investor: "#4ade80",
    freelancer: "#22d3ee",
    space: "#fb923c",
};

const ICONS = {
    startup: "M3 21h18M5 21V7l8-4 8 4v14M6 10h2v2H6v-2zm0 4h2v2H6v-2zm0 4h2v2H6v-2zm4-8h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-8h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z",
    investor: "M20 7h-4V4c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zM10 4h4v3h-4V4zm-6 5h16v10H4V9z",
    freelancer: "M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z",
    space: "M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
};

const getMarkerIcon = (type: EntityType) => {
    const color = COLORS[type];
    const path = ICONS[type];
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="${path}" />
        </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

interface EcosystemMarkersProps {
    center: { lat: number; lng: number } | null;
    map: google.maps.Map | null;
    hiddenTypes?: EntityType[];
    industry?: string;
}

const INDUSTRY_TO_KEYWORDS: Record<string, string> = {
    // Technology
    "SaaS": "software company",
    "Fintech": "bank",
    "Edtech": "school",
    "Healthtech": "hospital",
    "AI": "technology park",
    "Ecommerce": "logistics",

    // Traditional
    "Retail": "shopping_mall",
    "Hospitality": "hotel",
    "Manufacturing": "factory",
    "Food": "restaurant",
    "Real Estate": "real_estate_agency"
};

export const EcosystemMarkers = ({ center, map, hiddenTypes = [], industry = "SaaS" }: EcosystemMarkersProps) => {
    const [entities, setEntities] = useState<EcosystemEntity[]>([]);
    const [hoveredEntity, setHoveredEntity] = useState<EcosystemEntity | null>(null);

    useEffect(() => {
        let isMounted = true;
        if (!center || !map) return;

        // 1. Create Places Service
        const service = new google.maps.places.PlacesService(map);
        const location = new google.maps.LatLng(center.lat, center.lng);
        const radius = 2000; // 2km radius

        const allEntities: EcosystemEntity[] = [];

        // Helper to fetch and map
        const fetchType = (keyword: string, type: EntityType, defaultCat: string) => {
            if (hiddenTypes.includes(type)) return Promise.resolve();
            return new Promise<void>((resolve) => {
                service.nearbySearch({
                    location,
                    radius,
                    keyword
                }, (results, status) => {
                    if (!isMounted) return;
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        results.forEach((place) => {
                            if (!place.geometry?.location) return;
                            allEntities.push({
                                id: place.place_id || Math.random().toString(),
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng(),
                                type,
                                name: type,
                                realName: place.name || "Unknown",
                                category: defaultCat, // We could parse types[], but keep simple for now
                                stat: place.rating ? `${place.rating} ★ Rating` : "Active"
                            });
                        });
                    }
                    resolve();
                });
            });
        };

        // 2. Mock Freelancers (Since they aren't on Maps)
        const addMockFreelancers = () => {
            if (hiddenTypes.includes("freelancer")) return;
            const spread = 0.015;
            const names = ["Amit V.", "Sarah J.", "Rahul K.", "Priya S.", "Mike C."];
            const roles = ["Full Stack", "Designer", "Product Mgr", "DevOps"];
            for (let i = 0; i < 5; i++) {
                allEntities.push({
                    id: `fr-${i}`,
                    lat: center.lat + (Math.random() - 0.5) * spread,
                    lng: center.lng + (Math.random() - 0.5) * spread,
                    type: "freelancer",
                    name: "Freelancer",
                    realName: names[i],
                    category: roles[Math.floor(Math.random() * roles.length)],
                    stat: "Available"
                });
            }
        };

        // 3. Execute Searches Parallelly
        // Get keyword for industry, default to software company if not found
        // Simple heuristic: if industry string contains key, use it
        let industryKeyword = "software company";
        const normalizedIndustry = industry || "";

        for (const [key, val] of Object.entries(INDUSTRY_TO_KEYWORDS)) {
            if (normalizedIndustry.toLowerCase().includes(key.toLowerCase())) {
                industryKeyword = val;
                break;
            }
        }

        Promise.all([
            fetchType(industryKeyword, "startup", "Competitor / Hub"), // Dynamic Competitor
            fetchType("coworking space", "space", "Coworking"),
            fetchType("Venture Capital", "investor", "Financial Firm")
        ]).then(() => {
            if (!isMounted) return;
            addMockFreelancers();
            // dedupe by ID just in case
            const unique = Array.from(new Map(allEntities.map(item => [item.id, item])).values());
            // Limit to prevent clutter if too many
            setEntities(unique.slice(0, 25));
        });

        return () => { isMounted = false; };
    }, [center, map]);

    if (!center) return null;

    return (
        <>
            {entities.map((entity) => (
                <Marker
                    key={entity.id}
                    position={{ lat: entity.lat, lng: entity.lng }}
                    icon={{
                        url: getMarkerIcon(entity.type),
                        scaledSize: new google.maps.Size(32, 32),
                        anchor: new google.maps.Point(16, 16)
                    }}
                    onMouseOver={() => setHoveredEntity(entity)}
                    onMouseOut={() => setHoveredEntity(null)}
                    opacity={1}
                />
            ))}

            {hoveredEntity && (
                <OverlayView
                    position={{ lat: hoveredEntity.lat, lng: hoveredEntity.lng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="relative bottom-12 -left-1/2 transform -translate-x-1/2 w-48 pointer-events-none">
                        <div className="bg-[#111]/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: COLORS[hoveredEntity.type] }} />
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                    {hoveredEntity.type}
                                </span>
                            </div>
                            <h4 className="text-white font-bold text-sm leading-tight mb-1 truncate">{hoveredEntity.realName}</h4>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-300 truncate">{hoveredEntity.category}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-medium">
                                    {hoveredEntity.stat}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#111]/90" />
                        </div>
                    </div>
                </OverlayView>
            )}
        </>
    );
};
