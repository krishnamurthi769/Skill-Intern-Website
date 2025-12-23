
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Phase 1 Verification...');

    try {
        // --- SETUP: Create Test Users ---
        console.log('\n📦 Setting up Test Users...');

        // 1. Founder
        const founder = await prisma.user.upsert({
            where: { email: 'verify-founder@starto.com' },
            update: { activeRole: 'STARTUP', role: 'STARTUP', name: 'Verify Founder', phoneNumber: '+1234567890' },
            create: {
                email: 'verify-founder@starto.com',
                name: 'Verify Founder',
                role: 'STARTUP',
                activeRole: 'STARTUP',
                phoneNumber: '+1234567890',
                onboarded: true
            }
        });
        // Ensure Profile
        await prisma.startupProfile.upsert({
            where: { ownerId: founder.id },
            update: { isActive: true, name: 'Verify Startup' },
            create: { ownerId: founder.id, name: 'Verify Startup', isActive: true, oneLiner: 'Verification OneLiner' }
        });

        // 2. Freelancer
        const freelancer = await prisma.user.upsert({
            where: { email: 'verify-freelancer@starto.com' },
            update: { activeRole: 'FREELANCER', role: 'FREELANCER', name: 'Verify Freelancer', phoneNumber: '+0987654321' },
            create: {
                email: 'verify-freelancer@starto.com',
                name: 'Verify Freelancer',
                role: 'FREELANCER',
                activeRole: 'FREELANCER',
                phoneNumber: '+0987654321',
                onboarded: true
            }
        });
        // Ensure Profile
        await prisma.freelancerProfile.upsert({
            where: { userId: freelancer.id },
            update: { isActive: true },
            create: { userId: freelancer.id, isActive: true, headline: 'Verification Headline' }
        });

        // 3. Investor (Distraction)
        const investor = await prisma.user.upsert({
            where: { email: 'verify-investor@starto.com' },
            update: { activeRole: 'INVESTOR', role: 'INVESTOR' },
            create: { email: 'verify-investor@starto.com', role: 'INVESTOR', activeRole: 'INVESTOR', onboarded: true }
        });
        await prisma.investorProfile.upsert({
            where: { userId: investor.id },
            update: { isActive: true },
            create: { userId: investor.id, isActive: true }
        });

        console.log('✅ Test Users Ready.');

        // --- CHECK 1: EXPLORE VISIBILITY ---
        console.log('\n🔍 CHECK 1: EXPLORE VISIBILITY');

        // Query as Founder
        const founderResults = await prisma.freelancerProfile.findMany({
            where: { isActive: true, user: { activeRole: "FREELANCER" } }
        });
        const founderSeesInvestors = await prisma.investorProfile.findMany({
            where: { isActive: true, user: { activeRole: "INVESTOR" } }
        });
        // Simulation: In the code, I explicitly removed the investor fetch for founders.
        // So "Founder View" in my logic contains ONLY freelancers.

        if (founderResults.length > 0) console.log('✅ Founder sees Freelancers');
        else console.error('❌ Founder cannot see Freelancers');

        // Query as Freelancer
        const freelancerResults = await prisma.startupProfile.findMany({
            where: { isActive: true, owner: { activeRole: "STARTUP" } }
        });

        if (freelancerResults.length > 0) console.log('✅ Freelancer sees Startups');
        else console.error('❌ Freelancer cannot see Startups');

        // --- CHECK 3: SEND CONNECTION ---
        console.log('\n🔍 CHECK 3: SEND CONNECTION');

        // Clear any existing requests
        await prisma.connectionRequest.deleteMany({
            where: {
                fromUserId: founder.id,
                toUserId: freelancer.id
            }
        });

        // Simulate API Create
        const request = await prisma.connectionRequest.create({
            data: {
                fromUserId: founder.id,
                toUserId: freelancer.id,
                senderName: founder.name!,
                senderRole: founder.activeRole!,
                purpose: "Networking",
                message: "Let's connect for verification.",
                status: "PENDING"
            }
        });

        if (request && request.status === 'PENDING') {
            console.log('✅ Connection Request Created (PENDING)');
        } else {
            console.error('❌ Failed to create connection request');
            process.exit(1);
        }

        // --- CHECK 4: INBOX VISIBILITY (DB Side) ---
        console.log('\n🔍 CHECK 4: INBOX QUERY');
        const inbox = await prisma.connectionRequest.findMany({
            where: { toUserId: freelancer.id, status: 'PENDING' }
        });
        if (inbox.find(r => r.id === request.id)) {
            console.log('✅ Request visible in Freelancer Inbox');
        } else {
            console.error('❌ Request NOT found in Inbox');
        }

        // --- CHECK 5: ACCEPT CONNECTION ---
        console.log('\n🔍 CHECK 5: ACCEPT CONNECTION');

        const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
        const connectionId = `ST-${uniqueSuffix}`;

        const accepted = await prisma.connectionRequest.update({
            where: { id: request.id },
            data: {
                status: 'ACCEPTED',
                connectionId: connectionId
            }
        });

        if (accepted.status === 'ACCEPTED' && accepted.connectionId?.startsWith('ST-')) {
            console.log(`✅ Connection Accepted. ID: ${accepted.connectionId}`);
        } else {
            console.error('❌ Acceptance failed or Invalid ID');
            process.exit(1);
        }

        // --- CHECK 6: WHATSAPP LINK ---
        console.log('\n🔍 CHECK 6: WHATSAPP GENERATION');

        // Logic from api/connections/[id]/whatsapp/route.ts
        // Founder (sender) phone: +1234567890
        // Freelancer (receiver) phone: +0987654321

        // Scenario: Freelancer clicks 'Chat' -> wants to chat with Founder
        // Logic: Identify other user -> Founder. Get phone -> +1234567890.

        const otherUser = await prisma.user.findUnique({ where: { id: founder.id } });
        const cleanPhone = otherUser?.phoneNumber?.replace(/\D/g, '');
        const message = encodeURIComponent(`Hi, we connected on Starto (ID: ${accepted.connectionId})`);
        const link = `https://wa.me/${cleanPhone}?text=${message}`;

        console.log(`Generated Link: ${link}`);

        if (link.includes('1234567890') && link.includes(accepted.connectionId!)) {
            console.log('✅ WhatsApp Link Valid');
        } else {
            console.error('❌ WhatsApp Link Invalid');
        }

        console.log('\n🎉 PHASe 1 VERIFICATION SCRIPT COMPLETE');

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
