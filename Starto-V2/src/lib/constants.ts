
// Enums (Stable)
export const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior", "Expert"] as const;
export const AVAILABILITY_TYPES = ["Full-time", "Part-time", "Hourly"] as const;
export const WORK_TYPES = ["Remote", "Onsite", "Hybrid"] as const;
export const STARTUP_STAGES = ["Idea", "MVP", "Growth", "Scale"] as const;
export const TEAM_SIZES = ["Solo", "1-10", "10-50", "50+"] as const;
export const FUNDING_ROUNDS = ["Bootstrapped", "Pre-Seed", "Seed", "Series A", "Series B+"] as const;
export const INVESTOR_TYPES = ["Angel", "VC", "Syndicate", "Accelerator"] as const;
export const PROVIDER_TYPES = ["Co-working", "Private Office", "Cafe", "Gym", "Retail", "Industrial"] as const;

// Validated Lists (Volatile)
export const SKILLS = [
    "React", "Next.js", "Node.js", "Python", "TypeScript", "TailwindCSS", "Figma",
    "UI/UX", "Mobile Dev", "Flutter", "React Native", "Go", "Rust", "AWS", "Google Cloud",
    "Firebase", "Supabase", "PostgreSQL", "MongoDB", "GraphQL", "DevOps", "Docker", "Kubernetes",
    "Marketing", "SEO", "Content Writing", "Sales", "Business Dev"
];

export const INDUSTRIES = [
    "Fintech", "Edtech", "Healthtech", "E-commerce", "SaaS", "AI/ML",
    "Blockchain", "Logistics", "Real Estate", "Media", "Gaming", "Cleantech", "Agritech"
];

export const SECTORS = INDUSTRIES; // Reusing for now, can diverge if needed

export const AMENITIES = [
    "High-speed Wifi", "Meeting Rooms", "Coffee/Tea", "24/7 Access",
    "Printer", "Parking", "Pet Friendly", "Nap Room", "Event Space",
    "Gym Access", "Phone Booths", "Reception", "Mail Handling"
];
