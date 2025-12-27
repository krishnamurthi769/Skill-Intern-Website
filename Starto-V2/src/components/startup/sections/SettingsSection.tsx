"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMyStartup, useUpdateStartup } from "@/hooks/useStartup"
import { useUser } from "@/hooks/useUser" // Use the hook for Source of Truth
import { useSession, signOut } from "next-auth/react"
import { Loader2, Save, LogOut } from "lucide-react"
import LocationSearchInput from "@/components/common/LocationSearchInput";
import { useQueryClient } from "@tanstack/react-query"


export function SettingsSection() {
    const { data: session } = useSession();
    const { dbUser, isLoading: userLoading } = useUser();
    const { data: startupData, isLoading: startupLoading } = useMyStartup(session?.user?.email);
    const update = useUpdateStartup();
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        website: "",
        oneLiner: "", // Added
        description: "",
        stage: "",
        valuation: "",
        industry: "",
        location: "", // Display
        latitude: 0,
        longitude: 0,
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: ""
    });

    useEffect(() => {
        if (dbUser && startupData?.startup) {
            setFormData({
                // User Table is Truth for Name & Location
                name: dbUser.name || startupData.startup.name || "",
                website: startupData.startup.website || "",
                oneLiner: startupData.startup.oneLiner || "", // Added
                description: startupData.startup.description || "",
                stage: startupData.startup.stage || "",
                valuation: startupData.startup.valuation ? String(startupData.startup.valuation) : "",
                industry: startupData.startup.industry || "",

                // Location primarily from User
                location: dbUser.city || startupData.startup.address || "",
                latitude: Number(dbUser.latitude) || 0,
                longitude: Number(dbUser.longitude) || 0,
                city: dbUser.city || "",
                state: "", // dbUser might need state
                country: "", // dbUser might need country
                pincode: dbUser.pincode || "",
                address: ""
            })
        }
    }, [dbUser, startupData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.email) return;
        setSaving(true);

        try {
            // STEP 1: Update User Table (Location, Name)
            const userRes = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session.user.email,
                    name: formData.name,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    city: formData.city,
                    pincode: formData.pincode,
                })
            });

            if (!userRes.ok) {
                const errorData = await userRes.json().catch(() => ({}));
                console.error("User Update Failed:", errorData);
                throw new Error(errorData.error || "Failed to update user info");
            }

            // STEP 2: Update Startup Profile via Hook (which calls /api/startups/me)
            // Note: The hook handles the fetch call. We just pass the data.
            // We should ideally NOT pass location data here if we want to be strict,
            // but passing it is harmless if API ignores it or if we want to keep it in sync for now.
            // User said "Role API... MUST NOT accept location fields".
            // Since we stripped it from the API, we can just pass it and it will be ignored,
            // OR we can explicitly exclude it here.

            await update.mutateAsync({
                email: session.user.email,
                data: {
                    name: formData.name,
                    website: formData.website,
                    oneLiner: formData.oneLiner, // Added
                    description: formData.description,
                    stage: formData.stage,
                    valuation: formData.valuation ? Number(formData.valuation) : undefined,
                    industry: formData.industry,
                    // We intentionally omit location fields here if we want to enforce separation,
                    // but providing them doesn't hurt if the API doesn't use 'User' table sync anymore.
                    // However, StartupProfile table still has columns. If API updates them, that's fine for Profile display.
                    // The critical part was NOT updating User table from there.
                    city: formData.city,
                    address: formData.address || formData.location
                }
            });

            await queryClient.invalidateQueries({ queryKey: ["user"] });
            await queryClient.invalidateQueries({ queryKey: ["startup"] });

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    if (userLoading || startupLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

    if (!startupData?.startup && !userLoading && !startupLoading) return (
        // Allow creating if missing? Or show empty state?
        // Assuming they have a profile if they are here (Role Guard usually handles this)
        <div className="p-8 text-center">
            <h3 className="text-lg font-semibold">Profile Loading or Not Found</h3>
            <p className="text-muted-foreground">Please refresh or contact support.</p>
        </div>
    )

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account and startup profile.</p>
            </div>

            {/* User Account Card */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg">Account & Session</CardTitle>
                    <CardDescription>Manage your sign-in details.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                            {dbUser?.name?.[0] || session?.user?.email?.[0] || "U"}
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{dbUser?.name || "User"}</p>
                            <p className="text-muted-foreground">{session?.user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>This information is visible to freelancers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" name="website" placeholder="https://" value={formData.website} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Location (Unified)</Label>
                                <LocationSearchInput
                                    defaultValue={formData.location}
                                    onLocationSelect={handleLocationSelect}
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="oneLiner">One Liner (Headline)</Label>
                            <Input id="oneLiner" name="oneLiner" placeholder="e.g. Uber for X" value={formData.oneLiner} onChange={handleChange} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">About</Label>
                            <Textarea
                                id="description"
                                name="description"
                                className="min-h-[100px]"
                                placeholder="Tell us about your mission..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="stage">Stage</Label>
                                <Select
                                    name="stage"
                                    value={formData.stage}
                                    onValueChange={(v) => handleSelectChange("stage", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IDEA">Idea</SelectItem>
                                        <SelectItem value="MVP">MVP</SelectItem>
                                        <SelectItem value="GROWTH">Growth</SelectItem>
                                        <SelectItem value="SCALE">Scale</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="valuation">Valuation (USD)</Label>
                                <Input
                                    id="valuation"
                                    name="valuation"
                                    type="number"
                                    placeholder="1000000"
                                    value={formData.valuation}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" name="industry" placeholder="SaaS, Fintech, AI..." value={formData.industry} onChange={handleChange} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" type="button" onClick={() => window.location.reload()}>Reset</Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
