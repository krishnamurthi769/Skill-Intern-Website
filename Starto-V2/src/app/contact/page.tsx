import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md mx-auto space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Contact Starto</h1>
                        <p className="text-lg text-muted-foreground">
                            We’re building Starto in public. Reach out if you want to collaborate or give feedback.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button size="lg" className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                            <Link href="https://wa.me/918088500769" target="_blank">
                                <MessageCircle className="w-5 h-5" />
                                Chat on WhatsApp
                            </Link>
                        </Button>

                        <Button variant="outline" size="lg" className="w-full gap-2" asChild>
                            <Link href="mailto:startoindiaoffical@gmail.com">
                                <Mail className="w-5 h-5" />
                                startoindiaoffical@gmail.com
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
