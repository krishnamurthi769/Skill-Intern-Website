"use client"

import { useEffect, useState } from "react"

interface User {
    id: string
    name: string
    email: string
    role: string
    activeRole: string
    city: string | null
    country: string | null
    createdAt: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [page])

    async function fetchUsers() {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/users?page=${page}&limit=20`)
            if (!res.ok) throw new Error("Failed to fetch users")
            const data = await res.json()
            setUsers(data.data)
            setHasMore(page < data.meta.totalPages)
        } catch (err) {
            setError("Error loading users")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-white p-4 rounded shadow-sm">Users</h2>

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
                                <th className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">Location</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name || "Unknown"}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.role || "USER"}
                                            </span>
                                            {user.activeRole && user.activeRole !== user.role && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    Active: {user.activeRole}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.city ? `${user.city}, ${user.country || ""}` : "Not set"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Simple Pagination */}
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
