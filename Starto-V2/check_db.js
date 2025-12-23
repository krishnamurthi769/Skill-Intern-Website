
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking for user 'dev@starto.com'...");
    const user = await prisma.user.findUnique({
        where: { email: 'dev@starto.com' }
    });
    console.log("User:", JSON.stringify(user, null, 2));

    if (user) {
        console.log("Checking for startup profile...");
        const profile = await prisma.startupProfile.findFirst({
            where: { ownerId: user.id }
        });
        console.log("Profile:", JSON.stringify(profile, null, 2));
    } else {
        console.log("User not found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
