"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Globe, PenTool, Figma, Code, Mail } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function FreelancerProfileSection() {
    const { dbUser, isLoading } = useUser();
    const router = useRouter();

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
    }

    const profile = dbUser?.freelancerProfile || {};
    const skills = profile.skills || [];

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header / Banner */}
            <div className="relative h-48 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-muted/50 overflow-hidden">
                <div className="absolute bottom-4 right-4">
                    <Button variant="outline" className="bg-background/80 backdrop-blur-sm">Edit Cover</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 -mt-16 px-4">
                {/* Left Sidebar (Profile Info) */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="shadow-lg border-muted/60">
                        <CardContent className="pt-6 text-center">
                            <div className="relative inline-block">
                                <Avatar className="h-32 w-32 border-4 border-background mx-auto">
                                    <AvatarImage src={dbUser?.image || "/avatars/01.png"} />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">{dbUser?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-background" title="Available for work"></div>
                            </div>

                            <h2 className="text-2xl font-bold mt-4">{dbUser?.name || "Your Name"}</h2>
                            <p className="text-muted-foreground font-medium">{profile.headline || "Add a headline"}</p>

                            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" /> {dbUser?.city || "City"}, {dbUser?.country || "Country"}
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <Button onClick={() => router.push('/dashboard?section=settings')}>Edit Profile</Button>
                                <Button variant="outline">Preview Public View</Button>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4 text-left">
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Hourly Rate</Label>
                                    <div className="font-semibold text-lg">₹ {profile.hourlyRate || "0"} <span className="text-sm font-normal text-muted-foreground">/ hr</span></div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Availability</Label>
                                    <div className="font-semibold">{profile.availability || "Full Time"}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Languages</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <Badge variant="secondary">English</Badge>
                                        <Badge variant="secondary">Hindi</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {skills.length > 0 ? skills.map((skill: string) => (
                                    <Badge key={skill} variant="outline"><Code className="mr-1 h-3 w-3" /> {skill}</Badge>
                                )) : (
                                    <span className="text-sm text-muted-foreground">No skills added yet.</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content (Bio & Portfolio) */}
                <div className="md:col-span-8 space-y-6 mt-12 md:mt-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {profile.bio || "Write something about yourself in settings..."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Portfolio</CardTitle>
                            <Button variant="outline" size="sm">Add Project</Button>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            {/* Static Portfolio Items (Can be made dynamic later) */}
                            <div className="group border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer">
                                <div className="h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                    <Globe className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold group-hover:text-primary transition-colors">Starto Project</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        A sample project (Add your own soon)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Work History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-muted-foreground text-sm">No work history added.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Briefcase({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}
