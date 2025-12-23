import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Investment = {
    id: string;
    amount: string; // Decimal
    equity?: string | null;
    status: string;
    createdAt: string;
    startup?: { name: string };
};

export function useInvestments(page = 1, limit = 20) {
    return useQuery({
        queryKey: ["investments", { page, limit }],
        queryFn: async () => {
            const q = new URLSearchParams({ page: String(page), limit: String(limit) });
            const res = await fetch(`/api/investments?${q.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch investments");
            return (await res.json()) as { items: Investment[]; total: number; page: number; limit: number };
        },
        placeholderData: (previousData: any) => previousData,
    });
}

export function useCreateInvestment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { startupId: string; amount: number; equity?: number }) => {
            const res = await fetch("/api/investments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to create investment");
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["investments"] });
        },
    });
}
