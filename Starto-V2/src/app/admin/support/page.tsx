"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface SupportRequest {
    id: string
    user: User
    role: string
    subject: string
    message: string
    status: string
    createdAt: string
    updatedAt: string
}

export default function SupportPage() {
    const [requests, setRequests] = useState<SupportRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    useEffect(() => {
        fetchRequests()
    }, [page])

    async function fetchRequests() {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/support?page=${page}&limit=20`)
            if (!res.ok) throw new Error("Failed to fetch support requests")
            const data = await res.json()
            setRequests(data.data)
            setHasMore(page < data.meta.totalPages)
        } catch (err) {
            setError("Error loading support requests")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function updateStatus(id: string, newStatus: string) {
        // Basic confirmation
        if (!confirm(`Mark this request as ${newStatus}?`)) return

        setUpdatingId(id)
        try {
            const res = await fetch(`/api/admin/support/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to update")
            }

            await res.json() // Consume body

            // Optimistic Update
            setRequests(current =>
                current.map(req =>
                    req.id === id ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } : req
                )
            )
        } catch (err: any) {
            alert(err.message)
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-white p-4 rounded shadow-sm">Support Requests</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white rounded shadow border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading support requests...
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No support requests.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">{req.user?.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{req.user?.email}</div>
                                            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{req.role}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">{req.subject}</div>
                                            <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap max-w-xs">{req.message}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                        ${req.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(req.updatedAt || req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {req.status !== 'RESOLVED' && (
                                                    <>
                                                        {req.status === 'OPEN' && (
                                                            <button
                                                                onClick={() => updateStatus(req.id, 'IN_PROGRESS')}
                                                                disabled={updatingId === req.id}
                                                                className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 disabled:opacity-50 min-w-[60px]"
                                                            >
                                                                {updatingId === req.id ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : 'Start'}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => updateStatus(req.id, 'RESOLVED')}
                                                            disabled={updatingId === req.id}
                                                            className="text-xs bg-green-50 text-green-600 px-3 py-2 rounded hover:bg-green-100 disabled:opacity-50 min-w-[60px]"
                                                        >
                                                            {updatingId === req.id ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : 'Resolve'}
                                                        </button>
                                                    </>
                                                )}
                                                {req.status === 'RESOLVED' && (
                                                    <span className="text-xs text-gray-400">Closed</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t flex justify-between items-center bg-gray-50">
                    <button
                        disabled={page === 1 || loading}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 bg-white border rounded shadow-sm text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">Page {page}</span>
                    <button
                        disabled={!hasMore || loading}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-white border rounded shadow-sm text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}
