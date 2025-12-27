"use client";

export function TheInsight() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-12">What we realized</h2>

                <div className="space-y-6 text-xl md:text-2xl font-medium text-muted-foreground">
                    <p>Every startup begins in a place.</p>
                    <p>Every place already has signals.</p>
                    <p>Nobody connects these signals early.</p>
                </div>

                <div className="mt-12 p-6 border rounded-xl bg-primary/5 text-foreground">
                    <p className="text-lg font-medium">
                        If founders could see their ecosystem clearly, fewer would fail blindly.
                    </p>
                </div>
            </div>
        </section>
    );
}
