import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { log, error as logError } from "@/lib/logger";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        log("ONBOARDING_PAYLOAD", body); // verify payload
        const { role, data } = body;
        const email = session.user.email; // Source of truth from session

        if (!role || !data) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Shared Location Object extraction (if consistent)
        const locationData = {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            address: data.address, // Display Only
        };

        // REMOVED: User Table updates. This endpoint is now strictly for Role Profile updates.
        // Clients must call PATCH /api/users/me for Base User Data (Name, Phone, Location, Active Role, Onboarded).

        // 1. Update the specific profile
        if (role === "startup") {
            log("STARTUP_UPDATE_START", { userId: user.id });
            await prisma.startupProfile.upsert({
                where: { ownerId: user.id },
                update: {
                    name: data.name,
                    industry: data.industry,
                    stage: data.stage,
                    teamSize: data.teamSize,
                    fundingRound: data.fundingRound,
                    fundingNeeded: data.fundingNeeded,
                    minHiringBudget: data.minHiringBudget,
                    maxHiringBudget: data.maxHiringBudget,
                    oneLiner: data.oneLiner,
                    description: data.description,
                    website: data.website,
                    isActive: true, // Mark as Active
                },
                create: {
                    ownerId: user.id,
                    name: data.name || "My Startup",
                    industry: data.industry,
                    stage: data.stage,
                    teamSize: data.teamSize,
                    fundingRound: data.fundingRound,
                    fundingNeeded: data.fundingNeeded,
                    minHiringBudget: data.minHiringBudget,
                    maxHiringBudget: data.maxHiringBudget,
                    oneLiner: data.oneLiner,
                    description: data.description,
                    website: data.website,
                    isActive: true,
                }
            });
            log("STARTUP_UPDATE_SUCCESS", {});
        } else if (role === "freelancer") {
            // ... freelancer update ...
            log("FREELANCER_UPDATE_START", { userId: user.id });
            await prisma.freelancerProfile.upsert({
                where: { userId: user.id },
                update: {
                    headline: data.headline,
                    skills: data.skills,
                    experience: data.experience,
                    availability: data.availability,
                    workType: data.workType,
                    portfolio: data.portfolio,
                    github: data.github,
                    linkedin: data.linkedin,
                    isActive: true, // Mark as Active
                },
                create: {
                    userId: user.id,
                    headline: data.headline,
                    skills: data.skills,
                    experience: data.experience,
                    availability: data.availability,
                    workType: data.workType,
                    portfolio: data.portfolio,
                    github: data.github,
                    linkedin: data.linkedin,
                    isActive: true,
                }
            });
            log("FREELANCER_UPDATE_SUCCESS", {});
        } else if (role === "investor") {
            log("INVESTOR_UPDATE_START", { userId: user.id, data });
            try {
                // Ensure profile exists first? The previous flow created it at 'role selection' time?
                // Wait. 'api/user/set-role' creates the EMPTY profile.
                // 'api/onboarding/complete' updates it.
                // If set-role wasn't called or failed, this update will fail if using `.update`.
                // Prisma `.update` requires existence. `.upsert` is safer.
                // BUT User flow says: Sign up -> Role Selection (creates profile) -> Onboarding (updates profile).
                // Let's assume it exists. If not, we should probably UPSERT.

                await prisma.investorProfile.upsert({
                    where: { userId: user.id },
                    update: {
                        investorType: data.investorType,
                        minTicketSize: data.minTicketSize ? Number(data.minTicketSize) : undefined,
                        maxTicketSize: data.maxTicketSize ? Number(data.maxTicketSize) : undefined,
                        sectors: data.sectors,
                        stages: data.stages,
                        isPublic: true,
                        isActive: true, // Mark as Active
                        thesisNote: data.thesisNote,
                    },
                    create: {
                        userId: user.id,
                        investorType: data.investorType,
                        minTicketSize: data.minTicketSize ? Number(data.minTicketSize) : undefined,
                        maxTicketSize: data.maxTicketSize ? Number(data.maxTicketSize) : undefined,
                        sectors: data.sectors,
                        stages: data.stages,
                        isPublic: true,
                        isActive: true, // Mark as Active
                        thesisNote: data.thesisNote,
                    }
                });
                log("INVESTOR_UPDATE_SUCCESS", {});
            } catch (e: any) {
                log("INVESTOR_UPDATE_ERROR", { error: e.message });
                throw e;
            }
        } else if (role === "provider") {
            log("PROVIDER_UPDATE_START", { userId: user.id, data });
            await prisma.providerProfile.upsert({
                where: { userId: user.id },
                update: {
                    companyName: data.companyName,
                    providerType: data.providerType,
                    capacity: data.capacity ? Number(data.capacity) : undefined,
                    minPrice: data.minPrice ? Number(data.minPrice) : undefined,
                    maxPrice: data.maxPrice ? Number(data.maxPrice) : undefined,
                    priceUnit: data.priceUnit,
                    description: data.description,
                    isActive: true, // Mark as Active
                },
                create: {
                    userId: user.id,
                    companyName: data.companyName,
                    providerType: data.providerType,
                    capacity: data.capacity ? Number(data.capacity) : undefined,
                    minPrice: data.minPrice ? Number(data.minPrice) : undefined,
                    maxPrice: data.maxPrice ? Number(data.maxPrice) : undefined,
                    priceUnit: data.priceUnit,
                    description: data.description,
                    isActive: true, // Mark as Active
                }
            });
            log("PROVIDER_UPDATE_SUCCESS", {});
        }

        // REMOVED: Final User table update (onboarded, activeRole, phone, location).
        // This responsibility has moved to PATCH /api/users/me

        // 2. Handle Referral Attribution
        // We do this server-side via cookie to ensure attribution even if client doesn't pass it
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies(); // await for Next.js 15+ compat
            const inviteCode = cookieStore.get("starto_invite_code")?.value;

            if (inviteCode && !user.referredById) {
                const invite = await prisma.invite.findUnique({ where: { code: inviteCode } });
                // Prevent self-referral
                if (invite && invite.inviterId !== user.id) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { referredById: invite.inviterId }
                    });
                    log("REFERRAL_ATTRIBUTED", { userId: user.id, inviterId: invite.inviterId, code: inviteCode });
                }
            }
        } catch (refError) {
            // Non-blocking error
            console.error("Referral Attribution Failed", refError);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        logError("ONBOARDING_ERROR", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
