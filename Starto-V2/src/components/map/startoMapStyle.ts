export const startoMapStyle = [
    {
        elementType: "geometry",
        stylers: [{ color: "#171717" }] // Deep Graphite Base
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#525252" }] // Very subtle text (Neutral-600)
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#171717" }, { visibility: "on" }, { weight: 2 }] // Halo matches background for readability
    },
    // HIDE EVERYTHING FIRST
    {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }] // no icons anywhere
    },
    {
        featureType: "all",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }] // kill all text by default
    },
    // EXCEPTIONS - What we DO want
    {
        featureType: "administrative.locality",
        elementType: "labels.text",
        stylers: [{ visibility: "on" }] // Cities only
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#737373" }] // Slightly brighter for cities
    },
    // ROADS - The "Faint Veins"
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#262626" }, { visibility: "simplified" }] // Just barely visible lines
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ visibility: "off" }] // No hard edges
    },
    {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }] // ABSOLUTELY NO ROAD LABELS
    },
    // WATER - Subtle depth
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0a0a0a" }]
    },
    {
        featureType: "water",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    },
    // POI & TRANSIT - Kill
    {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }]
    }
];
