import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { TrustSection } from "@/components/home/TrustSection";
import { AboutHero } from "@/components/about/AboutHero";
import { TeamSection } from "@/components/about/TeamSection";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <AboutHero />
                <TeamSection />
                <TrustSection />
            </main>
            <Footer />
        </div>
    )
}
