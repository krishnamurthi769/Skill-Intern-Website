"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Briefcase, Bell, Shield, Wallet } from "lucide-react"

export function InvestorSettingsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Investor Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your investment profile, preferences, and account security.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile & Thesis</TabsTrigger>
                    <TabsTrigger value="kyc">KYC & Compliance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* PROFILE SETTINGS */}
                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Investment Profile</CardTitle>
                            <CardDescription>
                                This information helps Startups understand your investment focus.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firmName">Firm / Angel Name</Label>
                                    <Input id="firmName" defaultValue="Horizon Ventures" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website / LinkedIn</Label>
                                    <Input id="website" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Investment Bio</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[100px]"
                                    defaultValue="Early-stage investor focused on AI, SaaS, and FinTech in the Indian market. Hands-on mentor for technical founders."
                                />
                            </div>

                            <Separator className="my-2" />

                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Thesis & Preferences</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Preferred Stage</Label>
                                        <Select defaultValue="seed">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                                                <SelectItem value="seed">Seed</SelectItem>
                                                <SelectItem value="seriesA">Series A</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ticket Size (Range)</Label>
                                        <Input placeholder="e.g. ₹ 20L - ₹ 2Cr" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sectors (Comma separated)</Label>
                                        <Input defaultValue="AI, FinTech, SaaS" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Profile</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* KYC & COMPLIANCE */}
                <TabsContent value="kyc" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>KYC & Accreditation</CardTitle>
                            <CardDescription>
                                Verify your accredited investor status.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Accreditation Status</div>
                                        <div className="text-sm text-green-600">Verified • Valid until Dec 2025</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-green-200 text-green-700 bg-green-50">
                                    View Certificate
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <h4 className="text-sm font-medium">Documents</h4>
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm">PAN Card</span>
                                    </div>
                                    <Badge variant="secondary">Verified</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm">Aadhar / ID Proof</span>
                                    </div>
                                    <Badge variant="secondary">Verified</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deal Flow Alerts</CardTitle>
                            <CardDescription>
                                Configure how you receive new startup pitches.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">New Match Alerts</Label>
                                    <div className="text-sm text-muted-foreground">Instant email when a high-fit startup joins.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-base">Portfolio Updates</Label>
                                    <div className="text-sm text-muted-foreground">Receive weekly digests from your portfolio companies.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
