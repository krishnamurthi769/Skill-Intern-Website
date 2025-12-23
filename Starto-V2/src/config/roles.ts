import { UserRole } from "@/types/starto";

export const roles: UserRole[] = ["admin", "freelancer", "investor", "provider"];

export const roleLabels: Record<UserRole, string> = {
    admin: "Admin",
    freelancer: "Freelancer",
    investor: "Investor",
    provider: "Space Provider",
};
