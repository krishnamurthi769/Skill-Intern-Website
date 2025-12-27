"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    Plus,
    MapPin,
    Ruler,
    DollarSign,
    ArrowLeft,
    Upload,
    Loader2,
    CheckCircle2,
    Filter,
    ArrowUpFromLine
} from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense } from "react";

function PropertiesList() {
    const router = useRouter()
    // In a real implementation, we would just read the search params to decide view
    // But for a true SPA feel inside the section, we can use local state OR params
    // Let's use local state for "Add Mode" to prevent full page reloads/url flicker if preferred,
    // OR just use the 'action' param as requested. The prompt said "Clicking items updates searchParams".
    const searchParams = useSearchParams()
    const action = searchParams.get("action")

    if (action === "new") {
        return <AddPropertyForm onCancel={() => router.push("/provider?section=properties")} />
    }

    // Mock List
    const properties = [
        {
            id: "1",
            title: "Downtown Tech Hub",
            address: "123 Innovation Dr, San Francisco, CA",
            type: "Office",
            size: 1500,
            price: 4500,
            status: "Available",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
        },
        {
            id: "2",
            title: "Creative Studio Loft",
            address: "45 Art District, Brooklyn, NY",
            type: "Studio",
            size: 800,
            price: 2200,
            status: "Occupied",
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000"
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your listed spaces and view their performance.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button onClick={() => router.push("/provider?section=properties&action=new")}>
                        <Plus className="mr-2 h-4 w-4" /> Add Property
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="relative h-48 w-full">
                            <img
                                src={property.image}
                                alt={property.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-2 right-2 bg-white/90 text-black hover:bg-white shadow-sm">
                                {property.status}
                            </Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">{property.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {property.address}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                <div className="flex items-center">
                                    <Ruler className="h-4 w-4 mr-1 text-primary" />
                                    {property.size} sqft
                                </div>
                                <div className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-1 text-primary" />
                                    {property.type}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center text-lg font-bold text-foreground">
                                    <DollarSign className="h-4 w-4 mr-0.5" />
                                    {property.price}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                                </div>
                                <Button variant="ghost" size="sm" className="hover:text-primary">
                                    Manage
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export function PropertiesSection() {
    return (
        <Suspense fallback={<div>Loading properties...</div>}>
            <PropertiesList />
        </Suspense>
    )
}

function AddPropertyForm({ onCancel }: { onCancel: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Form state (simplified)
    const [formData, setFormData] = useState({
        title: "", category: "", sizeSqFt: "", priceMonthly: "", address: "", description: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsSuccess(true)
            setTimeout(onCancel, 1500)
        }, 1500)
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Property Listed Successfully!</h3>
                <p className="text-muted-foreground mt-2">Returning to property list...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Button variant="ghost" size="sm" onClick={onCancel} className="mb-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">List a New Property</h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                    <CardDescription>Provide the key information about your space.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Property Title</Label>
                            <Input id="title" placeholder="e.g. Modern Tech Hub Downtown" required
                                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="office">Office Space</SelectItem>
                                        <SelectItem value="retail">Retail / Showroom</SelectItem>
                                        <SelectItem value="studio">Creative Studio</SelectItem>
                                        <SelectItem value="industrial">Industrial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="size">Size (sqft)</Label>
                                <Input id="size" type="number" placeholder="1500" required
                                    value={formData.sizeSqFt} onChange={(e) => setFormData({ ...formData, sizeSqFt: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Monthly Rent ($)</Label>
                            <Input id="price" type="number" placeholder="4500" required className="pl-6"
                                value={formData.priceMonthly} onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input id="address" placeholder="123 Innovation Dr, Tech City, CA" required
                                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe the amenities..." className="h-32" required
                                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div className="flex justify-end pt-4 gap-2">
                            <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                List Property
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
