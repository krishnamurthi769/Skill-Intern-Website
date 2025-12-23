import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar className="hidden w-64 md:block flex-shrink-0" />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
