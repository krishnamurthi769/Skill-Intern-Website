"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Rocket, Briefcase, TrendingUp, Building2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface RoleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function RoleAvatar({ className }: RoleAvatarProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const user = session?.user;
    const role = (user as any)?.activeRole?.toLowerCase();

    if (!user) return null;

    // Define visual themes and links for each role
    const roleConfig: any = {
        startup: {
            icon: Rocket,
            link: "/dashboard?section=settings",
            label: "Founder Profile"
        },
        freelancer: {
            icon: Briefcase,
            link: "/dashboard?section=profile",
            label: "Freelancer Profile"
        },
        investor: {
            icon: TrendingUp,
            link: "/dashboard?section=settings",
            label: "Investor Profile"
        },
        provider: {
            icon: Building2,
            link: "/dashboard?section=settings",
            label: "Provider Profile"
        }
    };

    const currentConfig = roleConfig[role] || {
        icon: User,
        link: "/dashboard?section=settings",
        label: "User Profile"
    };

    const RoleIcon = currentConfig.icon;

    const handleClick = () => {
        router.push(currentConfig.link);
    };

    return (
        <div
            onClick={handleClick}
            className={cn("cursor-pointer group relative", className)}
            title={`View ${currentConfig.label}`}
        >
            <Avatar className={cn("h-10 w-10 border border-border dark:border-gray-700 shadow-sm transition-all group-hover:ring-2 group-hover:ring-primary/20", className)}>
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="bg-primary/5 text-primary font-medium">
                    {user.name?.slice(0, 2).toUpperCase() || "ME"}
                </AvatarFallback>
            </Avatar>

            {/* Role Indicator Badge */}
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] ring-2 ring-background">
                <RoleIcon className="h-2.5 w-2.5" />
            </div>
        </div>
    );
}

