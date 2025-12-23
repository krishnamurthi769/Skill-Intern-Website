import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const uid = searchParams.get("uid");

    if (!email && !uid) {
        return NextResponse.json({ error: "Email or UID required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email || undefined },
                { firebaseUid: uid || undefined }
            ]
        }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}
