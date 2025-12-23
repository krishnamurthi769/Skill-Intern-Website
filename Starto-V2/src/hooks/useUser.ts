import { useQuery } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";

export interface DbUser {
    id: string;
    email: string;
    name: string | null;
    role: "STARTUP" | "FREELANCER" | "INVESTOR" | "PROVIDER" | "ADMIN" | null;
    onboarded: boolean;
    firebaseUid: string | null;
    image: string | null;
}

export function useUser() {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(auth.currentUser);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setFirebaseUser(user);
            setIsLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const { data: dbUser, isLoading: isLoadingDb } = useQuery<DbUser>({
        queryKey: ["user", firebaseUser?.uid],
        queryFn: async () => {
            if (!firebaseUser?.email) return null;
            const res = await fetch(`/api/users/me?email=${firebaseUser.email}`);
            if (!res.ok) return null;
            return res.json();
        },
        enabled: !!firebaseUser?.email,
    });

    return {
        user: firebaseUser,
        dbUser,
        role: dbUser?.role?.toLowerCase(), // normalized to lowercase for routing
        isLoading: isLoadingAuth || isLoadingDb,
        isAuthenticated: !!firebaseUser
    };
}
