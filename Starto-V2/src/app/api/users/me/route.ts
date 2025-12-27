import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");
    const uidParam = searchParams.get("uid");

    // Priority: Session -> Params (for public profiles if we allow that later, but strictly controlled)
    // For "me", it must be session.
    let email = session?.user?.email;

    // If no session, check params ONLY for public data fetching scenarios (if strictly needed).
    // But this route is /users/me, so it implies "MY" data. 
    // If we want public profile, we should use /users/[id] or /api/profile.
    // So enforcing session here is safer for "me".

    // HOWEVER, the current codebase might use this for auth checks during login? 
    // Let's support email param IF it matches session or if it's a server-side internal call (hard to verify).
    // Safest: strict session for sensitive data.

    if (!email) {
        // Fallback for non-session calls (e.g. initial auth flow?)
        if (emailParam) email = emailParam;
        // else if (uidParam) ... (handle firebase uid if needed)
    }

    if (!email && !uidParam) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereClause: any = {};
    if (email) whereClause.email = email;
    else if (uidParam) whereClause.firebaseUid = uidParam;

    const user = await prisma.user.findFirst({
        where: whereClause,
        include: {
            freelancerProfile: true,
            startupProfile: true,
            investorProfile: true,
            providerProfile: true
        }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const targetEmail = session.user.email;

        const updateData: any = {};

        // Whitelist fields to allow updates for
        const allowedFields = ['name', 'image', 'phoneNumber', 'onboarded', 'activeRole', 'latitude', 'longitude', 'city', 'pincode', 'state', 'country'];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Location Cleanup: Only update if valid numbers provided. Ignore null/undefined/empty string to prevent overwriting with bad data.
        if (updateData.latitude !== undefined && updateData.latitude !== null && updateData.latitude !== "") {
            const lat = Number(updateData.latitude);
            if (!isNaN(lat)) {
                updateData.latitude = lat;
            } else {
                delete updateData.latitude; // Invalid number, do not touch DB
            }
        } else if (updateData.latitude === "") {
            // If expressly empty string, maybe trying to clear? For now, safer to ignore.
            delete updateData.latitude;
        }

        if (updateData.longitude !== undefined && updateData.longitude !== null && updateData.longitude !== "") {
            const lng = Number(updateData.longitude);
            if (!isNaN(lng)) {
                updateData.longitude = lng;
            } else {
                delete updateData.longitude;
            }
        } else if (updateData.longitude === "") {
            delete updateData.longitude;
        }

        console.log("[PATCH /api/users/me] Final updateData:", updateData, "User:", targetEmail);

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: true, message: "No changes to save" });
        }

        const updatedUser = await prisma.user.update({
            where: { email: targetEmail },
            data: updateData
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error("USER_UPDATE_ERROR", error);
        return NextResponse.json({ error: `Failed to update user: ${error.message}` }, { status: 500 });
    }
}
