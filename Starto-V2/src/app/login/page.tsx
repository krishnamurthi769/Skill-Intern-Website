"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "@/lib/auth-actions"; // Helper functions
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Common function to exchange Firebase Token for NextAuth Session
    const exchangeToken = async (user: any) => {
        const idToken = await user.getIdToken();
        const res = await signIn("firebase-auth", {
            idToken,
            redirect: false,
            callbackUrl: callbackUrl || "/",
        });

        if (res?.error) {
            setError("Session creation failed. Please try again.");
            setLoading(false);
        } else {
            router.push(callbackUrl || "/"); // Redirect to callback or home
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const user = await loginWithGoogle();
            await exchangeToken(user);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Google sign-in failed");
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let user;
            if (isRegistering) {
                user = await registerWithEmail(email, password);
            } else {
                user = await loginWithEmail(email, password);
            }
            await exchangeToken(user);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Authentication failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Brand Showcase (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <span className="text-black font-bold text-xl">S</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Starto</span>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        {isRegistering ? "Join the Ecosystem." : "Welcome Back."}
                    </h1>
                    <p className="text-lg text-gray-400">
                        {isRegistering
                            ? "Create your account to connect with top startups, freelancers, and investors."
                            : "Sign in to access your dashboard and continue your journey."
                        }
                    </p>
                </div>

                <div className="relative z-10 text-sm text-gray-500">
                    © 2024 Starto Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">S</div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            {isRegistering ? "Create Account" : "Sign In"}
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            {isRegistering ? "Enter your details below to get started." : "Enter your email below to login to your account."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-6 text-base font-medium flex items-center gap-3 relative"
                        >
                            <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            {loading ? "Connecting..." : "Continue with Google"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 font-medium">{error}</p>
                            )}

                            <Button type="submit" className="w-full py-6 text-base" disabled={loading}>
                                {loading ? "Processing..." : (isRegistering ? "Create Account" : "Sign In")}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-primary hover:underline"
                            >
                                {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mt-8">
                        By signing in, you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
