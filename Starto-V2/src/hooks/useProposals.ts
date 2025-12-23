import { useMutation } from "@tanstack/react-query";

interface CreateProposalData {
    taskId: string;
    amount: number;
    coverLetter: string;
}

async function createProposal(data: CreateProposalData) {
    const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to submit proposal");
    }

    return res.json();
}

export function useCreateProposal() {
    return useMutation({
        mutationFn: createProposal,
        onSuccess: () => {
            // Can invalidate queries or show toast here
            // queryClient.invalidateQueries({ queryKey: ["jobs"] })
            // toast.success("Proposal sent!")
            alert("Proposal sent successfully! (Dev Mode Alert)");
        },
        onError: (error) => {
            alert("Error sending proposal");
            console.error(error);
        }
    });
}
