import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const skip = (page - 1) * limit

        const [connections, total] = await Promise.all([
            prisma.connectionRequest.findMany({
                take: limit,
                skip: skip,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    fromUser: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    },
                    toUser: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                }
            }),
            prisma.connectionRequest.count()
        ])

        return NextResponse.json({
            data: connections,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching connections:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
