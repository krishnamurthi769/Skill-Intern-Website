import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { RoleSelection } from "@/components/home/RoleSelection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { TrustSection } from "@/components/home/TrustSection";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { UnicornMarquee } from "@/components/home/UnicornMarquee";

import { AboutSection } from "@/components/home/AboutSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";


import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Session check removed to allow access to landing page for logged-in users
  // Navbar handles the 'Dashboard' link logic.

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Reusing existing Navbar if possible, or we can make a custom HomeNavbar */}
      <main className="flex-1">
        <HeroSection />
        <UnicornMarquee />
        <AboutSection />
        <FeaturesSection />
        <RoleSelection />

        <HowItWorks />
        <MarketplacePreview />
        <TrustSection />
      </main>
      <Footer />
    </div>
  )
}
