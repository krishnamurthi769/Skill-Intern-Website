"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Twitter, Linkedin, Github } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function ContactForm() {
    return (
        <section className="py-12 bg-muted/30 relative">
            <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                            <p className="text-muted-foreground text-lg mb-8">
                                Fill up the form and our Team will get back to you within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Email us</h4>
                                    <p className="text-muted-foreground">krishnaurthikm07@gmail.com</p>
                                    <p className="text-muted-foreground">support@starto.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Call us</h4>
                                    <p className="text-muted-foreground">+91 80885 00769</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Location</h4>
                                    <p className="text-muted-foreground max-w-xs">
                                        India
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h4 className="text-lg font-semibold mb-4">Follow us</h4>
                            <div className="flex gap-4">
                                <Link href="#" className="p-2 rounded-full bg-background border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                </Link>
                                <Link href="#" className="p-2 rounded-full bg-background border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                </Link>
                                <Link href="#" className="p-2 rounded-full bg-background border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                                    <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
                            <CardContent className="p-8">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="first-name" className="text-sm font-medium">First Name</label>
                                            <Input id="first-name" placeholder="Krishna" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="last-name" className="text-sm font-medium">Last Name</label>
                                            <Input id="last-name" placeholder="Murthi" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                                        <Input id="email" type="email" placeholder="krishnaurthikm07@gmail.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                        <Input id="subject" placeholder="How can we help?" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your project..."
                                            className="min-h-[150px]"
                                        />
                                    </div>

                                    <Button className="w-full h-12 text-lg">SendMessage</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
