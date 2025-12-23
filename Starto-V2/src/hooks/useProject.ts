import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProject(id: string) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const res = await fetch(`/api/projects/${id}`);
            if (!res.ok) throw new Error("Project not found");
            return res.json();
        },
        enabled: !!id
    });
}

export function useUpdateMilestone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch("/api/milestones", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            return res.json();
        },
        onSuccess: (data, variables, context) => {
            // Invalidate project to refresh list
            queryClient.invalidateQueries({ queryKey: ["project"] });
        }
    });
}
