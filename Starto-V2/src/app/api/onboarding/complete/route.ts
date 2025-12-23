import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { log, error as logError } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        log("ONBOARDING_PAYLOAD", body); // verify payload
        const { email, role, data } = body;

        if (!email || !role || !data) {
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

        // 0. Update Base User Data (Name, Phone, Active Role)
        const roleToActiveRole: Record<string, string> = {
            "startup": "STARTUP",
            "freelancer": "FREELANCER",
            "investor": "INVESTOR",
            "provider": "PROVIDER" // or SPACE_PROVIDER if enum differs? checked schema: PROVIDER
        };

        const targetActiveRole = roleToActiveRole[role];

        if (data.name || data.phoneNumber || targetActiveRole) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name || undefined,
                    phoneNumber: data.phoneNumber || undefined,
                    activeRole: targetActiveRole || undefined
                }
            });
        }

        // 1. Update the specific profile
        if (role === "startup") {
            log("STARTUP_UPDATE_START", { userId: user.id });
            await prisma.startupProfile.update({
                where: { ownerId: user.id },
                data: {
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
                    ...locationData,
                },
            });
            log("STARTUP_UPDATE_SUCCESS", {});
        } else if (role === "freelancer") {
            // ... freelancer update ...
            log("FREELANCER_UPDATE_START", { userId: user.id });
            await prisma.freelancerProfile.update({
                where: { userId: user.id },
                data: {
                    headline: data.headline,
                    skills: data.skills,
                    experience: data.experience,
                    availability: data.availability,
                    workType: data.workType,
                    portfolio: data.portfolio,
                    github: data.github,
                    linkedin: data.linkedin,
                    isActive: true, // Mark as Active
                    ...locationData,
                },
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
                        stages: data.stages,
                        isPublic: true,
                        isActive: true, // Mark as Active
                        thesisNote: data.thesisNote,
                        ...locationData,
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
                        ...locationData,
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
                    ...locationData,
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
                    ...locationData,
                }
            });
            log("PROVIDER_UPDATE_SUCCESS", {});
        }

        // 2. Mark User as Onboarded AND Save Phone Number AND Set Active Role
        // Note: data.phoneNumber should be passed from frontend

        let activeRoleEnum;
        if (role === 'startup') activeRoleEnum = 'STARTUP';
        else if (role === 'freelancer') activeRoleEnum = 'FREELANCER';
        else if (role === 'investor') activeRoleEnum = 'INVESTOR';
        else if (role === 'provider') activeRoleEnum = 'PROVIDER';

        await prisma.user.update({
            where: { email },
            data: {
                onboarded: true,
                phoneNumber: data.phoneNumber, // Save for WhatsApp Link
                activeRole: activeRoleEnum as any, // Generic enum cast
                role: activeRoleEnum as any // SYNC legacy role for NextAuth Session
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        logError("ONBOARDING_ERROR", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
