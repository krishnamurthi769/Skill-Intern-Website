
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Starting verification...");

    // 1. Find a user with a startup profile
    const user = await prisma.user.findFirst({
        where: {
            startupProfile: { isNot: null }
        },
        include: {
            startupProfile: true
        }
    });

    if (!user || !user.startupProfile) {
        console.log("No startup user found. Skipping test.");
        return;
    }

    const email = user.email;
    const startupId = user.startupProfile.id;
    console.log(`Testing with user: ${email} (Startup ID: ${startupId})`);

    // 2. Define payload
    const payload = {
        location: "Test City, Test State",
        latitude: 12.9716,
        longitude: 77.5946,
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560001",
        address: "Test Address 123"
    };

    // 3. Mock the fetch PATCH request locally?
    // Since we can't easily fetch localhost:3000 from this script without server running,
    // we will DIRECTLY call the DB update logic to verify the schema and Prisma client work.
    // Testing the API route via `fetch` requires the app to be running.
    // I assume the app is NOT running in this environment.

    // Instead, I will verify that `prisma.startupProfile.update` accepts these fields.
    // If this compiles and runs, it proves the Prisma Schema + Client support these fields.

    console.log("Updating profile directly via Prisma...");

    try {
        const updated = await prisma.startupProfile.update({
            where: { id: startupId },
            data: {
                latitude: payload.latitude,
                longitude: payload.longitude,
                city: payload.city,
                state: payload.state,
                country: payload.country,
                pincode: payload.pincode,
                address: payload.address
            }
        });

        console.log("Update successful!");
        console.log("New Location Data:", {
            lat: updated.latitude,
            lng: updated.longitude,
            city: updated.city,
            state: updated.state
        });

        if (updated.latitude === 12.9716 && updated.city === "Bengaluru") {
            console.log("VERIFICATION PASSED: Database accepted location fields.");
        } else {
            console.error("VERIFICATION FAILED: Data mismatch.");
        }

    } catch (e) {
        console.error("VERIFICATION FAILED: Prisma update error", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
