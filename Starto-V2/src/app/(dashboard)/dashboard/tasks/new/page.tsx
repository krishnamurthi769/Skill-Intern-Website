"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

export default function CreateTaskPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Post a New Task</h1>
                    <p className="text-muted-foreground text-sm">Create a job posting to find the perfect freelancer.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Task Details</CardTitle>
                        <CardDescription>
                            Describe clearly what you need to be done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" placeholder="e.g. Build a React Dashboard for Fintech App" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Provide detailed requirements, deliverables, and any technical constraints..."
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dev">Development</SelectItem>
                                        <SelectItem value="design">Design</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                        <SelectItem value="content">Content Writing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Estimated Budget (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input className="pl-8" placeholder="50,000" type="number" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills & Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Required Skills</Label>
                            <Input placeholder="Type a skill and press enter (e.g. React, Node.js)" />
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    React <span className="cursor-pointer ml-1 hover:text-red-500">×</span>
                                </div>
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    Tailwind CSS <span className="cursor-pointer ml-1 hover:text-red-500">×</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Publish Task
                    </Button>
                </div>
            </div>
        </div>
    )
}
