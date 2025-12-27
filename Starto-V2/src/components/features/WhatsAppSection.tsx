"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto text-center max-w-3xl">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">No inbox. No platform lock-in.</h2>
                <p className="text-xl text-muted-foreground mb-4">
                    Starto does not replace conversations. We initiate the right connection.
                </p>
                <p className="text-lg font-medium text-foreground">
                    Conversations happen on WhatsApp.
                </p>
            </div>
        </section>
    );
}
