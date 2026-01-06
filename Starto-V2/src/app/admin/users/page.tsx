"use client"

import { useEffect, useState } from "react"
import { AdminMobileNav } from "@/components/admin/AdminMobileNav"

// --- Types ---
interface User {
    id: string
    name: string
    email: string
    phoneNumber: string | null
    image: string | null
    role: string
    activeRole: string | null
    city: string | null
    state: string | null
    country: string | null
    createdAt: string
}

interface Meta {
    total: number
    page: number
    limit: number
    totalPages: number
}

// --- Icons ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
)
const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
)
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
)
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
)

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [meta, setMeta] = useState<Meta | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // -- Filters --
    const [activeTab, setActiveTab] = useState("ALL")
    const [search, setSearch] = useState("")
    const [location, setLocation] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [debouncedLocation, setDebouncedLocation] = useState("")
    const [page, setPage] = useState(1)

    // Debounce effects
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 500)
        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedLocation(location), 500)
        return () => clearTimeout(handler)
    }, [location])

    // Fetch Trigger
    useEffect(() => {
        fetchUsers()
    }, [page, activeTab, debouncedSearch, debouncedLocation])

    async function fetchUsers() {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.set("page", page.toString())
            params.set("limit", "20")
            if (activeTab !== "ALL") params.set("role", activeTab)
            if (debouncedSearch) params.set("search", debouncedSearch)
            if (debouncedLocation) params.set("location", debouncedLocation)

            const res = await fetch(`/api/admin/users?${params.toString()}`)
            if (!res.ok) throw new Error("Failed to fetch users")
            const data = await res.json()
            setUsers(data.data)
            setMeta(data.meta)
        } catch (err) {
            setError("Error loading users")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        { id: "ALL", label: "All Users" },
        { id: "STARTUP", label: "Startups" },
        { id: "INVESTOR", label: "Investors" },
        { id: "FREELANCER", label: "Freelancers" },
        { id: "PROVIDER", label: "Providers" },
        { id: "ADMIN", label: "Admins" },
    ]

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <AdminMobileNav />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                            <p className="text-sm text-gray-500">View and manage all platform users</p>
                        </div>
                    </div>
                    {/* Placeholder for global actions if needed */}
                </div>

                {/* Role Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
                    <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => { setActiveTab(role.id); setPage(1); }}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                    ${activeTab === role.id
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}
                                `}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, phone..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FilterIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by city, country..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                {/* Users List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-48"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        {error}
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100 dashed border-2">
                        <div className="max-w-xs mx-auto text-gray-500">
                            <p className="text-lg font-medium text-gray-900">No users found</p>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-50">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.name?.[0]?.toUpperCase() || "?"
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 line-clamp-1" title={user.name}>{user.name || "Unknown User"}</h3>
                                            <span className={`
                                                inline-flex items-center px-2 py-0.5 rounded textxs font-medium mt-1
                                                ${user.role === 'INVESTOR' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'STARTUP' ? 'bg-blue-100 text-blue-700' :
                                                        user.role === 'FREELANCER' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-700'}
                                            `}>
                                                {user.activeRole || user.role || "USER"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 text-gray-400 shrink-0"><MapPinIcon /></div>
                                        <span className="line-clamp-1" title={user.city || "Not set"}>
                                            {user.city ? `${user.city}, ${user.country}` : <span className="text-gray-400 italic">No location set</span>}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="mt-0.5 text-gray-400 shrink-0"><PhoneIcon /></div>
                                        {user.phoneNumber ? (
                                            <a href={`tel:${user.phoneNumber}`} className="text-gray-700 hover:text-blue-600 hover:underline">
                                                {user.phoneNumber}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">No phone available</span>
                                        )}
                                    </div>
                                    <div className="pt-2 border-t border-gray-50 mt-2">
                                        <p className="text-xs text-gray-400">Email</p>
                                        <p className="text-gray-700 truncate" title={user.email}>{user.email}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 flex gap-2">
                                    {/* Action buttons could go here */}
                                    {user.phoneNumber && (
                                        <a
                                            href={`https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center bg-green-50 text-green-700 py-2 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                                        >
                                            WhatsApp
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:${user.email}`}
                                        className="flex-1 text-center bg-gray-50 text-gray-700 py-2 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        Email
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Check Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-6">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">Page {page} of {meta.totalPages}</span>
                        <button
                            disabled={page >= meta.totalPages || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
