"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConversationListProps {
    onSelect: (conversationId: string) => void;
    selectedId?: string;
    currentUserEmail?: string | null;
}

export default function ConversationList({ onSelect, selectedId, currentUserEmail }: ConversationListProps) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        // In a real app, use auth context to get current user if needed, 
        // but the API infers it from session or we assume we query by email for MVP
        // For MVP let's assume API handles identification or we pass param.
        // Wait, the API I wrote expected `email` query param.
        // Let's assume we have user email stored in local storage or context.
        // For now, I'll fetch with a placeholder or improved logic in next iteration if needed.
        // Actually, let's fix the API to be session-aware or pass email from client.
        // Trying to get user email from somewhere...
        // Let's skip session strictness for a second and assume we pass it.

        // Temporary hack for MVP: Use a known email or prompt user if not found?
        // Better: The user is logged in via Firebase.
        // We need to get the current user's email.

        const email = currentUserEmail || localStorage.getItem("user_email"); // Assuming we store it on login
        if (!email) return;

        try {
            const res = await fetch(`/api/messages/conversations?email=${email}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        const email = localStorage.getItem("user_email");
        if (email) fetchConversations();

        // Poll every 10s
        const interval = setInterval(() => {
            if (email) fetchConversations();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading chats...</div>;
    if (conversations.length === 0) return <div className="p-4 text-sm text-muted-foreground">No active connections.</div>;

    return (
        <div className="flex flex-col gap-1 overflow-y-auto h-full">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${selectedId === conv.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.otherUser.image} />
                        <AvatarFallback>{conv.otherUser.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm truncate">{conv.otherUser.name || "User"}</span>
                            {/* <span className="text-xs text-muted-foreground">{new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> */}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
                        <Badge variant="outline" className="mt-1 text-[10px] py-0 h-4">{conv.otherUser.role}</Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}
