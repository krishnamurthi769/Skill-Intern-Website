import { UserRole } from "@/types/starto";

export const roles: UserRole[] = ["admin", "freelancer", "investor", "provider", "startup"];

export const roleLabels: Record<UserRole, string> = {
    admin: "Admin",
    freelancer: "Freelancer",
    investor: "Investor",
    provider: "Space Provider",
    startup: "Startup",
};
