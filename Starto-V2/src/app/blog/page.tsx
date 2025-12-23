import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogList } from "@/components/blog/BlogList";

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <BlogHero />
                <BlogList />
            </main>
            <Footer />
        </div>
    )
}
