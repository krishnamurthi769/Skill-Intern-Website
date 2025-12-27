import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SupportStatus } from "@prisma/client"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // 1. Auth & Role Check
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const role = (session.user as any).role
        if (role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const { status } = body

        // 2. Validate Status
        if (!status || !Object.values(SupportStatus).includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        // 3. Fetch current request to check transitions (Guardrail)
        const currentRequest = await prisma.supportRequest.findUnique({
            where: { id },
            select: { status: true }
        })

        if (!currentRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        // Guardrail: Do not allow RESOLVED -> OPEN
        if (currentRequest.status === SupportStatus.RESOLVED && status === SupportStatus.OPEN) {
            return NextResponse.json({ error: "Cannot reopen a resolved request" }, { status: 400 })
        }

        // 4. Update
        const updatedRequest = await prisma.supportRequest.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({ data: updatedRequest })

    } catch (error) {
        console.error("Error updating support request:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
