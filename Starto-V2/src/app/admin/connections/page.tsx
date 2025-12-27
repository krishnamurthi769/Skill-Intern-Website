"use client"

import { useEffect, useState } from "react"

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface ConnectionRequest {
    id: string
    fromUser: User
    toUser: User
    status: string
    createdAt: string
    message: string
}

export default function ConnectionsPage() {
    const [connections, setConnections] = useState<ConnectionRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        fetchConnections()
    }, [page])

    async function fetchConnections() {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/connections?page=${page}&limit=20`)
            if (!res.ok) throw new Error("Failed to fetch connections")
            const data = await res.json()
            setConnections(data.data)
            setHasMore(page < data.meta.totalPages)
        } catch (err) {
            setError("Error loading connections")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-white p-4 rounded shadow-sm">Connections</h2>

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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && connections.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading connections...
                                    </td>
                                </tr>
                            ) : connections.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No connections found.
                                    </td>
                                </tr>
                            ) : (
                                connections.map((conn) => (
                                    <tr key={conn.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">{conn.fromUser.name}</div>
                                            <div className="text-xs text-gray-500">{conn.fromUser.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">{conn.toUser.name}</div>
                                            <div className="text-xs text-gray-500">{conn.toUser.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                        ${conn.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                    conn.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {conn.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(conn.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs">
                                            {conn.message}
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
