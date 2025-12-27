"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Share2, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function InviteCard() {
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Fetch invite code on mount
        const fetchCode = async () => {
            try {
                const res = await fetch("/api/invites/generate", { method: "POST" });
                if (res.ok) {
                    const data = await res.json();
                    setInviteCode(data.code);
                }
            } catch (err) {
                console.error("Failed to fetch invite code", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCode();
    }, []);

    const getInviteLink = () => {
        if (!inviteCode) return "";
        const origin = window.location.origin;
        return `${origin}/invite/${inviteCode}`;
    }

    const handleCopy = () => {
        const link = getInviteLink();
        if (!link) return;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Invite link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    }

    const handleWhatsApp = () => {
        const link = getInviteLink();
        if (!link) return;
        const text = encodeURIComponent(`Hey! I'm using Starto to connect with the local startup ecosystem. Join me here to find founders, freelancers, and investors nearby: ${link}`);
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }

    if (loading) {
        return <Skeleton className="w-full h-32 rounded-xl" />;
    }

    if (!inviteCode) return null; // Hide if failed

    return (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 overflow-hidden relative">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        Grow your local ecosystem
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                        Starto works best when your network is here. Invite founders and freelancers you trust.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="gap-2 border-primary/20 hover:bg-primary/5 min-w-[140px]"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy Link"}
                    </Button>

                    <Button
                        className="gap-2 bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
                        onClick={handleWhatsApp}
                    >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
