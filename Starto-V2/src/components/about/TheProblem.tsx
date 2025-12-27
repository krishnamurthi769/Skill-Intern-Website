"use client";

const PROBLEMS = [
    {
        title: "Location Bias",
        description: "Opportunities are often limited by geography."
    },
    {
        title: "Visibility Gap",
        description: "Talent exists everywhere, but visibility doesn't."
    },
    {
        title: "Capital Concentration",
        description: "Capital flows where noise is loud, not where potential is real."
    },
    {
        title: "Blind Decision-Making",
        description: "Early founders build blind, based on assumptions."
    }
];

export function TheProblem() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">The real problem in India’s startup ecosystem</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                    {PROBLEMS.map((p, i) => (
                        <div key={i} className="bg-background p-6 rounded-xl border shadow-sm">
                            <h3 className="font-semibold text-xl mb-2">{p.title}</h3>
                            <p className="text-muted-foreground">{p.description}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-2xl font-medium text-foreground">
                        This is not a talent problem. It’s a discovery problem.
                    </p>
                </div>
            </div>
        </section>
    );
}
