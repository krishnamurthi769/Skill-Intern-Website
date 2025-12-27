"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { roleNavigation } from "@/config/navigation"
import { UserRole } from "@/types/starto"
import { Button } from "@/components/ui/button"
import { SupportButton } from "@/components/support/SupportButton"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { data: session } = useSession()
    const currentSection = searchParams.get("section")

    // Optimized Role Detection (Single Source of Truth)
    const role = (session?.user as any)?.activeRole?.toLowerCase() as UserRole;

    if (!role || !roleNavigation[role]) return null

    const items = roleNavigation[role]

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <Link href="/" className="flex items-center pl-2 mb-6 group cursor-pointer block">
                        <Image
                            src="/logo-v2.png"
                            alt="Starto"
                            width={140}
                            height={48}
                            className="h-12 w-auto object-contain dark:invert transition-transform group-hover:scale-105"
                            priority
                        />
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
                    <div className="mt-8 pt-4 border-t space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </Button>
                        <SupportButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
