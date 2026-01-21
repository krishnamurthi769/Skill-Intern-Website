"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-24 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    {/* Updated Logo to logo_navbar.png */}
                    <div className="relative h-24 w-72">
                        <Image
                            src="/images/logo_navbar.png"
                            alt="Inspire AI"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
                    <Link href="/profile" className="hover:text-primary transition-colors">My Learning</Link>
                    <Link href="/certificate" className="hover:text-primary transition-colors">Certificate</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                </div>

                {/* Search and Login */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                    </div>

                    <button className="bg-primary hover:bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
}
