import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"

import { Suspense } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Suspense fallback={<div className="w-64 border-r bg-muted/10" />}>
                <Sidebar className="hidden w-64 md:block flex-shrink-0" />
            </Suspense>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
