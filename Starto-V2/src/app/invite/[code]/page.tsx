import { cookies } from "next/headers";
import { MoveRight, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image"; // Assuming Image component availability or use img

// Define props for Page
interface InvitePageProps {
    params: Promise<{ code: string }>;
}

async function getInviteDetails(code: string) {
    // Determine base URL (hacky for server-side fetch to own API, but necessary if not using direct DB)
    // Actually, in Server Component we can call DB directly! 
    // BUT we already wrote an API route. Let's use direct DB for speed and type safety here.
    // Wait, I can just copy the logic or import prisma. Using Prisma directly in Server Component is better.
    // ...But I just wrote the API. I'll use Prisma directly here to avoid fetch loop.
    const { prisma } = await import("@/lib/prisma"); // Dynamic import to avoid build time static issues if any

    const invite = await prisma.invite.findUnique({
        where: { code },
        include: {
            inviter: {
                select: {
                    name: true,
                    image: true,
                    activeRole: true,
                    role: true,
                    city: true
                }
            }
        }
    });

    return invite;
}

export default async function InvitePage({ params }: InvitePageProps) {
    const { code } = await params;

    // 1. Fetch Inviter (Direct DB)
    // Dynamic fetching
    const invite = await getInviteDetails(code);

    if (!invite) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Invite Not Found</h1>
                <p className="text-muted-foreground mb-6">This invite link appears to be invalid or expired.</p>
                <Link href="/" className="text-primary hover:underline">Go to Starto Home</Link>
            </div>
        );
    }

    // 2. Set Attribution Cookie
    // Using 'await cookies()' for Next.js 15+ compat (if strict) or just cookies()
    const cookieStore = await cookies();
    cookieStore.set("starto_invite_code", code, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 Days
        path: "/",
    });

    const inviter = invite.inviter;
    const role = (inviter.activeRole || inviter.role || "MEMBER").toUpperCase();
    const city = inviter.city ? ` in ${inviter.city}` : "";

    // Role-Aware Copy
    let headline = "invited you to join Starto";
    let subtext = "Connect with the startup ecosystem.";

    if (role === "STARTUP" || role === "FOUNDER") {
        subtext = "Find startups, freelancers & investors nearby.";
    } else if (role === "FREELANCER") {
        subtext = "Work with ambitious startups in your area.";
    } else if (role === "INVESTOR") {
        subtext = "Discover high-potential founders early.";
    } else if (role === "PROVIDER") {
        subtext = "Find tenants and startups for your space.";
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <div className="max-w-md w-full bg-card border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">

                {/* Header */}
                <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-4 border-background shadow-lg mb-6 overflow-hidden bg-muted relative">
                        {inviter.image ? (
                            <img src={inviter.image} alt={inviter.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground bg-secondary">
                                {(inviter.name?.[0] || "S").toUpperCase()}
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight mb-2">
                        {inviter.name} <span className="font-normal text-muted-foreground">invited you</span>
                    </h1>

                    <p className="text-lg text-primary font-medium flex items-center justify-center gap-1.5 mb-6">
                        <MapPin className="w-4 h-4" />
                        Building the ecosystem{city}
                    </p>

                    <div className="bg-secondary/50 rounded-xl p-4 w-full mb-8">
                        <p className="text-foreground/80 font-medium">
                            "{subtext}"
                        </p>
                    </div>

                    <div className="space-y-3 w-full">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>See {inviter.name}'s recommendations</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Access local opportunities</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Free to join</span>
                        </div>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="p-6 bg-muted/30 border-t flex flex-col gap-3">
                    <Link href="/onboarding" className="w-full">
                        <button className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                            Join Starto Now
                            <MoveRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                        Already have an account? <Link href="/login" className="underline hover:text-primary">Log in</Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-muted-foreground opacity-50 text-sm font-semibold">
                <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center text-background text-xs">S</div>
                Starto
            </div>
        </div>
    );
}
