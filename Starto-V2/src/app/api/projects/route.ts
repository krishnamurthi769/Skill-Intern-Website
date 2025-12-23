import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const ProjectCreateSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    budget: z.number().optional(),
    ownerId: z.string().optional(),
});

export async function GET(req: Request) {
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = { user: { id: "dev-user-id" } }; // MOCK AUTH

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
    const search = url.searchParams.get("search") ?? "";

    // Find Freelancer Profile
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: { userId: session.user.id }
    });

    // If no profile, they have no projects
    if (!freelancerProfile) {
        return NextResponse.json({ items: [], total: 0, page, limit });
    }

    const where: any = {
        ownerId: freelancerProfile.id // Filter by THEIR profile
    };

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.project.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: { owner: { select: { id: true } } },
        }),
        prisma.project.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
}

export async function POST(req: Request) {
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = { user: { id: "dev-user-id" } }; // MOCK AUTH

    // Ensure Dev User Exists (To satisfy Foreign Keys)
    await prisma.user.upsert({
        where: { id: session.user.id },
        update: {},
        create: {
            id: session.user.id,
            email: "dev@starto.com",
            role: "FREELANCER"
        }
    });

    const body = await req.json();
    const parsed = ProjectCreateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const data = parsed.data;
    const ownerId = data.ownerId ?? (session.user?.id as string);

    // Upsert a freelancer profile for this user if it doesn't exist, to satisfy the relation
    // or checks if owner exists. 
    // In our schema, Project.ownerId refers to FreelancerProfile.id? 
    // Wait, let's check schema. Relation is: owner FreelancerProfile @relation(fields: [ownerId]...)
    // But our mock session user ID "1" might not have a freelancer profile yet.
    // For simplicity in this vertical, we might need to ensure profile exists.

    // Quick fix: Check if profile exists, if not create it.
    let profile = await prisma.freelancerProfile.findUnique({ where: { userId: ownerId } });
    if (!profile) {
        profile = await prisma.freelancerProfile.create({
            data: { userId: ownerId, skills: [] }
        })
    }

    const project = await prisma.project.create({
        data: {
            title: data.title,
            description: data.description ?? "",
            budget: data.budget ?? 0,
            owner: { connect: { id: profile.id } }, // Connect to FreelancerProfile ID, not User ID
        },
    });

    return NextResponse.json({ project }, { status: 201 });
}
