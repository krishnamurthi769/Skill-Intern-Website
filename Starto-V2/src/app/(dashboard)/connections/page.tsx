import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardShell } from "@/components/ui/dashboard-shell"
import { RequestsClient } from "@/components/connections/RequestsClient"

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation"

export default async function ConnectionsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        redirect("/api/auth/signin")
    }

    // ROBUST FIX: Lookup User by Email to get REAL DB ID (Bypass Zombie Session ID)
    let userId = session.user.id;
    if (session.user.email) {
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });
        if (dbUser) {
            userId = dbUser.id;
        }
    }

    // Inbox Query (Strict logic from Prompt)
    // "pending = await prisma.connectionRequest.findMany({ where: { receiverId: session.user.id, status: 'PENDING' }, include: { sender: true } })"
    const pending = await prisma.connectionRequest.findMany({
        where: {
            toUserId: userId,
            status: "PENDING"
        },
        include: {
            fromUser: { select: { id: true, name: true, image: true, activeRole: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Fetched accepted connections to allow WhatsApp interaction as per Verification steps
    const accepted = await prisma.connectionRequest.findMany({
        where: {
            OR: [
                { toUserId: userId },
                { fromUserId: userId }
            ],
            status: "ACCEPTED"
        },
        include: {
            fromUser: { select: { id: true, name: true, image: true } },
            toUser: { select: { id: true, name: true, image: true } }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <DashboardShell>
            <div className="max-w-5xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-2">Connections</h1>
                <p className="text-muted-foreground mb-8">Manage your network and requests.</p>
                <RequestsClient
                    initialPending={pending}
                    initialAccepted={accepted}
                    userId={userId}
                />
            </div>
        </DashboardShell>
    )
}
