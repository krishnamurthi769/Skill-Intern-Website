
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Debugging Startup Visibility...');

    // 1. Check Total Startup Profiles
    const totalProfiles = await prisma.startupProfile.count();
    console.log(`\n📊 Total StartupProfiles: ${totalProfiles}`);

    // 2. Check Profiles with Active Owner
    const profiles = await prisma.startupProfile.findMany({
        include: {
            owner: {
                select: { id: true, email: true, activeRole: true, role: true }
            }
        }
    });

    console.log('\n📝 Detailed Profiles:');
    profiles.forEach(p => {
        console.log(`- ID: ${p.id}, Owner: ${p.owner.email} (${p.owner.activeRole}), isActive: ${p.isActive}`);
    });

    // 3. specific check for the 'founder' verification user
    const founderEmail = 'verify-founder@starto.com';
    const founder = await prisma.user.findUnique({
        where: { email: founderEmail },
        include: { startupProfile: true }
    });

    if (founder) {
        console.log(`\n👤 Verify Founder User:`);
        console.log(`- ActiveRole: ${founder.activeRole}`);
        console.log(`- Has Profile? ${!!founder.startupProfile}`);
        if (founder.startupProfile) {
            console.log(`- Profile Active? ${founder.startupProfile.isActive}`);
        }
    } else {
        console.log(`\n❌ Verify Founder User (${founderEmail}) NOT FOUND.`);
    }

    // 4. Simulate the Explore Query
    const exploreResults = await prisma.startupProfile.findMany({
        where: {
            isActive: true,
            owner: { activeRole: "STARTUP" }
        }
    });
    console.log(`\n🔎 Simulated Explore Query Result Count: ${exploreResults.length}`);

}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
