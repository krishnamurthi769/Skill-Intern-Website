"use client";

const PRINCIPLES = [
    {
        title: "Real data only",
        desc: "No fake metrics, no inflated numbers."
    },
    {
        title: "Location-first",
        desc: "Ecosystems exist before funding."
    },
    {
        title: "Direct connections",
        desc: "Conversations happen on WhatsApp, not behind paywalls."
    },
    {
        title: "Build from anywhere",
        desc: "Tier-2, Tier-3, rural — all count."
    }
];

export function OurPrinciples() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Our principles</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PRINCIPLES.map((p, i) => (
                        <div key={i} className="text-center group">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
