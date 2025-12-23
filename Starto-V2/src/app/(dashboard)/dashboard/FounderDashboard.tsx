"use client"

import { OverviewSection } from "@/components/startup/sections/OverviewSection"
import { BillingSection } from "@/components/startup/sections/BillingSection"
import { SettingsSection } from "@/components/startup/sections/SettingsSection"
import { TasksSection } from "@/components/startup/sections/TasksSection"
import { ResourcesSection } from "@/components/startup/sections/ResourcesSection"
import { MapSection } from "@/components/dashboard/sections/MapSection"
import { Briefcase, Wallet, Settings, BookOpen, LayoutDashboard } from "lucide-react"

interface FounderDashboardProps {
    section?: string;
}

export default function FounderDashboard({ section }: FounderDashboardProps) {
    let content;

    switch (section) {
        case "billing":
            content = <BillingSection />
            break;
        case "settings":
            content = <SettingsSection />
            break;
        case "tasks":
            content = <TasksSection />
            break;
        case "resources":
            content = <ResourcesSection />
            break;
        case "map":
            content = <MapSection userRole="founder" />
            break;
        default:
            content = <OverviewSection />
    }

    return (
        <div className="space-y-6">
            {content}
        </div>
    )
}
