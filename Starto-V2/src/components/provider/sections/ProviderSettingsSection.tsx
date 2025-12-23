"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, Bell, Shield, Wallet } from "lucide-react"

export function ProviderSettingsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Provider Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your detailed workspace profile, payout preferences, and account security.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Profile & Space Info</TabsTrigger>
                    <TabsTrigger value="payouts">Payouts & Billing</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* GENERAL SETTINGS */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workspace Profile</CardTitle>
                            <CardDescription>
                                This information will be displayed on your listing pages.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="spaceName">Workspace Name / Brand</Label>
                                    <Input id="spaceName" defaultValue="Neon Startups Co-working" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website URL</Label>
                                    <Input id="website" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">About the Space</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-[100px]"
                                    defaultValue="Premium coworking space located in the heart of Bangalore's startup hub. High-speed wifi, meeting rooms, and coffee on tap."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amenities">Core Amenities (Comma separated)</Label>
                                <Input id="amenities" defaultValue="High-Speed WiFi, Conference Rooms, Coffee Bar, 24/7 Access, Printer" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* PAYOUT SETTINGS */}
                <TabsContent value="payouts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payout Methods</CardTitle>
                            <CardDescription>
                                Configure how you want to receive payments from tenants.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Method */}
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">HDFC Bank •••• 4242</div>
                                        <div className="text-sm text-muted-foreground">Primary Payout Method</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Verified</Badge>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Add New Method</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="accountName">Account Holder Name</Label>
                                        <Input id="accountName" placeholder="As per bank records" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ifsc">IFSC Code</Label>
                                        <Input id="ifsc" placeholder="HDFC000..." />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="accountNumber">Account Number</Label>
                                        <Input id="accountNumber" type="password" placeholder="•••• •••• ••••" />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">
                                    <Wallet className="mr-2 h-4 w-4" /> Add Bank Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alert Preferences</CardTitle>
                            <CardDescription>
                                Choose what you want to be notified about.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Booking Requests</Label>
                                    <div className="text-sm text-muted-foreground">Receive emails when someone requests a booking.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Visit Scheduling</Label>
                                    <div className="text-sm text-muted-foreground">Notifications for new site visit appointments.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Marketing Emails</Label>
                                    <div className="text-sm text-muted-foreground">Receive tips on improving your listing.</div>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
