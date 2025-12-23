"use client"

import React, { useState } from "react"
import { useCreateProposal } from "@/hooks/useProposals"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface ProposalDialogProps {
    taskId: string;
    taskTitle: string;
    trigger?: React.ReactNode;
}

export function ProposalDialog({ taskId, taskTitle, trigger }: ProposalDialogProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [coverLetter, setCoverLetter] = useState("")
    const create = useCreateProposal()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !coverLetter) return

        try {
            await create.mutateAsync({
                taskId,
                amount: Number(amount),
                coverLetter
            })
            setOpen(false)
            setAmount("")
            setCoverLetter("")
        } catch (err) {
            // handled by hook
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Apply Now</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Submit Proposal</DialogTitle>
                    <DialogDescription>
                        Applying for: <span className="font-semibold text-foreground">{taskTitle}</span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bid-amount" className="text-right">
                                Bid Amount ($)
                            </Label>
                            <Input
                                id="bid-amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="cover-letter" className="text-right pt-2">
                                Cover Letter
                            </Label>
                            <Textarea
                                id="cover-letter"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                className="col-span-3 min-h-[150px]"
                                required
                                placeholder="Why are you the best fit for this job?"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={create.isPending}>
                            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Proposal
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
