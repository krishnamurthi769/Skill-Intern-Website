import Link from "next/link"
import { AdminMobileNav } from "@/components/admin/AdminMobileNav"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    // Double check basic auth here (middleware handles role, but good to be safe)
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-white shadow-md flex-col z-10 relative">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Starto Admin</h1>
                    <p className="text-sm text-gray-500">Internal Panel</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                        Users
                    </Link>
                    <Link href="/admin/connections" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                        Connections
                    </Link>
                    <Link href="/admin/support" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                        Support Requests
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link href="/dashboard" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                        ← Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="font-bold text-gray-800">Starto Admin</div>
                    <AdminMobileNav />
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
