"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function ConnectionRequestList() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user?.email) setUserEmail(user.email);
        });
        return () => unsub();
    }, []);

    const fetchRequests = async () => {
        if (!userEmail) return;
        try {
            // We need an endpoint to get pending requests. 
            // For now, let's assume we can fetch data from a new endpoint or reusing one.
            // Let's create a specific fetch.
            const res = await fetch(`/api/connections/pending?email=${userEmail}`);
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [userEmail]);

    const handleRespond = async (id: string, status: "ACCEPTED" | "REJECTED") => {
        try {
            await fetch("/api/connections/respond", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: id, status })
            });
            // Optimistic update
            setRequests(requests.filter(r => r.id !== id));
        } catch (e) {
            alert("Error updating status");
        }
    };

    if (loading) return <div>Loading requests...</div>;
    if (requests.length === 0) return <div className="text-gray-500">No pending connection requests.</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Connection Requests</h3>
            {requests.map((req) => (
                <div key={req.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                            {req.fromUser.name?.[0] || "?"}
                        </div>
                        <div>
                            <p className="font-bold text-white">{req.fromUser.name || "Unknown User"}</p>
                            <p className="text-xs text-gray-400 capitalize">{req.fromUser.role?.toLowerCase()}</p>
                            {req.message && <p className="text-sm text-gray-300 mt-1">"{req.message}"</p>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleRespond(req.id, "REJECTED")}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm"
                        >
                            Ignore
                        </button>
                        <button
                            onClick={() => handleRespond(req.id, "ACCEPTED")}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
