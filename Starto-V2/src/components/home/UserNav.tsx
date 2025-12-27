"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RoleAvatar } from "@/components/ui/role-avatar";
import { Button } from "@/components/ui/button";

export function UserNav() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;

    if (!user) return null;

    return (
        <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent"
            onClick={() => router.push("/dashboard?section=profile")}
            title="Go to Profile"
        >
            <RoleAvatar />
        </Button>
    );
}
