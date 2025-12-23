import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: "firebase-auth",
            name: "Firebase",
            credentials: {
                idToken: { label: "ID Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.idToken) return null;

                try {
                    // Verify with Google Identity Toolkit
                    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idToken: credentials.idToken }),
                    });

                    const data = await res.json();
                    if (!data.users || data.users.length === 0) return null;

                    const firebaseUser = data.users[0];
                    const email = firebaseUser.email;
                    // const uid = firebaseUser.localId; // Use if mapping via Firebase UID

                    // Sync with Prisma
                    const user = await prisma.user.upsert({
                        where: { email },
                        update: {
                            // Optionally update name/image if changed in Firebase
                            // name: firebaseUser.displayName || undefined,
                        },
                        create: {
                            email,
                            name: firebaseUser.displayName || email.split("@")[0],
                            image: firebaseUser.photoUrl,
                            role: "STARTUP", // Default Role
                            onboarded: false
                        }
                    });

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role as any,
                        activeRole: user.activeRole as any
                    };
                } catch (e) {
                    console.error("Firebase Key Exchange Failed", e);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.activeRole = (user as any).activeRole;
            }

            // 1. HARD ROLE SYNC: Fetch fresh from DB on every major JWT update or periodically
            // This ensures if a moderator or another process changes the role, the session updates.
            if (token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                    select: { activeRole: true, role: true }
                });
                if (dbUser) {
                    token.activeRole = (dbUser.activeRole?.toLowerCase() as any) || undefined;
                    token.role = (dbUser.role?.toLowerCase() as any) || undefined;
                }
            }

            if (trigger === "update" && session?.activeRole) {
                token.activeRole = session.activeRole;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
                (session.user as any).activeRole = token.activeRole;
            }
            return session;
        }
    },
    // pages: {
    //     signIn: '/api/auth/signin',
    // }
};
