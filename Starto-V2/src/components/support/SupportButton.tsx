"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Loader2, Bug, Lightbulb, Lock, MessageSquare } from "lucide-react"

export function SupportButton() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState("Bug Report")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message }),
            })

            if (!res.ok) throw new Error("Failed to send request")

            setSuccess(true)
            setTimeout(() => {
                setOpen(false)
                setSuccess(false)
                setMessage("")
                setSubject("Bug Report")
            }, 2000)
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Need Help?
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-full max-w-[calc(100%-2rem)] mx-auto rounded-lg">
                <DialogHeader>
                    <DialogTitle>Talk to Starto (Beta Support)</DialogTitle>
                    <DialogDescription>
                        This is a beta product. Your feedback helps us build better.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 text-green-600">
                        <p className="font-semibold">Request Sent!</p>
                        <p className="text-sm text-muted-foreground">Thanks for being a co-builder.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subject (Beta)</Label>
                            <Select value={subject} onValueChange={setSubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bug Report">
                                        <div className="flex items-center gap-2">
                                            <Bug className="h-4 w-4 text-primary" />
                                            <span>Bug / Something not working</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Confusion">
                                        <div className="flex items-center gap-2">
                                            <HelpCircle className="h-4 w-4 text-primary" />
                                            <span>Confusing / Don’t understand</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Feature Suggestion">
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-primary" />
                                            <span>Feature suggestion (Beta)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Account Issue">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-primary" />
                                            <span>Account / Login issue</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Beta Feedback">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-primary" />
                                            <span>Beta feedback (overall)</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Describe your issue or idea..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                maxLength={2000}
                                className="h-32 resize-none"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
