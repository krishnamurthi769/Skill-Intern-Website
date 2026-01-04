"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

// Helper to map UI labels to Schema Enums
const mapToEnum = (val: string) => {
    if (!val) return undefined;
    if (val === "Co-working") return "COWORKING";
    return val.replace(/\+/g, "_PLUS").replace(/[-\s]/g, "_").toUpperCase();
};

export default function OnboardingProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const activeRole = (session?.user as any)?.activeRole?.toLowerCase();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && !activeRole) {
            router.push("/onboarding/role");
        }
    }, [status, activeRole, router]);

    if (status === "loading" || !activeRole) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        try {
            // VALIDATION: Strict checks before sending anything
            if (activeRole === "freelancer" && (!formData.skills || formData.skills.length === 0)) {
                alert("Please select at least one skill.");
                setLoading(false);
                return;
            }
            if (activeRole === "investor" && (!formData.sectors || formData.sectors.length === 0)) {
                alert("Please select at least one sector of interest.");
                setLoading(false);
                return;
            }
            if (activeRole === "investor" && (!formData.stages || formData.stages.length === 0)) {
                alert("Please select at least one stage preference.");
                setLoading(false);
                return;
            }

            // 1. Prepare Profile Data
            const profileData = { ...formData };

            // STEP 1: Update Role Profile (CRITICAL: Do this BEFORE marking onboarded)
            const profileRes = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    role: activeRole,
                    data: profileData,
                }),
            });

            if (!profileRes.ok) {
                const err = await profileRes.json();
                throw new Error(err.error || "Failed to save profile details");
            }

            // 2. Prepare User Data (Name, Phone, Onboarded Status)
            const userPayload = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                activeRole: activeRole.toUpperCase(), // Enum format
                onboarded: true, // Only set this after profile success
            };

            // If form has 'name' (Startup/Investor/Provider), add it.
            if (formData.name) {
                // @ts-ignore
                userPayload.name = formData.name;
            }

            // STEP 2: Update User Table (Canonical)
            const userRes = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPayload)
            });

            if (!userRes.ok) throw new Error("Failed to update user status");

            // Sync Session (Important to pass Middleware Guard)
            await update({
                onboarded: true,
                activeRole: activeRole, // Ensure role is sticky
                // Persist Location in Session (Prevent Loop)
                latitude: (session?.user as any)?.latitude,
                longitude: (session?.user as any)?.longitude,
                city: (session?.user as any)?.city
            });

            // Redirect to Dashboard (Flow Complete)
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error saving profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Role Specific Details
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
        experience: "",
        availability: "",
        workType: "",
        portfolio: "",
        github: "",
        linkedin: "",
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
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
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
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
                <label className="block text-sm font-medium mb-2">WhatsApp Number (Required)</label>
                <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? "Saving Profile..." : "Complete Profile"}
            </button>
        </form>
    );
}

function StartupForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        oneLiner: "",
        industry: "",
        stage: "",
        website: "",
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
                ...formData,
                stage: mapToEnum(formData.stage),
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
                    maxLength={140}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{formData.oneLiner.length}/140</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                        className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        value={formData.industry}
                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    >
                        <option value="">Select Industry</option>
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
                        <option value="">Select Stage</option>
                        {STARTUP_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Website (Optional)</label>
                <input
                    type="url"
                    className="w-full p-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? "Launching..." : "Enter Starto"}
            </button>
        </form>
    );
}

function InvestorForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        investorType: "",
        sectors: [] as string[],
        stages: [] as string[],
        thesisNote: "",
        isPublic: true,
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
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

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? "Processing..." : "Next Step"}
            </button>
        </form>
    );
}

function ProviderForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        companyName: "",
        providerType: "",
        description: "",
        capacity: 10,
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
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
