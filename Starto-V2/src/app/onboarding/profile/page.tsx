"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LocationSelector from "@/components/location/LocationSelector";
import MultiSelect from "@/components/ui/MultiSelect";
import {
    SKILLS,
    EXPERIENCE_LEVELS,
    AVAILABILITY_TYPES,
    WORK_TYPES,
    INDUSTRIES,
    STARTUP_STAGES,
    TEAM_SIZES,
    FUNDING_ROUNDS,
    INVESTOR_TYPES,
    SECTORS,
    PROVIDER_TYPES
} from "@/lib/constants";

// Helper to map UI labels to Schema Enums (e.g. "Full-time" -> "FULL_TIME")
const mapToEnum = (val: string) => {
    if (!val) return undefined;
    // Edge case for ProviderType
    if (val === "Co-working") return "COWORKING";

    return val
        .replace(/\+/g, "_PLUS")
        .replace(/[-\s]/g, "_")
        .toUpperCase();
};

export default function OnboardingProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const activeRole = (session?.user as any)?.activeRole?.toLowerCase();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && !activeRole) {
            router.push("/onboarding");
        }
    }, [status, activeRole, router]);

    if (status === "loading" || !activeRole) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    role: activeRole,
                    data: formData,
                }),
            });

            if (!res.ok) throw new Error("Failed to save profile");

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Error saving profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
                    <p className="mt-2 text-muted-foreground">
                        Tell us more about your {activeRole} journey.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    {activeRole === "freelancer" && <FreelancerForm onSubmit={handleSubmit} loading={loading} />}
                    {activeRole === "startup" && <StartupForm onSubmit={handleSubmit} loading={loading} />}
                    {activeRole === "investor" && <InvestorForm onSubmit={handleSubmit} loading={loading} />}
                    {activeRole === "provider" && <ProviderForm onSubmit={handleSubmit} loading={loading} />}
                </div>
            </div>
        </div>
    );
}

// --- Sub-components (Forms) ---

function FreelancerForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        headline: "",
        phoneNumber: "",
        skills: [] as string[],
        experience: "Mid",
        availability: "Full-time",
        workType: "Remote",
        portfolio: "",
        github: "",
        linkedin: "",
        latitude: null as number | null,
        longitude: null as number | null,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "",
    });

    const handleLocationSelect = (loc: any) => {
        setFormData(prev => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            address: loc.address,
            city: loc.city || "",
            state: loc.state || "",
            country: loc.country || "",
            pincode: loc.pincode || ""
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); onSubmit({
                ...formData,
                experience: mapToEnum(formData.experience),
                availability: mapToEnum(formData.availability),
                workType: mapToEnum(formData.workType),
            });
        }} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Professional Headline</label>
                <input
                    type="text"
                    placeholder="e.g. Full-stack Developer | Next.js Expert"
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.headline}
                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                    required
                />
            </div>

            <div>
                <MultiSelect
                    label="Skills"
                    placeholder="Search skills..."
                    options={SKILLS}
                    selected={formData.skills}
                    onChange={vals => setFormData({ ...formData, skills: vals })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Experience</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.experience}
                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    >
                        {EXPERIENCE_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Availability</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.availability}
                        onChange={e => setFormData({ ...formData, availability: e.target.value })}
                    >
                        {AVAILABILITY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Work Preference</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.workType}
                        onChange={e => setFormData({ ...formData, workType: e.target.value })}
                    >
                        {WORK_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="url"
                    placeholder="Portfolio URL"
                    className="w-full p-3 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    value={formData.portfolio}
                    onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                />
                <input
                    type="url"
                    placeholder="GitHub URL"
                    className="w-full p-3 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    value={formData.github}
                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                />
                <input
                    type="url"
                    placeholder="LinkedIn URL"
                    className="w-full p-3 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    value={formData.linkedin}
                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">WhatsApp Number (Required for connections)</label>
                <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="space-y-4">
                    <LocationSelector onSelect={handleLocationSelect} />
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="City" className="w-full p-3 bg-background border border-input rounded-xl outline-none" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                        <input placeholder="State" className="w-full p-3 bg-background border border-input rounded-xl outline-none" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                        <input placeholder="Country" className="w-full p-3 bg-background border border-input rounded-xl outline-none" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                        <input placeholder="Pincode" className="w-full p-3 bg-background border border-input rounded-xl outline-none" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? "Saving Profile..." : "Complete Onboarding"}
            </button>
        </form>
    );
}

function StartupForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        oneLiner: "",
        industry: "SaaS",
        stage: "Idea",
        teamSize: "1-10",
        fundingRound: "Bootstrapped",
        minHiringBudget: 0,
        maxHiringBudget: 0,
        description: "",
        website: "",
        latitude: null as number | null,
        longitude: null as number | null,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "",
    });

    const handleLocationSelect = (loc: any) => {
        setFormData(prev => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            address: loc.address,
            city: loc.city || "",
            state: loc.state || "",
            country: loc.country || "",
            pincode: loc.pincode || ""
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); onSubmit({
                ...formData,
                stage: mapToEnum(formData.stage),
                fundingRound: mapToEnum(formData.fundingRound),
            });
        }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Startup Name</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                    <input
                        type="tel"
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">One-Liner</label>
                <input
                    type="text"
                    placeholder="What does your startup do in one sentence?"
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.oneLiner}
                    onChange={e => setFormData({ ...formData, oneLiner: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.industry}
                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    >
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Current Stage</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.stage}
                        onChange={e => setFormData({ ...formData, stage: e.target.value })}
                    >
                        {STARTUP_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Team Size</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.teamSize}
                        onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                    >
                        {TEAM_SIZES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Funding Status</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.fundingRound}
                        onChange={e => setFormData({ ...formData, fundingRound: e.target.value })}
                    >
                        {FUNDING_ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <textarea
                    rows={4}
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="space-y-4">
                    <LocationSelector onSelect={handleLocationSelect} />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? "Launching..." : "Complete Onboarding"}
            </button>
        </form>
    );
}

function InvestorForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        investorType: "Angel",
        sectors: [] as string[],
        stages: [] as string[],
        thesisNote: "",
        isPublic: true,
        latitude: null as number | null,
        longitude: null as number | null,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "",
    });

    const handleLocationSelect = (loc: any) => {
        setFormData(prev => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            address: loc.address,
            city: loc.city || "",
            state: loc.state || "",
            country: loc.country || "",
            pincode: loc.pincode || ""
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); onSubmit({
                ...formData,
                investorType: mapToEnum(formData.investorType),
                stages: formData.stages.map(s => mapToEnum(s)),
            });
        }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                    <input
                        type="tel"
                        required
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Investment Thesis</label>
                <textarea
                    placeholder="What kinds of startups do you invest in?"
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.thesisNote}
                    onChange={e => setFormData({ ...formData, thesisNote: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Investor Type</label>
                <select
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.investorType}
                    onChange={e => setFormData({ ...formData, investorType: e.target.value })}
                >
                    {INVESTOR_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            <div>
                <MultiSelect
                    label="Preferred Stages"
                    options={STARTUP_STAGES as unknown as string[]}
                    selected={formData.stages}
                    onChange={vals => setFormData({ ...formData, stages: vals })}
                />
            </div>

            <div>
                <MultiSelect
                    label="Sectors of Interest"
                    options={SECTORS}
                    selected={formData.sectors}
                    onChange={vals => setFormData({ ...formData, sectors: vals })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <LocationSelector onSelect={handleLocationSelect} />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? "Processing..." : "Finish Onboarding"}
            </button>
        </form>
    );
}

function ProviderForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        companyName: "",
        providerType: "Co-working",
        description: "",
        capacity: 10,
        latitude: null as number | null,
        longitude: null as number | null,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "",
    });

    const handleLocationSelect = (loc: any) => {
        setFormData(prev => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            address: loc.address,
            city: loc.city || "",
            state: loc.state || "",
            country: loc.country || "",
            pincode: loc.pincode || ""
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); onSubmit({
                ...formData,
                providerType: mapToEnum(formData.providerType),
            });
        }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                    <input
                        type="tel"
                        required
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                    type="text"
                    required
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Space Type</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.providerType}
                        onChange={e => setFormData({ ...formData, providerType: e.target.value })}
                    >
                        {PROVIDER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.capacity}
                        onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <LocationSelector onSelect={handleLocationSelect} />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? "Listing..." : "Register as Provider"}
            </button>
        </form>
    );
}
