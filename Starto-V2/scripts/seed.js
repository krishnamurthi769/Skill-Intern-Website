const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Seeding database...")

    // Create or update a test user
    const user = await prisma.user.upsert({
        where: { email: 'demo@starto.com' },
        update: {},
        create: {
            email: 'demo@starto.com',
            name: 'Demo Founder',
            role: 'STARTUP',
            image: 'https://github.com/shadcn.png',
        },
    })

    // Create or update a startup profile
    const startup = await prisma.startupProfile.upsert({
        where: { id: 'startup-1' },
        update: {},
        create: {
            id: 'startup-1',
            userId: user.id,
            name: 'Starto AI',
            website: 'https://starto.ai',
            description: 'Building the future of startup tooling.',
            stage: 'Seed',
            valuation: 5000000,
            industry: 'SaaS',
            location: 'San Francisco, CA'
        }
    })

    // Create a provider user
    const providerUser = await prisma.user.upsert({
        where: { email: 'provider@starto.com' },
        update: {},
        create: {
            email: 'provider@starto.com',
            name: 'Pro Space Provider',
            role: 'PROVIDER',
            image: 'https://github.com/shadcn.png',
        },
    })

    // Seed Properties
    const property1 = await prisma.property.create({
        data: {
            ownerId: providerUser.id,
            title: 'Tech Hub Downtown',
            slug: 'tech-hub-downtown',
            description: 'Modern office space optimized for tech startups. High speed internet, backup power, and 24/7 access.',
            category: 'Office',
            purposeTags: ['Tech', 'SaaS', 'High Growth'],
            sizeSqFt: 2500,
            priceMonthly: 5000,
            minLeaseMonths: 12,
            address: '123 Tech Park',
            city: 'San Francisco',
            state: 'CA',
            amenities: ['Fiber Internet', 'Backup Power', 'Conference Room', 'Coffee Bar'],
            powerRating: 'Industrial',
            internet: '10 Gbps Fiber',
            parkingSpots: 10,
            status: 'AVAILABLE'
        }
    })

    const property2 = await prisma.property.create({
        data: {
            ownerId: providerUser.id,
            title: 'Creative Studio Loft',
            slug: 'creative-studio-loft',
            description: 'Soundproof creative studio perfect for media and design agencies.',
            category: 'Studio',
            purposeTags: ['Media', 'Design', 'Film'],
            sizeSqFt: 1200,
            priceMonthly: 3000,
            minLeaseMonths: 6,
            address: '456 Design Ave',
            city: 'San Francisco',
            state: 'CA',
            amenities: ['Soundproofing', 'High Ceilings', 'Natural Light'],
            powerRating: 'Standard',
            internet: '1 Gbps',
            parkingSpots: 2,
            status: 'AVAILABLE'
        }
    })


    console.log("Seeding complete! ✅")
    console.log("User:", user.email)
    console.log("Provider:", providerUser.email)
    console.log("Startup:", startup.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
