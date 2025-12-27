"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            {/* Simplified Header */}
            <header className="h-16 border-b bg-background/80 backdrop-blur fixed top-0 w-full z-10 flex items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                    <Image
                        src="/logo-v2.png"
                        alt="Starto"
                        width={240}
                        height={80}
                        className="h-12 md:h-14 w-auto object-contain dark:invert"
                        priority
                    />
                </Link>

                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted">
                    <Link href="/">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </Button>
            </header>

            <main className="flex-1 flex flex-col pt-24 pb-12 px-4 container mx-auto max-w-5xl">
                {children}
            </main>
        </div >
    );
}
