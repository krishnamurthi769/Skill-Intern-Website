export const startoMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#0f0f0f" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f0f0f" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#6f6f6f" }] },

    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c1c1c" }] },
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },

    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1c24" }] },

    { featureType: "poi", stylers: [{ visibility: "off" }] },

    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#8a8a8a" }]
    }
];
