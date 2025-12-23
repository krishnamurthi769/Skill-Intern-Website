
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function normalizeUser(email: string, targetRole: 'STARTUP' | 'FREELANCER' | 'INVESTOR' | 'PROVIDER') {
    console.log(`\n🔧 Normalizing ${email} to ${targetRole}...`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log(`❌ User ${email} not found.`);
        return;
    }

    // 1. Update User Active Role
    await prisma.user.update({
        where: { email },
        data: { activeRole: targetRole as any }
    });
    console.log(`   - Set User.activeRole = ${targetRole}`);

    // 2. Handle Profiles (Activate Target, Deactivate Others)

    // STARTUP
    await prisma.startupProfile.upsert({
        where: { ownerId: user.id },
        create: { ownerId: user.id, isActive: targetRole === 'STARTUP', name: user.name || "Founder", description: "Normalized Founder" },
        update: { isActive: targetRole === 'STARTUP' }
    });
    console.log(`   - StartupProfile.isActive = ${targetRole === 'STARTUP'}`);

    // FREELANCER
    await prisma.freelancerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, isActive: targetRole === 'FREELANCER', hourlyRate: 50 },
        update: { isActive: targetRole === 'FREELANCER' }
    });
    console.log(`   - FreelancerProfile.isActive = ${targetRole === 'FREELANCER'}`);

    // INVESTOR
    await prisma.investorProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, isActive: targetRole === 'INVESTOR', firmName: "Normalized Capital" },
        update: { isActive: targetRole === 'INVESTOR' }
    });
    console.log(`   - InvestorProfile.isActive = ${targetRole === 'INVESTOR'}`);

    // PROVIDER
    await prisma.providerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, isActive: targetRole === 'PROVIDER', companyName: "Normalized Spaces" },
        update: { isActive: targetRole === 'PROVIDER' }
    });
    console.log(`   - ProviderProfile.isActive = ${targetRole === 'PROVIDER'}`);

    console.log(`✅ ${email} Normalized.`);
}

async function main() {
    console.log("🔒 DATA NORMALIZATION SCRIPT START");

    // Founders (Startups)
    await normalizeUser('dev@starto.com', 'STARTUP'); // Back to STARTUP
    await normalizeUser('verify-founder@starto.com', 'STARTUP');
    await normalizeUser('demo@starto.com', 'STARTUP');

    // Freelancers
    await normalizeUser('verify-freelancer@starto.com', 'FREELANCER');
    await normalizeUser('krishnamrs769@gmail.com', 'FREELANCER');

    // Investors
    await normalizeUser('verify-investor@starto.com', 'INVESTOR');

    // Providers
    await normalizeUser('verify-provider@starto.com', 'PROVIDER');

    console.log("🔒 DATA NORMALIZATION COMPLETE");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
