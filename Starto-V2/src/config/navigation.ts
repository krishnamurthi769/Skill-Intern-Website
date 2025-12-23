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

        { title: "My Projects", href: "/dashboard?section=projects", icon: Briefcase },
        { title: "Profile", href: "/dashboard?section=profile", icon: Users },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ],
    startup: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },
        { title: "My Tasks", href: "/dashboard?section=tasks", icon: Briefcase },

        { title: "Billing", href: "/dashboard?section=billing", icon: Wallet },
        { title: "Resources", href: "/dashboard?section=resources", icon: BookOpen },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ],
    investor: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },
        { title: "Portfolio", href: "/dashboard?section=portfolio", icon: Briefcase },
        { title: "Billing", href: "/dashboard?section=billing", icon: Wallet },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ],
    provider: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Explore", href: "/explore", icon: Search },
        { title: "Connections", href: "/connections", icon: Users },
        { title: "Nearby", href: "/nearby", icon: MapPin },
        { title: "My Properties", href: "/dashboard?section=properties", icon: Building2 },
        { title: "Settings", href: "/dashboard?section=settings", icon: Settings },
    ]
};
