"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMyStartup, useUpdateStartup } from "@/hooks/useStartup"
import { auth } from "@/lib/firebase"
import { Loader2, Save } from "lucide-react"
import LocationSearchInput from "@/components/common/LocationSearchInput";


export function SettingsSection() {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => setUser(u));
        return () => unsub();
    }, []);

    const { data, isLoading } = useMyStartup(user?.email);
    const update = useUpdateStartup();

    const [formData, setFormData] = useState({
        name: "",
        website: "",
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
        if (data?.startup) {
            setFormData({
                name: data.startup.name || "",
                website: data.startup.website || "",
                description: data.startup.description || "",
                stage: data.startup.stage || "Pre-Seed",
                valuation: data.startup.valuation ? String(data.startup.valuation) : "",
                industry: data.startup.industry || "Technology",
                location: data.startup.address || data.startup.location || "Remote",
                latitude: data.startup.latitude || 0,
                longitude: data.startup.longitude || 0,
                city: data.startup.city || "",
                state: data.startup.state || "",
                country: data.startup.country || "",
                pincode: data.startup.pincode || "",
                address: data.startup.address || ""
            })
        }
    }, [data]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email) return;

        update.mutate({
            email: user.email,
            data: {
                ...formData,
                valuation: formData.valuation ? Number(formData.valuation) : undefined
            }
        });
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

    if (!data?.startup && !isLoading) return (
        <div className="p-8 text-center">
            <h3 className="text-lg font-semibold">Startup Profile Not Found</h3>
            <p className="text-muted-foreground">Please contact support or try again.</p>
        </div>
    )

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Startup Profile</h2>
                <p className="text-muted-foreground">Manage your company details and public presence.</p>
            </div>

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
                                <Label>Location</Label>
                                <LocationSearchInput
                                    defaultValue={formData.location}
                                    onLocationSelect={handleLocationSelect}
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
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
                                        <SelectItem value="Idea">Idea Phase</SelectItem>
                                        <SelectItem value="MVP">MVP</SelectItem>
                                        <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                                        <SelectItem value="Seed">Seed</SelectItem>
                                        <SelectItem value="Series A">Series A</SelectItem>
                                        <SelectItem value="Series B+">Series B+</SelectItem>
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
                        <Button type="submit" disabled={update.isPending}>
                            {update.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
