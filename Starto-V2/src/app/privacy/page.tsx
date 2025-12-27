import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Name & Email:</strong> Collected via Google Login for authentication.</li>
                            <li><strong>Location:</strong> City and coordinates to show you relevant local startups and peers.</li>
                            <li><strong>Role:</strong> Whether you are a Founder, Freelancer, Investor, or Space Provider.</li>
                            <li><strong>WhatsApp Number:</strong> If provided, to enable direct external connections.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">2. How We Use Data</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To show you the nearby startup ecosystem.</li>
                            <li>To enable direct connections between users.</li>
                            <li>To improve the discovery experience on the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">3. Data Sharing</h2>
                        <p>We do <strong>NOT</strong> sell your data to third parties.</p>
                        <p className="mt-2">WhatsApp conversations happen externally and are not stored or read by Starto.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">4. Data Storage</h2>
                        <p>Your data is stored securely. Please note that Starto is an early-stage beta platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">5. Your Control</h2>
                        <p>You can update your profile details at any time from your dashboard.</p>
                        <p className="mt-2">To request account deletion, please contact us via email or WhatsApp.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">6. Contact</h2>
                        <p>If you have any questions, reach out to us at: <a href="mailto:startoindiaoffical@gmail.com" className="text-primary hover:underline">startoindiaoffical@gmail.com</a></p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
