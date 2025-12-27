"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Menu,
    X,
    ChevronDown,
    Rocket,
    Briefcase,
    TrendingUp,
    Building2,
    CheckCircle2,
    LayoutDashboard,
    Globe,
    MapPin,
    Users,
    User,
    Settings,
    LogOut
} from "lucide-react";

const roles = [
    {
        title: "For Founders",
        href: "/dashboard",
        description: "Launch & scale your startup",
        icon: Rocket,
    },
    {
        title: "For Freelancers",
        href: "/dashboard",
        description: "Find high-quality projects",
        icon: Briefcase,
    },
    {
        title: "For Investors",
        href: "/dashboard",
        description: "Discover the next big thing",
        icon: TrendingUp,
    },
    {
        title: "For Providers",
        href: "/dashboard",
        description: "List your workspace",
        icon: Building2,
    },
];

import { useSession, signOut } from "next-auth/react";
import { UserNav } from "./UserNav";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Explore Market", href: "/explore", icon: Globe },
    { label: "Nearby", href: "/nearby", icon: MapPin },
    { label: "Connections", href: "/dashboard/connections", icon: Users },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Navbar() {
    const { data: session, status } = useSession();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [rolesOpen, setRolesOpen] = React.useState(false);

    const user = session?.user;

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close mobile menu when route changes
    const pathname = usePathname();
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-background/90 backdrop-blur-md border-border shadow-sm py-3"
                    : "bg-background/70 backdrop-blur-md border-border/50 py-4"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
                {/* LEFT: Logo */}
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <Image
                        src="/logo-v2.png"
                        alt="Starto"
                        width={240}
                        height={80}
                        className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105 dark:invert"
                        priority
                    />
                </Link>

                {/* CENTER: Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-1">
                    <NavItem href="/features">Features</NavItem>
                    {/* Roles Dropdown */}
                    <div
                        className="relative group px-3 py-2"
                        onMouseEnter={() => setRolesOpen(true)}
                        onMouseLeave={() => setRolesOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Roles <ChevronDown className={cn("w-4 h-4 transition-transform", rolesOpen ? "rotate-180" : "")} />
                        </button>

                        <AnimatePresence>
                            {rolesOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[320px]"
                                >
                                    <div className="bg-popover border border-border rounded-xl shadow-xl overflow-hidden p-2 grid gap-1">
                                        {roles.map((role) => (
                                            <Link
                                                key={role.title}
                                                href={role.href}
                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                <div className="p-2 rounded-md bg-primary/5 text-primary">
                                                    <role.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">{role.title}</div>
                                                    <div className="text-xs text-muted-foreground">{role.description}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <NavItem href="/about">About</NavItem>
                </nav>

                {/* RIGHT: CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {!pathname?.startsWith("/dashboard") && (
                                <Button size="sm" variant="outline" className="rounded-full px-6 font-semibold hidden md:flex" asChild>
                                    <Link href="/dashboard">Go to Dashboard</Link>
                                </Button>
                            )}
                            <UserNav />
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Button size="sm" className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20" asChild>
                                <Link href="/onboarding">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Drawer (Full Screen / Large) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm" // Increased z-index & opacity
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white dark:bg-zinc-950 border-l shadow-2xl flex flex-col h-full z-[10000]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <Image
                                        src="/logo-v2.png"
                                        alt="Starto"
                                        width={140}
                                        height={45}
                                        className="h-10 w-auto object-contain dark:invert"
                                    />
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
                                    <X className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                                </Button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">

                                {user ? (
                                    /* AUTHENTICATED MENU */
                                    <div className="flex flex-col gap-2">
                                        <div className="px-2 mb-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                            My Account
                                        </div>
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 active:bg-zinc-200 transition-colors text-zinc-900 dark:text-zinc-100"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-primary">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-lg">{item.label}</span>
                                            </Link>
                                        ))}

                                        <button
                                            onClick={() => signOut()}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors w-full text-left"
                                        >
                                            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
                                                <LogOut className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-lg">Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    /* GUEST MENU */
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="px-2 mb-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                                Platform
                                            </div>
                                            <Link href="/features" className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                                                <Rocket className="w-5 h-5 text-primary" />
                                                <span className="font-semibold text-lg">Features</span>
                                            </Link>
                                            <Link href="/about" className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                                                <Users className="w-5 h-5 text-primary" />
                                                <span className="font-semibold text-lg">About Us</span>
                                            </Link>
                                        </div>

                                        <div className="flex flex-col gap-3 mt-4">
                                            <Button size="lg" className="w-full rounded-full h-12 text-lg font-bold" asChild>
                                                <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                                            </Button>
                                            <Button variant="outline" size="lg" className="w-full rounded-full h-12 text-lg font-semibold border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" asChild>
                                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <div className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    <span>© 2024 Starto</span>
                                    <span>•</span>
                                    <span>Made in India 🇮🇳</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>
    )
}
