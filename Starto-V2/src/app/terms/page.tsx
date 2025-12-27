import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">1. Platform Nature</h2>
                        <p>Starto is a discovery and connection platform for the startup ecosystem. We facilitate introductions but do not manage hiring, employment, or investment transactions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">2. No Responsibility for Deals</h2>
                        <p>Users connect and collaborate directly. Starto is not responsible for:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Outcomes of any collaborations.</li>
                            <li>Payments, salaries, or equity agreements.</li>
                            <li>Disputes arising between users.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">3. Accuracy Disclaimer</h2>
                        <p>Data insights and ecosystem maps provided on the platform are indicative. We do not guarantee 100% accuracy of user-submitted data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">4. User Responsibility</h2>
                        <p>You agree to provide accurate information about yourself and your work.</p>
                        <p className="mt-2">Misuse of the platform, spamming, or harassment can lead to immediate account removal.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">5. Beta Disclaimer</h2>
                        <p>Starto is currently in <strong>public beta</strong>. Features may change, break, or be removed as we improve the platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
                        <p>These terms are governed by the laws of India.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
