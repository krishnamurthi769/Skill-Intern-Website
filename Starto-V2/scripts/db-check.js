const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Checking DB Connection...")
    try {
        const userCount = await prisma.user.count()
        console.log("Users:", userCount)

        console.log("Checking Task Table...")
        const taskCount = await prisma.task.count()
        console.log("Tasks:", taskCount)
        console.log("DB Check Passed! ✅")
    } catch (e) {
        console.error("DB Check Failed ❌")
        console.error(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
