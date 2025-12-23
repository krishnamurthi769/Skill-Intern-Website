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
    CheckCircle2
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
                    ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-sm py-3"
                    : "bg-white/70 backdrop-blur-md border-gray-200/50 py-4"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
                {/* LEFT: Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/logo-v2.png"
                        alt="Starto"
                        width={240}
                        height={80}
                        className="h-10 md:h-15 w-auto object-contain transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>

                {/* CENTER: Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-1">
                    <NavItem href="#features">Features</NavItem>
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

                    <NavItem href="#about">About</NavItem>
                </nav>

                {/* RIGHT: CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <UserNav />
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

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 20 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] bg-background border-l border-border z-[70] p-6 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-xl">Starto</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-muted rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-4 border-b pb-6">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
                                    {user && (
                                        <Link href="/login" className="text-lg font-medium text-primary">Dashboard</Link>
                                    )}
                                    <Link href="#features" className="text-lg font-medium">Features</Link>

                                    <Link href="#about" className="text-lg font-medium">About</Link>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roles</span>
                                    {roles.map(role => (
                                        <Link key={role.title} href={role.href} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg -mx-2">
                                            <role.icon className="w-5 h-5 text-primary" />
                                            <span className="font-medium">{role.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t flex flex-col gap-3">
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                                    <span>🇮🇳 Made in India</span>
                                    <span>•</span>
                                    <span>AI Powered</span>
                                </div>
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm font-medium text-center text-muted-foreground mb-2">
                                            Signed in as {user.email}
                                        </div>
                                        <Button variant="outline" className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => signOut({ callbackUrl: "/" })}>
                                            Log out
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Button className="w-full rounded-full" asChild>
                                            <Link href="/onboarding">Get Started</Link>
                                        </Button>
                                        <Button variant="outline" className="w-full rounded-full" asChild>
                                            <Link href="/login">Login</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
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
