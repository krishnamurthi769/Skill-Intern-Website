import { UserRole } from "./starto";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            activeRole?: UserRole; // Optional because legacy sessions might not have it immediately
        } & DefaultSession["user"];
    }
    interface User {
        role: UserRole;
        activeRole?: UserRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole;
        activeRole?: UserRole;
    }
}
