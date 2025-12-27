import { UserRole } from "@/types/starto";
import { LayoutDashboard, Users, Briefcase, Building2, Wallet, Settings, MessageSquare, Search, FileText, PlusCircle, FileSignature, BookOpen, MapPin } from "lucide-react";

export type NavItem = {
    title: string;
    href: string;
    icon: any;
};

export const roleNavigation: Record<UserRole, NavItem[]> = {
    admin: [
        { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
    freelancer: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },

        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ],
    startup: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },

        { title: "Resources", href: "/dashboard?section=resources", icon: BookOpen },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ],
    investor: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ],
    provider: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ]
};
