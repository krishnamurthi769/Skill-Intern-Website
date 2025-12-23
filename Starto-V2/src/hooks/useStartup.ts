import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    duration: string;
    category: string;
    createdAt: string;
}

export interface Startup {
    id: string;
    name: string;
    website?: string;
    description?: string;
    logo?: string;
    stage?: string;
    industry?: string;
    // Location Fields
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pincode?: string | null;
    address?: string | null;
    location?: string; // Legacy/Display
    pitchDeck: string | null;
    valuation: number | null;
    jobs: Job[];
    tasks?: any[];
}

export function useStartup(id: string) {
    return useQuery<{ startup: Startup }>({
        queryKey: ["startup", id],
        queryFn: async () => {
            const res = await fetch(`/api/startups/${id}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error("Startup not found");
                throw new Error("Failed to fetch startup");
            }
            return res.json();
        },
        enabled: !!id,
    });
}

export function useMyStartup(email: string | null | undefined) {
    return useQuery<{ startup: Startup }>({
        queryKey: ["startup", "me", email],
        queryFn: async () => {
            if (!email) return null;
            const res = await fetch(`/api/startups/me?email=${email}`);
            if (!res.ok) {
                if (res.status === 404) return null; // Handle not found gracefully
                throw new Error("Failed to fetch startup");
            }
            return res.json();
        },
        enabled: !!email,
    });
}

export function useUpdateStartup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, email, data }: { id?: string; email?: string; data: Partial<Startup> | any }) => {
            // Support both ID-based and Email-based update
            const url = id && id !== "me" ? `/api/startups/${id}` : `/api/startups/me?email=${email}`;

            const res = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update profile");
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["startup"] });
            alert("Profile updated successfully!");
        }
    });
}
