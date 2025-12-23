
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const testUsers = [
    {
        email: 'dev@starto.com',
        name: 'Dev User',
        role: UserRole.STARTUP,
        activeRole: UserRole.STARTUP
    },
    {
        email: 'verify-founder@starto.com',
        name: 'Verify Founder',
        role: UserRole.STARTUP,
        activeRole: UserRole.STARTUP
    },
    {
        email: 'verify-freelancer@starto.com',
        name: 'Verify Freelancer',
        role: UserRole.FREELANCER,
        activeRole: UserRole.FREELANCER
    },
    {
        email: 'verify-investor@starto.com',
        name: 'Verify Investor',
        role: UserRole.INVESTOR,
        activeRole: UserRole.INVESTOR
    },
    {
        email: 'verify-provider@starto.com',
        name: 'Verify Provider',
        role: UserRole.PROVIDER,
        activeRole: UserRole.PROVIDER
    }
];

async function main() {
    console.log("🚀 ENSURING TEST USERS...");

    for (const u of testUsers) {
        console.log(`\nProcessing ${u.email}...`);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { activeRole: u.activeRole },
            create: {
                email: u.email,
                name: u.name,
                role: u.role,
                activeRole: u.activeRole,
                phoneNumber: '+1234567890'
            }
        });

        // Activate relevant profile
        if (u.activeRole === UserRole.STARTUP) {
            await prisma.startupProfile.upsert({
                where: { ownerId: user.id },
                create: { ownerId: user.id, isActive: true, name: u.name, description: 'Test Startup' },
                update: { isActive: true }
            });
        } else if (u.activeRole === UserRole.FREELANCER) {
            await prisma.freelancerProfile.upsert({
                where: { userId: user.id },
                create: { userId: user.id, isActive: true, headline: 'Test Freelancer', skills: ['TypeScript', 'React'] },
                update: { isActive: true }
            });
        } else if (u.activeRole === UserRole.INVESTOR) {
            await prisma.investorProfile.upsert({
                where: { userId: user.id },
                create: { userId: user.id, isActive: true, firmName: 'Test Capital', sectors: ['Fintech'] },
                update: { isActive: true }
            });
        } else if (u.activeRole === UserRole.PROVIDER) {
            await prisma.providerProfile.upsert({
                where: { userId: user.id },
                create: { userId: user.id, isActive: true, companyName: 'Test Spaces' },
                update: { isActive: true }
            });
        }
        console.log(`✅ ${u.email} is ready.`);
    }

    console.log("\n✨ ALL TEST USERS ENSURED AND ACTIVATED.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
