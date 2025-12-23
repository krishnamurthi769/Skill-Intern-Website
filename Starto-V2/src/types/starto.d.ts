export type UserRole = "admin" | "freelancer" | "investor" | "provider" | "startup";

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
}
