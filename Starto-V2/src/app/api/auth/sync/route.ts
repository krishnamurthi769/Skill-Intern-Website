import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { uid, email, name } = await req.json();

    const user = await prisma.user.upsert({
        where: { firebaseUid: uid },
        update: {},
        create: {
            firebaseUid: uid,
            email,
            name,
        },
    });

    return NextResponse.json(user);
}
