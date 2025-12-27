// Enhanced UI Version
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Link as LinkIcon, Send, Rocket } from "lucide-react"

import { auth } from "@/lib/firebase"

interface ConnectionRequestModalProps {
    receiverId: string
    receiverName: string
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
                    fromFirebaseUid: currentUser.uid
                })
            })

            if (!res.ok) {
                const errorText = await res.text();
                if (res.status === 409) {
                    toast.error("Request already sent to this user")
                    setSent(true)
                } else {
                    toast.error(errorText || "Failed to send request")
                }
                setLoading(false)
                return
            }

            setSent(true)
            toast.success("Connection request sent.")
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
            setLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        if (sent) {
            setName("")
            setMessage("")
            setSent(false)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                {/* Gradient Header */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 border-b">
                    <DialogHeader className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-inner">
                            <Rocket className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center space-y-1">
                            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Connect with {receiverName}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Expand your network and verify your connection request.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {!sent ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Your Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Full Name"
                                        className="bg-muted/30 focus:bg-background transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-xs font-semibold uppercase text-muted-foreground">Your Role</Label>
                                    <Select onValueChange={setRole} value={role}>
                                        <SelectTrigger className="bg-muted/30 focus:bg-background transition-colors">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Founder">Founder</SelectItem>
                                            <SelectItem value="Freelancer">Freelancer</SelectItem>
                                            <SelectItem value="Investor">Investor</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purpose" className="text-xs font-semibold uppercase text-muted-foreground">Purpose</Label>
                                <Select onValueChange={setPurpose} value={purpose}>
                                    <SelectTrigger className="bg-muted/30 focus:bg-background transition-colors">
                                        <SelectValue placeholder="Reason for connecting?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hiring">Hiring / Talent</SelectItem>
                                        <SelectItem value="Investment">Fundraising</SelectItem>
                                        <SelectItem value="Workspace">Workspace Inquiry</SelectItem>
                                        <SelectItem value="Mentorship">Mentorship</SelectItem>
                                        <SelectItem value="Partnership">Partnership</SelectItem>
                                        <SelectItem value="Other">Networking</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs font-semibold uppercase text-muted-foreground">Message</Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hi, I noticed your profile and..."
                                    maxLength={300}
                                    className="resize-none bg-muted/30 focus:bg-background transition-colors h-24"
                                />
                                <p className="text-[10px] text-right text-muted-foreground">{message.length}/300</p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <LinkIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-foreground">Request Sent!</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    We've notified {receiverName}. You'll receive an alert when they accept.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse gap-3 items-center border-t bg-muted/10">
                    {!sent ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px] shadow-lg shadow-primary/20"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Request
                        </Button>
                    ) : (
                        <Button onClick={handleClose} variant="outline" className="w-full">
                            Close
                        </Button>
                    )}
                    {!sent && (
                        <Button variant="ghost" onClick={handleClose} disabled={loading} className="text-muted-foreground hover:text-foreground">
                            Cancel
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
