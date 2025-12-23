"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { roleNavigation } from "@/config/navigation"
import { UserRole } from "@/types/starto"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { data: session } = useSession()
    const currentSection = searchParams.get("section")

    // Optimized Role Detection (Single Source of Truth)
    const role = (session?.user as any)?.activeRole?.toLowerCase() as UserRole || "startup";

    if (!role || !roleNavigation[role]) return null

    const items = roleNavigation[role]

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <Link href="/" className="flex items-center pl-3 mb-6">
                        {/* Replace with actual Logo component if available, using text for now but styled as Logo */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold mr-2">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">Starto</span>
                    </Link>
                    <div className="space-y-1">
                        {items.map((item) => {
                            const Icon = item.icon
                            // Determine active state:
                            // 1. If item.href matches pathname exactly (e.g. /startup) AND no section param exists (for Dashboard overview)
                            // 2. If item.href contains the current section param
                            const isDashboard = item.href === pathname && !currentSection
                            const isSectionMatch = currentSection && item.href.includes(`section=${currentSection}`)
                            const isActive = isDashboard || isSectionMatch

                            return (
                                <Button
                                    key={item.href}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.title}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
