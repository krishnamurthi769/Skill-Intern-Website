"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface RequestConnectionButtonProps {
    receiverUserId: string
    receiverName: string
}

export function RequestConnectionButton({ receiverUserId, receiverName }: RequestConnectionButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSend = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/connections/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverUserId,
                    message: message.trim()
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to send request");
            }

            toast.success("Connection request sent!");
            setOpen(false);
            setMessage("");
        } catch (error) {
            toast.error("Could not send request. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Request to Connect</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect with {receiverName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Send a brief message to introduce yourself or explain why you'd like to connect.
                    </p>
                    <Textarea
                        placeholder={`Hi ${receiverName}, I'd like to discuss...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSend} disabled={loading || !message.trim()}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
