import { DashboardShell } from "@/components/ui/dashboard-shell"

export default function AdminDashboardPage() {
    return (
        <DashboardShell>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 border rounded-xl bg-card text-card-foreground shadow space-y-1">
                    <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
                    <div className="text-2xl font-bold">0</div>
                </div>
                <div className="p-6 border rounded-xl bg-card text-card-foreground shadow space-y-1">
                    <h3 className="tracking-tight text-sm font-medium">Pending KYC</h3>
                    <div className="text-2xl font-bold">0</div>
                </div>
            </div>
        </DashboardShell>
    )
}
