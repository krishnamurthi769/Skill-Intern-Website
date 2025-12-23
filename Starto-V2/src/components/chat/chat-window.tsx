"use client"

import { useState, useRef, useEffect } from "react"
import { useMessages, useSendMessage } from "@/hooks/useChat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
    conversationId: string | null;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
    const { data, isLoading } = useMessages(conversationId);
    const sendMessage = useSendMessage();
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (data?.items && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [data?.items]);

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
            </div>
        )
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await sendMessage.mutateAsync({ conversationId, content: input });
            setInput("");
        } catch (error) {
            console.error("Failed to send");
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header (Optional, could show Name) */}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : (
                    data?.items.map((msg) => {
                        const isMe = msg.senderId === "dev-user-id";
                        return (
                            <div
                                key={msg.id}
                                className={cn("flex gap-2 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={msg.sender.image} />
                                    <AvatarFallback>{msg.sender.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "p-3 rounded-lg text-sm",
                                        isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sendMessage.isPending}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={sendMessage.isPending}>
                        {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}
