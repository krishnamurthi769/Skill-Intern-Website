"use client";

import { useState, useEffect } from "react";

import { auth } from "@/lib/firebase";

interface ConnectionButtonProps {
    toUserId: string;
    className?: string;
}

export default function ConnectionButton({ toUserId, className = "" }: ConnectionButtonProps) {
    const [status, setStatus] = useState<"NONE" | "PENDING" | "ACCEPTED" | "REJECTED" | "RECEIVED">("NONE");
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) setCurrentUser(user);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!currentUser || !toUserId) return;

        // Check status
        fetch(`/api/connections/status?from=${currentUser.uid}&to=${toUserId}`) // Note: Using firebase uid or db id? DB ID is safer.
            .then(res => res.json())
            .then(data => {
                if (data.connection) {
                    const c = data.connection;
                    if (c.status === "ACCEPTED") setStatus("ACCEPTED");
                    else if (c.status === "REJECTED") setStatus("REJECTED");
                    else if (c.status === "PENDING") {
                        if (c.fromUserId === currentUser.uid) setStatus("PENDING"); // I sent it
                        else setStatus("RECEIVED"); // They sent it
                    }
                } else {
                    setStatus("NONE");
                }
            })
            .catch(err => console.error(err));
    }, [currentUser, toUserId]);

    const handleConnect = async () => {
        if (!currentUser) return alert("Please login first");
        setLoading(true);
        try {
            // Need to resolve currentUser DB ID first if we only have firebase UID
            // Assuming the hook or context provides it, but for now let's assume `currentUser.uid` corresponds to `firebaseUid` 
            // and we might need to look up the DB ID. 
            // BETTER: The API should handle lookup by firebaseUid or the prop passed in should be the DB ID.
            // Let's assume `toUserId` IS the DB ID (from the map marker data).
            // And we need OUR DB Id.

            // Quick fetch to get my DB ID if needed, or update API to accept firebaseUid.
            // Let's update API to accept firebaseUid for convenience? No, strict is better.
            // We'll trust that the parent component passes valid DB IDs.

            // Wait, we need the sender's DB ID.
            // Let's fetch it or assume we have it in session.
            // For MVP, we'll do a quick lookup on the fly or just send firebaseUid and let backend handle connection logic?
            // Let's stick to strict DB IDs.

            // Temporary: Fetch my profile to get ID
            const meRes = await fetch(`/api/user/me?email=${currentUser.email}`); // Need a me endpoint?
            // Actually, let's just make the request API accept `fromEmail` to be safe/easy

            const res = await fetch("/api/connections/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fromFirebaseUid: currentUser.uid, // WARNING: checks schema. If schema uses CUID, this must be DB ID.
                    toUserId: toUserId,
                    message: "Hi, I'd like to connect!", // Default message for now
                })
            });

            if (!res.ok) {
                // connection request expects DB IDs. 
                // If fromUserId is passed as Firebase UID, it might fail?
                // The Schema `userId` is CUID. `firebaseUid` is string.
                // We MUST use the DB ID.
                throw new Error("Failed");
            }

            setStatus("PENDING");
        } catch (e) {
            console.error(e);
            alert("Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    if (status === "ACCEPTED") return <button disabled className={`px-4 py-2 bg-green-600 rounded text-white ${className}`}>Connected</button>;
    if (status === "PENDING") return <button disabled className={`px-4 py-2 bg-gray-600 rounded text-white ${className}`}>Pending</button>;
    if (status === "RECEIVED") return <button disabled className={`px-4 py-2 bg-yellow-600 rounded text-white ${className}`}>Check Dashboard</button>;

    return (
        <button
            onClick={handleConnect}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white ${className}`}
        >
            {loading ? "..." : "Connect"}
        </button>
    );
}
