"use client";

import { useState, useEffect } from "react";
import ConversationList from "@/components/messages/ConversationList";
import MessageThread from "@/components/messages/MessageThread";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch internal ID logic (Simplified for MVP: We assume we store it or fetch it)
    // Actually, let's use the same resolution logic or just fetch by email for now.
    // Ideally we have a hook `useUser` that gives us the DB ID.
    // For this demo, let's look up the user by firebase UID once.

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user?.email) {
                localStorage.setItem("user_email", user.email); // For ConversationList

                // Get internal ID for sending messages
                // Small hack: Retrieve from an API or store in context
                // Let's create a tiny helpers to get self
                // For now, I'll fetch /api/auth/me if I had it, or just rely on storing it during login
                // Let's call /api/auth/sync again or similar to get ID?
                // Or simple: fetch conversation list returns MY id? No.
                // Let's just fetch it:
                const res = await fetch(`/api/connections/pending?email=${user.email}`); // Reusing an endpoint that finds user?
                // Actually this endpoint returns requests. 

                // Let's add a quick lookup or just rely on the API to return "me"
                // Creating valid `useUser` hook context is best but expensive now.
                // Let's assume we can pass email to MessageThread and let backend resolve sender?
                // No backend expects senderId.

                // Let's fetch the ID via a dedicated call or reuse sync
                const syncRes = await fetch("/api/auth/sync", {
                    method: "POST",
                    body: JSON.stringify({ email: user.email, name: user.displayName, uid: user.uid }),
                });
                const syncData = await syncRes.json();
                if (syncData.id) setUserId(syncData.id);
            }
        });
        return () => unsub();
    }, []);

    if (!userId) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <DashboardShell>
            <div className="h-[calc(100vh-100px)] flex gap-4">
                <div className="w-1/3 border rounded-lg bg-card p-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <ConversationList onSelect={setSelectedId} selectedId={selectedId} />
                </div>
                <div className="w-2/3">
                    {selectedId ? (
                        <MessageThread conversationId={selectedId} currentUserId={userId} />
                    ) : (
                        <div className="h-full flex items-center justify-center border rounded-lg bg-muted/20 text-muted-foreground">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
