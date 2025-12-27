import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { TheProblem } from "@/components/about/TheProblem";
import { TheInsight } from "@/components/about/TheInsight";
import { WhatIsStarto } from "@/components/about/WhatIsStarto";
import { OurPrinciples } from "@/components/about/OurPrinciples";
import { WhoIsItFor } from "@/components/about/WhoIsItFor";
import { TheVision } from "@/components/about/TheVision";

import { FoundingTeam } from "@/components/about/FoundingTeam";
import { AboutCTA } from "@/components/about/AboutCTA";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <AboutHero />
                <TheProblem />
                <TheInsight />
                <WhatIsStarto />
                <OurPrinciples />
                <FoundingTeam />
                <WhoIsItFor />
                <TheVision />

                <AboutCTA />
            </main>
            <Footer />
        </div>
    );
}
