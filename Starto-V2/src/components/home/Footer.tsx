import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container px-4 md:px-6 mx-auto py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <span className="font-bold text-xl block mb-4">Starto</span>
                        <p className="text-sm text-muted-foreground">
                            The operating system for the next generation of startups.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/startup">Founders</Link></li>
                            <li><Link href="/freelancer">Freelancers</Link></li>
                            <li><Link href="/investor">Investors</Link></li>
                            <li><Link href="/provider">Space Providers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="#">Careers</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">Privacy Policy</Link></li>
                            <li><Link href="#">Terms of Service</Link></li>
                            <li><Link href="#">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2024 Starto Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#">Twitter</Link>
                        <Link href="#">LinkedIn</Link>
                        <Link href="#">Instagram</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
