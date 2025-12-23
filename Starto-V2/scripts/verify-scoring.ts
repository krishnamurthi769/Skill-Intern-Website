
import { calculateNearbyScore, ScoringContext } from "../src/lib/matching/scoring";
import { calculateDistance } from "../src/lib/location";

// Mock Data
// Bangalore Center: 12.9716, 77.5946
const STARTUP_LOC = { lat: 12.9716, lng: 77.5946 }; // Bangalore

const MOCK_STARTUP: any = {
    id: "s1",
    latitude: STARTUP_LOC.lat,
    longitude: STARTUP_LOC.lng,
    industry: "Fintech",
    stage: "MVP",
    country: "India"
};

const MOCK_INSIGHT: any = {
    gaps: ["React", "Node.js"],
    recommendedRoles: ["Full Stack Developer"]
};

// Candidates
const CANDIDATES = [
    {
        id: "c1", // Very Near (2km), Good Match
        name: "Alice (Very Near)",
        latitude: 12.9800,
        longitude: 77.6000,
        skills: ["React", "TypeScript"],
        headline: "Senior React Developer",
        bio: "Expert in Fintech math.",
        country: "India",
        portfolio: "https://alice.dev",
        linkedin: "https://linkedin.com/in/alice",
        experience: "SENIOR"
    },
    {
        id: "c2", // Near (8km), Perfect Match
        name: "Bob (Near)",
        latitude: 13.0400,
        longitude: 77.6100,
        skills: ["React", "Node.js", "Postgres"], // Matches gaps
        headline: "Full Stack Developer", // Matches role
        bio: "Building fintech apps.",
        country: "India",
        portfolio: "https://bob.dev",
        linkedin: "https://linkedin.com/in/bob",
        experience: "MID"
    },
    {
        id: "c3", // Far (40km), Good Match
        name: "Charlie (Far)",
        latitude: 12.7000,
        longitude: 77.4000,
        skills: ["React"],
        headline: "React Dev",
        bio: "Remote worker.",
        country: "India",
        portfolio: "https://charlie.dev",
        linkedin: "https://linkedin.com/in/charlie",
        experience: "JUNIOR"
    },
    {
        id: "c4", // Very Far (100km)
        name: "Dave (Too Far)",
        latitude: 12.0000,
        longitude: 76.0000,
        skills: ["Java"],
        headline: "Java Dev",
        bio: "Enterprise.",
        country: "India",
        portfolio: "https://dave.dev",
        linkedin: "https://linkedin.com/in/dave",
        experience: "SENIOR"
    }
];

async function main() {
    console.log("🔍 Verifying Location & Scoring Logic...\n");

    const context: ScoringContext = {
        startup: MOCK_STARTUP,
        insight: MOCK_INSIGHT
    };

    const results = CANDIDATES.map(c => {
        // Mock FreelancerProfile type
        const profile: any = { ...c };
        return calculateNearbyScore(profile, context);
    });

    // Sort
    results.sort((a, b) => b.score - a.score);

    console.log("🏆 Results Ranked by Score:\n");
    results.forEach((r, i) => {
        console.log(`#${i + 1} ${r.candidate.name}`);
        console.log(`   Distance: ${r.distanceKm.toFixed(2)} km`);
        console.log(`   Total Score: ${r.score}`);
        console.log(`   Breakdown:`, r.breakdown);
        console.log("-----------------------------------");
    });
}

main().catch(console.error);
