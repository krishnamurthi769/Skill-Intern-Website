import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const myTasks = searchParams.get("myTasks") === "true";

    // Default to OPEN tasks if no status provided, or use provided status
    const statusFilter = status || "OPEN";

    const where: any = {
        status: statusFilter
    };

    // If logged in, exclude tasks created by the current user (if they are a startup)
    if (session?.user?.email) {
        const userStartup = await prisma.startupProfile.findFirst({
            where: { ownerId: session.user.id }
        });
        if (userStartup) {
            if (myTasks) {
                where.startupId = userStartup.id;
                if (!status) delete where.status; // Show all states if myTasks and no status filter
            } else {
                where.startupId = { not: userStartup.id };
            }
        }
    }

    if (search) {
        where.title = { contains: search, mode: "insensitive" };
    }
    if (category && category !== "All") {
        where.category = category;
    }

    const tasks = await prisma.task.findMany({
        where,
        include: {
            startup: {
                select: { id: true, name: true, valuation: true } // Removed logo
            },
            _count: {
                select: { proposals: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role Check
    const role = (session.user as any).role;
    if (role !== "STARTUP") {
        return NextResponse.json({ error: "Only startups can create tasks" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.title || !body.budget) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find Startup Profile
    const startup = await prisma.startupProfile.findFirst({
        where: { ownerId: session.user.id }
    });

    if (!startup) {
        return NextResponse.json({ error: "Startup profile not found" }, { status: 404 });
    }

    const task = await prisma.task.create({
        data: {
            startupId: startup.id,
            title: body.title,
            description: body.description || "",
            budget: Number(body.budget),
            duration: body.duration,
            category: "Engineering", // Default or from body
            status: "OPEN"
        }
    });

    return NextResponse.json({ success: true, taskId: task.id });
}
