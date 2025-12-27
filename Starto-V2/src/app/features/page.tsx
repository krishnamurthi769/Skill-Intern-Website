import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { FeaturesHero } from "@/components/features/FeaturesHero";
import { MarketExploreSection } from "@/components/features/MarketExploreSection";
import { NearbyMapSection } from "@/components/features/NearbyMapSection";
import { RoleDiscoverySection } from "@/components/features/RoleDiscoverySection";
import { WhatsAppSection } from "@/components/features/WhatsAppSection";
import { AntiFeaturesSection } from "@/components/features/AntiFeaturesSection";
import { FeaturesHowItWorks } from "@/components/features/FeaturesHowItWorks";
import { FeaturesCTA } from "@/components/features/FeaturesCTA";

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <FeaturesHero />
                <MarketExploreSection />
                <NearbyMapSection />
                <RoleDiscoverySection />
                <WhatsAppSection />
                <AntiFeaturesSection />
                <FeaturesHowItWorks />
                <FeaturesCTA />
            </main>
            <Footer />
        </div>
    );
}
