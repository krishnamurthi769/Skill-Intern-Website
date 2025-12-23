import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Space = {
    id: string;
    name: string;
    description?: string;
    pricePerHour?: string | null; // Prisma Decimal
    address?: string;
    createdAt: string;
    provider?: { id: string; companyName?: string };
};

export function useSpaces(page = 1, limit = 20, search = "") {
    return useQuery({
        queryKey: ["spaces", { page, limit, search }],
        queryFn: async () => {
            const q = new URLSearchParams({ page: String(page), limit: String(limit), search });
            const res = await fetch(`/api/spaces?${q.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch spaces");
            // Prisma Decimal might come as string, forcing consistent type matching could be done here
            return (await res.json()) as { items: Space[]; total: number; page: number; limit: number };
        },
        placeholderData: (previousData: any) => previousData,
    });
}

export function useCreateSpace() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { name: string; description?: string; pricePerHour?: number; address?: string }) => {
            const res = await fetch("/api/spaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to create space");
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["spaces"] });
        },
    });
}
