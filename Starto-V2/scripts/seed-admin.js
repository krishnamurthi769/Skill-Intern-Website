
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address as an argument.');
        process.exit(1);
    }

    console.log(`Looking for user with email: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        console.error(`User with email ${email} not found.`);
        process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.id}). Current Role: ${user.role}`);

    const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { role: 'ADMIN' },
    });

    console.log(`✅ User ${updatedUser.name} (${updatedUser.email}) is now an ADMIN.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
