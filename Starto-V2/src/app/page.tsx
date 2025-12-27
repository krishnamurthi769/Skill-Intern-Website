import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { HowItWorks } from "@/components/home/HowItWorks";
import { InspirationSection } from "@/components/home/InspirationSection";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Strict redirect removed to allow navigation to Landing Page from Dashboard
  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <InspirationSection />
      </main>
      <Footer />
    </div>
  )
}
