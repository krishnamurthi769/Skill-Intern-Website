"use client";

const AUDIENCE = [
    "Founders validating before building",
    "Freelancers seeking real opportunities",
    "Investors discovering early ecosystems",
    "Space providers activating unused capacity"
];

export function WhoIsItFor() {
    return (
        <section className="py-24 bg-muted/20 border-y">
            <div className="container px-4 md:px-6 mx-auto text-center">
                <div className="max-w-2xl mx-auto">
                    <ul className="space-y-4">
                        {AUDIENCE.map((item, i) => (
                            <li key={i} className="text-lg md:text-xl font-medium text-muted-foreground p-4 bg-background rounded-lg border">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
