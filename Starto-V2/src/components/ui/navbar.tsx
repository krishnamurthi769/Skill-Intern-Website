"use client"

import Link from "next/link"
import { RoleAvatar } from "@/components/ui/role-avatar"
import { MobileNav } from "@/components/dashboard/MobileNav"
import { useSession } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
                <div className="mr-4 flex md:hidden">
                    <MobileNav />
                </div>
                <div className="mr-4 hidden md:flex">
                    {/* Logo or Breadcrumbs could go here */}
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {/* Right side items */}
                    {session?.user && (
                        <RoleAvatar className="h-8 w-8" />
                    )}
                </div>
            </div>
        </header>
    )
}
