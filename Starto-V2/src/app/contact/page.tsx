import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <ContactHero />
                <ContactForm />
            </main>
            <Footer />
        </div>
    )
}
