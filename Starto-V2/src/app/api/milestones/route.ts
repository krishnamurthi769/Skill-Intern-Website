import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { contractId, title, amount } = body;

    if (!contractId || !title || !amount) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const milestone = await prisma.milestone.create({
        data: {
            contractId,
            title,
            amount: Number(amount),
            status: "PENDING"
        }
    });

    return NextResponse.json({ milestone }, { status: 201 });
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const { id, status } = body;

    const milestone = await prisma.milestone.update({
        where: { id },
        data: { status }
    });

    return NextResponse.json({ milestone });
}
