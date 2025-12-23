"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Bell, CreditCard, Lock, User, Shield } from "lucide-react"

export function FreelancerSettingsSection() {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences and payments.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">General</TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Billing & Payouts</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Security</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details visible to clients.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="Manish" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Kumar" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" defaultValue="manish@example.com" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Professional Title</Label>
                                    <Input id="title" defaultValue="Senior Full Stack Developer" />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t px-6 py-4">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Billing Settings */}
                    <TabsContent value="billing" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payout Methods</CardTitle>
                                <CardDescription>Manage how you get paid.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between border p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded">
                                            <CreditCard className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Bank Transfer (HDFC)</div>
                                            <div className="text-sm text-muted-foreground">Ends in **** 8892</div>
                                        </div>
                                    </div>
                                    <Badge>Default</Badge>
                                </div>
                                <div className="flex items-center justify-between border p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                            <Shield className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">PayPal</div>
                                            <div className="text-sm text-muted-foreground">manish@example.com</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">Remove</Button>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t px-6 py-4">
                                <Button variant="outline">Add Payout Method</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tax Information</CardTitle>
                                <CardDescription>Manage your GST and PAN details for invoices.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>PAN Number</Label>
                                        <Input placeholder="ABCDE1234F" defaultValue="ABCDE1234F" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>GSTIN (Optional)</Label>
                                        <Input placeholder="22AAAAA0000A1Z5" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t px-6 py-4">
                                <Button>Save Tax Info</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Notifications Settings */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Preferences</CardTitle>
                                <CardDescription>Choose what updates you want to receive.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Job Invitations</Label>
                                        <p className="text-muted-foreground text-sm">Receive emails when clients invite you to jobs.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Message Notifications</Label>
                                        <p className="text-muted-foreground text-sm">Receive emails for new messages.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Marketing Emails</Label>
                                        <p className="text-muted-foreground text-sm">Receive news and feature updates.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
