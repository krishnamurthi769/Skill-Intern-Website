import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'dev@starto.com';
    const user = await prisma.user.findUnique({
        where: { email }
    });
    console.log(`User ${email}:`);
    if (user) {
        console.log(`ID: ${user.id}`);
        console.log(`ActiveRole: ${user.activeRole}`);
    } else {
        console.log("NOT FOUND");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
