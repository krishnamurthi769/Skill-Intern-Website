"use client";

const ROLES = [
    {
        title: "Founder",
        points: ["Validate location before building", "Find nearby talent, spaces, investors"]
    },
    {
        title: "Freelancer",
        points: ["Discover startups near you", "Connect directly via WhatsApp"]
    },
    {
        title: "Investor",
        points: ["Discover founders outside metro noise", "Spot early ecosystems before hype"]
    },
    {
        title: "Space Provider",
        points: ["List unused space", "Reach serious local builders"]
    }
];

export function RoleDiscoverySection() {
    return (
        <section className="py-24 bg-muted/10 border-y">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Different roles. Same ecosystem.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ROLES.map((r, i) => (
                        <div key={i} className="p-6 rounded-xl border bg-background hover:border-primary/50 transition-colors">
                            <h3 className="font-bold text-xl mb-4 text-primary">{r.title}</h3>
                            <ul className="space-y-2">
                                {r.points.map((p, j) => (
                                    <li key={j} className="text-muted-foreground text-sm leading-relaxed">
                                        • {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
