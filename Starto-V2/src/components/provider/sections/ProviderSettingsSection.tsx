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
import { Building2, CreditCard, Bell, Shield, Wallet, Save, Loader2 } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { useQueryClient } from "@tanstack/react-query";

import LocationSearchInput from "@/components/common/LocationSearchInput";

export function ProviderSettingsSection() {
    const { data: session } = useSession();
    const { dbUser, isLoading } = useUser();
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        spaceName: "",
        website: "",
        description: "",
        amenities: "",
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
        if (dbUser?.providerProfile) {
            setFormData({
                spaceName: dbUser.providerProfile.companyName || "",
                website: "",
                description: dbUser.providerProfile.description || "",
                amenities: "",
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
            // STEP 1: Update User Table
            const userUpdateRes = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    // Provider 'spaceName' might NOT be the User Name? 
                    // Usually Provider user name is personal name.
                    // But here we only have spaceName in form. 
                    // Let's check Onboarding Form. ProviderForm has 'name' AND 'companyName'.
                    // ProviderSettingsSection only has 'spaceName' (mapped to companyName).
                    // So we probably shouldn't update User Name here unless we add a Name field.
                    // BUT for Location, we definitely update User.
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
                    role: "provider",
                    data: {
                        companyName: formData.spaceName,
                        description: formData.description,
                        // Profile location
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
                <h3 className="text-2xl font-bold tracking-tight">Provider Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your detailed workspace profile, payout preferences, and account security.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Profile & Space Info</TabsTrigger>
                    {/* Hiding Mock Tabs */}
                    {/* <TabsTrigger value="payouts">Payouts & Billing</TabsTrigger> */}
                    {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
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
                                    <Input
                                        id="spaceName"
                                        value={formData.spaceName}
                                        onChange={e => setFormData({ ...formData, spaceName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website URL</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://..."
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Space Location</Label>
                                <LocationSearchInput
                                    defaultValue={formData.location}
                                    onLocationSelect={handleLocationSelect}
                                    placeholder="e.g. Indiranagar, Bangalore"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">About the Space</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your space..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amenities">Core Amenities (Comma separated)</Label>
                                <Input
                                    id="amenities"
                                    value={formData.amenities}
                                    onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                                    placeholder="Wifi, Coffee, etc."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
