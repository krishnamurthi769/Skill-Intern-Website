
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
        hasSession: !!session,
        user: session?.user || null,
        timestamp: new Date().toISOString()
    });
}
