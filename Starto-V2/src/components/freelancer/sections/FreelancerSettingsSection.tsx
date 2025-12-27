"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Bell, CreditCard, Lock, User, Shield, Save, Loader2 } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { useQueryClient } from "@tanstack/react-query";

import LocationSearchInput from "@/components/common/LocationSearchInput";

export function FreelancerSettingsSection() {
    const { data: session } = useSession();
    const { dbUser, isLoading } = useUser();
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        title: "",
        location: "", // Display string
        latitude: 0,
        longitude: 0,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: ""
    });

    useEffect(() => {
        if (dbUser) {
            const names = (dbUser.name || "").split(" ");
            const fName = names[0] || "";
            const lName = names.slice(1).join(" ") || "";

            setFormData({
                firstName: fName,
                lastName: lName,
                title: dbUser.freelancerProfile?.headline || "",
                location: dbUser.city || "", // Simple display for now, ideally full address
                latitude: Number(dbUser.latitude) || 0,
                longitude: Number(dbUser.longitude) || 0,
                city: dbUser.city || "",
                state: "", // dbUser might not have state/country in top level yet based on schema inspection, but let's prep
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
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    city: formData.city,
                    pincode: formData.pincode,
                    // We can add state/country/address if state supports it
                })
            });

            if (!userUpdateRes.ok) {
                const errorData = await userUpdateRes.json().catch(() => ({}));
                console.error("User Update Failed:", errorData);
                throw new Error(errorData.error || "Failed to update user info");
            }

            // STEP 2: Update Profile (Headline, etc)
            const profileRes = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    role: "freelancer",
                    data: {
                        // Profile specific fields
                        headline: formData.title,
                        // Redundant but harmless if API ignores, or needed if profile has display fields
                        // User said Role API must NOT touch User table. 
                        // But Profile might have its own 'city' col. 
                        // Let's send it just in case Profile needs it for display, 
                        // knowing it Won't touch User table anymore.
                        city: formData.city,
                        address: formData.address || formData.location
                    }
                })
            });
            if (!profileRes.ok) {
                const errorData = await profileRes.json().catch(() => ({}));
                console.error("Profile Save Failed:", errorData);
                throw new Error(errorData.error || "Failed to save profile");
            }

            await queryClient.invalidateQueries({ queryKey: ["user"] });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences and location.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                    <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">General</TabsTrigger>
                    {/* Hiding other tabs until real implementation to strict "Real Data Only" rule */}
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
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <LocationSearchInput
                                        defaultValue={formData.location}
                                        onLocationSelect={handleLocationSelect}
                                        placeholder="e.g. Bangalore, India"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" value={dbUser?.email || session?.user?.email || ""} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Professional Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Senior Developer"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t px-6 py-4">
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
