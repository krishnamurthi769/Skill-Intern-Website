"use client"

import { cn } from "@/lib/utils"
import { useConversations } from "@/hooks/useChat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface ChatSidebarProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
    className?: string;
}

export function ChatSidebar({ selectedId, onSelect, className }: ChatSidebarProps) {
    const { data, isLoading } = useConversations();

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className={cn("border-r bg-muted/20 flex flex-col", className)}>
            <div className="p-4 border-b font-medium">Recent Messages</div>
            <div className="flex-1 overflow-y-auto">
                {data?.items.map((conv) => {
                    // For demo, assume participant is the "other" person (not me)
                    // In real app, filter out current user. For now, take first participant or second.
                    const otherUser = conv.participants.find(p => p.id !== "dev-user-id") || conv.participants[0];
                    const lastMsg = conv.messages[0];

                    return (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={cn(
                                "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors",
                                selectedId === conv.id && "bg-muted"
                            )}
                        >
                            <Avatar>
                                <AvatarImage src={otherUser.image} />
                                <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <div className="font-medium truncate">{otherUser.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                    {lastMsg ? lastMsg.content : "No messages yet"}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {data?.items.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                        No conversations yet. Apply to a job to start one!
                    </div>
                )}
            </div>
        </div>
    )
}
