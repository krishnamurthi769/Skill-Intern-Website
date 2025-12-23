import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CreateContractData {
    proposalId: string;
    taskId: string;
    freelancerId: string;
    amount: number;
}

export function useCreateContract() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateContractData) => {
            const res = await fetch("/api/contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create contract");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task"] });
            alert("Contract created successfully! Freelancer hired.");
        }
    });
}

export function useContracts() {
    return useQuery({
        queryKey: ["contracts"],
        queryFn: async () => {
            const res = await fetch("/api/contracts");
            if (!res.ok) throw new Error("Failed to fetch contracts");
            const data = await res.json();
            return data.contracts;
        }
    });
}

export function useContract(id: string) {
    return useQuery({
        queryKey: ["contract", id],
        queryFn: async () => {
            const res = await fetch(`/api/contracts/${id}`);
            if (!res.ok) throw new Error("Failed to fetch contract");
            const data = await res.json();
            return data.contract;
        },
        enabled: !!id
    });
}
