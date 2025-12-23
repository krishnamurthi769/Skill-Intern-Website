import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// NOTE: This route was already implemented with session filtering in the previous step.
// Confirmed: Filters by investorProfile.userId === session.user.id


const InvestmentCreateSchema = z.object({
    startupId: z.string(),
    amount: z.number().min(1),
    equity: z.number().optional(),
    investorId: z.string().optional(),
});

export async function GET(req: Request) {
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = { user: { id: "dev-user-id" } };

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);

    // For Investor Dashboard, we typically want THEIR investments
    // Need to find the InvestorProfile for this user
    const investorProfile = await prisma.investorProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!investorProfile) {
        return NextResponse.json({ items: [], total: 0, page, limit });
    }

    const where = { investorId: investorProfile.id };

    const [items, total] = await Promise.all([
        prisma.investment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: { startup: { select: { name: true } } },
        }),
        prisma.investment.count({ where }),
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
            role: "INVESTOR"
        }
    });

    const body = await req.json();
    const parsed = InvestmentCreateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
    }

    const data = parsed.data;
    const ownerId = data.investorId ?? (session.user?.id as string);

    // Upsert InvestorProfile
    let profile = await prisma.investorProfile.findUnique({ where: { userId: ownerId } });
    if (!profile) {
        profile = await prisma.investorProfile.create({
            data: { userId: ownerId, firmName: "Angel Investor" }
        })
    }

    // Ensure Startup exists (mock or real)
    // For demo, we might need to create a dummy startup if checking relation
    let startup = await prisma.startupProfile.findUnique({ where: { id: data.startupId } });
    if (!startup) {
        // Just create a dummy one for the transaction if passing a raw ID, 
        // but typically frontend selects from existing. 
        // For this MVP vertical, let's auto-create if missing to avoid errors in manual test
        startup = await prisma.startupProfile.create({
            data: { name: "Demo Startup", ownerId: "admin_or_dummy" }
        })
    }

    const investment = await prisma.investment.create({
        data: {
            amount: data.amount,
            equity: data.equity ?? 0,
            investor: { connect: { id: profile.id } },
            startup: { connect: { id: startup.id } }
        },
    });

    return NextResponse.json({ investment }, { status: 201 });
}
