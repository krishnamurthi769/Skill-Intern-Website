import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const SpaceCreateSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    pricePerHour: z.number().optional(),
    address: z.string().optional(),
    capacity: z.number().optional(),
    ownerId: z.string().optional(),
});

export async function GET(req: Request) {
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = { user: { id: "dev-user-id" } };

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
    const search = url.searchParams.get("search") ?? "";

    // Find Provider Profile
    const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!providerProfile) {
        return NextResponse.json({ items: [], total: 0, page, limit });
    }

    const where: any = {
        providerId: providerProfile.id
    };

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.space.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: { provider: { select: { id: true, companyName: true } } },
        }),
        prisma.space.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
}

export async function POST(req: Request) {
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = { user: { id: "dev-user-id" } };

    // Ensure Dev User Exists
    await prisma.user.upsert({
        where: { id: session.user.id },
        update: {},
        create: {
            id: session.user.id,
            email: "dev@starto.com",
            role: "PROVIDER" // Role doesn't matter much as we bypass, but nice to be consistent
        }
    });

    const body = await req.json();
    const parsed = SpaceCreateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const data = parsed.data;
    const ownerId = data.ownerId ?? (session.user?.id as string);

    // Upsert a provider profile for this user if it doesn't exist
    let profile = await prisma.providerProfile.findUnique({ where: { userId: ownerId } });
    if (!profile) {
        profile = await prisma.providerProfile.create({
            data: { userId: ownerId, companyName: "Default Company" }
        })
    }

    const space = await prisma.space.create({
        data: {
            name: data.name,
            description: data.description ?? "",
            pricePerHour: data.pricePerHour ?? 0,
            address: data.address ?? "Unknown Address",
            capacity: data.capacity ?? 1,
            provider: { connect: { id: profile.id } },
        },
    });

    return NextResponse.json({ space }, { status: 201 });
}
