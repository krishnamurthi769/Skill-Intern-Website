import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Project = {
    id: string;
    title: string;
    description?: string;
    budget?: string | null; // Prisma Decimal comes as string often, or number.
    createdAt: string;
    owner?: { id: string; name?: string; email?: string };
};

export function useProjects(page = 1, limit = 20, search = "") {
    return useQuery({
        queryKey: ["projects", { page, limit, search }],
        queryFn: async () => {
            const q = new URLSearchParams({ page: String(page), limit: String(limit), search });
            const res = await fetch(`/api/projects?${q.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch projects");
            return (await res.json()) as { items: Project[]; total: number; page: number; limit: number };
        },
        placeholderData: (previousData: any) => previousData,
    });
}

export function useCreateProject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { title: string; description?: string; budget?: number }) => {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to create project");
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
