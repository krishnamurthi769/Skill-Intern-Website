"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageThreadProps {
    conversationId: string;
    currentUserId: string;
}

export default function MessageThread({ conversationId, currentUserId }: MessageThreadProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages/${conversationId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        try {
            const res = await fetch("/api/messages/send", {
                method: "POST",
                body: JSON.stringify({
                    conversationId,
                    senderId: currentUserId,
                    content: input
                })
            });
            if (res.ok) {
                setInput("");
                fetchMessages();
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling every 3s
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-background rounded-lg border">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t flex gap-2">
                <input
                    className="flex-1 bg-background border rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button size="icon" className="rounded-full h-10 w-10" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
