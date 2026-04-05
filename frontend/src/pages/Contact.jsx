import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
const Contact = () => {
  const handleSubmit = e => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    // Implement actual contact form logic here
  };
  return <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="container max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Have questions about a scholarship or need help with your application?
                            Our team is here to assist you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <Mail className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Email Us</h3>
                                            <p className="text-sm text-muted-foreground mb-2">For general inquiries</p>
                                            <a href="mailto:support@scholarhub.com" className="text-primary hover:underline">
                                                support@scholarhub.com
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <Phone className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Call Us</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Mon-Fri from 8am to 5pm</p>
                                            <a href="tel:+15551234567" className="text-primary hover:underline">
                                                +1 (555) 123-4567
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Our Office</h3>
                                            <p className="text-sm text-muted-foreground">
                                                123 Innovation Drive<br />
                                                Tech City, TC 90210
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a specific message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First name</Label>
                                                <Input id="firstName" placeholder="John" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last name</Label>
                                                <Input id="lastName" placeholder="Doe" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="How can we help?" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px]" required />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>;
};
export default Contact;