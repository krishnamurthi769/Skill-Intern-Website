import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
    id: string;
    name: string;
    image?: string;
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: User;
}

interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    updatedAt: string;
}

export function useConversations() {
    return useQuery<{ items: Conversation[] }>({
        queryKey: ["conversations"],
        queryFn: async () => {
            const res = await fetch("/api/conversations");
            if (!res.ok) throw new Error("Failed to fetch conversations");
            return res.json();
        },
        refetchInterval: 5000, // Poll every 5s for new chats
    });
}

export function useMessages(conversationId: string | null) {
    return useQuery<{ items: Message[] }>({
        queryKey: ["messages", conversationId],
        queryFn: async () => {
            if (!conversationId) return { items: [] };
            const res = await fetch(`/api/messages?conversationId=${conversationId}`);
            if (!res.ok) throw new Error("Failed to fetch messages");
            return res.json();
        },
        enabled: !!conversationId,
        refetchInterval: 2000, // Poll every 2s for "Real-time" feel
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, content }),
            });
            if (!res.ok) throw new Error("Failed to send message");
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] }); // Update preview
        },
    });
}
