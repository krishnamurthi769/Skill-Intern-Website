import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const skip = (page - 1) * limit

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                take: limit,
                skip: skip,
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    activeRole: true,
                    city: true,
                    country: true,
                    // status: true, // Removed as it doesn't exist on User model
                    createdAt: true,
                }
            }),
            prisma.user.count()
        ])

        return NextResponse.json({
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
