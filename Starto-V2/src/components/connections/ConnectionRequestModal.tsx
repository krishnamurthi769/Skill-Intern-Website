"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner" // Assuming sonner or use-toast
import { Loader2, Link as LinkIcon } from "lucide-react"

import { auth } from "@/lib/firebase" // Import auth

interface ConnectionRequestModalProps {
    receiverId: string
    receiverName: string // Used for context or disabled checks
    isOpen: boolean
    onClose: () => void
}

export function ConnectionRequestModal({ receiverId, receiverName, isOpen, onClose }: ConnectionRequestModalProps) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [purpose, setPurpose] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async () => {
        if (!name || !role || !purpose || !message) {
            toast.error("Please fill all fields")
            return
        }

        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast.error("You must be logged in to send a request");
            return;
        }

        setLoading(true)
        try {
            const res = await fetch("/api/connections/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toUserId: receiverId,
                    senderName: name,
                    senderRole: role,
                    purpose,
                    message,
                    fromFirebaseUid: currentUser.uid // Send Firebase UID
                })
            })

            if (!res.ok) {
                const errorText = await res.text();
                if (res.status === 409) {
                    toast.error("Request already sent to this user")
                    setSent(true) // Treat as done to prevent spam
                } else {
                    toast.error(errorText || "Failed to send request")
                }
                setLoading(false)
                return
            }

            setSent(true)
            toast.success("Connection request sent.")
            // "✅ Connection request sent. You’ll be notified once it’s accepted."

        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
            setLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        // Reset if needed, or keep state
        if (sent) {
            setName("")
            setMessage("")
            setSent(false)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request to Connect</DialogTitle>
                    <DialogDescription>
                        Connect with {receiverName}.
                    </DialogDescription>
                </DialogHeader>

                {!sent ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={setRole} value={role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Founder">Founder</SelectItem>
                                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                                    <SelectItem value="Investor">Investor</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="purpose">Purpose</Label>
                            <Select onValueChange={setPurpose} value={purpose}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Why do you want to connect?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hiring">Hiring</SelectItem>
                                    <SelectItem value="Investment">Investment</SelectItem>
                                    <SelectItem value="Workspace">Workspace</SelectItem>
                                    <SelectItem value="Mentorship">Mentorship</SelectItem>
                                    <SelectItem value="Partnership">Partnership</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Short message</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hi, I'd like to connect..."
                                maxLength={300}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground text-right">{message.length}/300</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center space-y-2">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <LinkIcon className="h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg">Connection request sent.</h3>
                        <p className="text-muted-foreground">You’ll be notified once it’s accepted.</p>
                    </div>
                )}

                <DialogFooter className="flex-col !space-x-0 gap-2">
                    {!sent ? (
                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Request
                        </Button>
                    ) : (
                        <Button onClick={handleClose} variant="outline" className="w-full">
                            Close
                        </Button>
                    )}
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        Connections initiated through Starto are platform-facilitated.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
