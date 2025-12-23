import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateMilestoneData {
    id: string;
    status: string;
}

export function useUpdateMilestone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateMilestoneData) => {
            const res = await fetch("/api/milestones", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update milestone");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contract"] });
            alert("Milestone updated!");
        }
    });
}
