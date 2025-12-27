"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-background border-r w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar className="border-none w-full" />
            </SheetContent>
        </Sheet>
    );
}
