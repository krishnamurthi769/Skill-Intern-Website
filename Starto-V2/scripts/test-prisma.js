const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Testing Prisma Client Relation...")
    try {
        // Attempt to fetch a task with proposals, similar to the API
        // We don't need a real ID, just want to see if the Query Engine accepts the 'include'
        const task = await prisma.task.findFirst({
            include: {
                proposals: true
            }
        })
        console.log("Query Successful! (Result usually null if empty)")
        console.log("Client is OK. ✅")
    } catch (e) {
        console.error("Query Failed ❌")
        console.error(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
