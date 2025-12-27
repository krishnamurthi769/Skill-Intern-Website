import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // The token is automatically decoded by withAuth and passed here in req.nextauth.token
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // 🧠 THE GOLDEN RULE: A user without a role must NEVER see any dashboard.

        // 1. Check Role
        const hasRole = !!token?.role

        if (!hasRole) {
            // Redirect to Role Selection
            // Use URL() to ensure absolute URL construction which is safer
            return NextResponse.redirect(new URL("/onboarding/role", req.url))
        }

        // 1.5 Check Onboarded Status (Profile Completion)
        // If role exists but profile not saved (onboarded=false), force /onboarding/profile
        const isOnboarded = (token as any)?.onboarded
        if (!isOnboarded) {
            return NextResponse.redirect(new URL("/onboarding/profile", req.url))
        }

        // 2. Check Location (Universal Step)
        // Ensure lat/lng are present (check for null/undefined explicitly as 0 is valid)
        // Accessing properties via 'any' cast because next-auth types might not have them explicitly defined yet
        const lat = (token as any)?.latitude
        const lng = (token as any)?.longitude
        const hasLocation = lat != null && lng != null

        if (!hasLocation) {
            return NextResponse.redirect(new URL("/onboarding/location", req.url))
        }

        // 3. Admin Protection
        // Protect /admin routes AND /api/admin routes
        if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
            const role = (token as any)?.role
            if (role !== "ADMIN") {
                // If trying to access API, return 403 JSON
                if (path.startsWith("/api/")) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
                }
                // If trying to access Page, redirect to Login (or Home if logged in but not admin? For now Login/Home)
                // Actually, if they are logged in but not admin, maybe redirect to dashboard? 
                // But typically if they try to access admin, just bounce them.
                return NextResponse.redirect(new URL("/", req.url))
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            // Ensure middleware only runs if user is authenticated (token exists)
            authorized: ({ token }) => !!token
        },
        pages: {
            signIn: "/login",
        }
    }
)

export const config = {
    // Protect Dashboards, Explore, Connections, Nearby, Settings AND Admin
    matcher: [
        "/dashboard/:path*",
        "/connections/:path*",
        "/nearby/:path*",
        "/explore/:path*",
        "/settings/:path*",
        "/admin/:path*",
        "/api/admin/:path*",
        "/api/support/:path*" // Protect support submission too (need auth)
    ]
}
