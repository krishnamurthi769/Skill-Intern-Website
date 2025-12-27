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
import { Upload, Briefcase, Bell, Shield, Wallet, Save, Loader2 } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { useQueryClient } from "@tanstack/react-query";

import LocationSearchInput from "@/components/common/LocationSearchInput";

export function InvestorSettingsSection() {
    const { data: session } = useSession();
    const { dbUser, isLoading } = useUser();
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        firmName: "",
        website: "",
        bio: "",
        ticketSize: "",
        sectors: "",
        location: "",
        latitude: 0,
        longitude: 0,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: ""
    });

    useEffect(() => {
        if (dbUser?.investorProfile) {
            setFormData({
                firmName: dbUser.name || "",
                website: "",
                bio: dbUser.investorProfile.thesisNote || "",
                ticketSize: "",
                sectors: (dbUser.investorProfile.sectors || []).join(", "),
                location: dbUser.city || "",
                latitude: Number(dbUser.latitude) || 0,
                longitude: Number(dbUser.longitude) || 0,
                city: dbUser.city || "",
                state: "",
                country: "",
                pincode: dbUser.pincode || "",
                address: ""
            });
        }
    }, [dbUser]);

    const handleLocationSelect = (loc: any) => {
        setFormData(prev => ({
            ...prev,
            location: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
            city: loc.city,
            state: loc.state,
            country: loc.country,
            pincode: loc.pincode,
            address: loc.address
        }));
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            // STEP 1: Update User Table (Location, Name)
            const userUpdateRes = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    name: formData.firmName, // Assuming Firm Name is the User Name for investors? Or just Profile name?
                    // Previously we mapped Firm Name to Name. Let's keep that pattern.
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    city: formData.city,
                    pincode: formData.pincode,
                })
            });

            if (!userUpdateRes.ok) throw new Error("Failed to update user info");

            // STEP 2: Update Profile
            const profileRes = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    role: "investor",
                    data: {
                        name: formData.firmName,
                        thesisNote: formData.bio,
                        sectors: formData.sectors.split(",").map(s => s.trim()).filter(Boolean),
                        // Profile specific location fields
                        city: formData.city,
                        address: formData.address || formData.location
                    }
                })
            });
            if (!profileRes.ok) throw new Error("Failed to save profile");

            await queryClient.invalidateQueries({ queryKey: ["user"] });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

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
                                    <Label htmlFor="firmName">Name / Firm Name</Label>
                                    <Input
                                        id="firmName"
                                        value={formData.firmName}
                                        onChange={e => setFormData({ ...formData, firmName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website / LinkedIn</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://..."
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Base Location</Label>
                                <LocationSearchInput
                                    defaultValue={formData.location}
                                    onLocationSelect={handleLocationSelect}
                                    placeholder="e.g. Mumbai, India"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Investment Bio / Thesis</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[100px]"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us what you look for in startups..."
                                />
                            </div>

                            <Separator className="my-2" />

                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Thesis & Preferences</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sectors (Comma separated)</Label>
                                        <Input
                                            value={formData.sectors}
                                            onChange={e => setFormData({ ...formData, sectors: e.target.value })}
                                            placeholder="AI, SaaS, Fintech"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Profile
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
