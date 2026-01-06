import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const role = searchParams.get("role")
        const search = searchParams.get("search")
        const location = searchParams.get("location")

        const skip = (page - 1) * limit

        // Build Where Clause
        const where: any = {}

        if (role && role !== "ALL") {
            where.OR = [
                { role: role as any },
                { activeRole: role as any }
            ]
        }

        if (search) {
            where.AND = [
                {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phoneNumber: { contains: search, mode: "insensitive" } }
                    ]
                }
            ]
        }

        if (location) {
            const locFilter = { contains: location, mode: "insensitive" as const }
            // Merge into existing AND or create new
            const locCondition = {
                OR: [
                    { city: locFilter },
                    { country: locFilter },
                    { state: locFilter }
                ]
            }
            if (where.AND) {
                where.AND.push(locCondition)
            } else {
                where.AND = [locCondition]
            }
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                take: limit,
                skip: skip,
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true, // ADDED
                    image: true,       // ADDED
                    role: true,
                    activeRole: true,
                    city: true,
                    country: true,
                    state: true,
                    createdAt: true,
                }
            }),
            prisma.user.count({ where })
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
