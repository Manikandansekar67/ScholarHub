import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Users, Globe, Shield } from "lucide-react";
const About = () => {
  return <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container text-center max-w-3xl">
                        <h1 className="text-4xl font-bold mb-6">Empowering Students Worldwide</h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            ScholarHub bridges the gap between ambitious students and the financial support they need to achieve their dreams.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20">
                    <div className="container">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    We believe that education should be accessible to everyone, regardless of their financial background.
                                    Our mission is to democratize access to scholarships by creating a transparent, efficient, and
                                    user-friendly platform that connects deserving students with generous sponsors.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold">For Students</h3>
                                        <p className="text-sm text-muted-foreground">Easy access to diverse funding opportunities.</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold">For Sponsors</h3>
                                        <p className="text-sm text-muted-foreground">Streamlined management of scholarship programs.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted rounded-2xl p-8 h-80 flex items-center justify-center">
                                {/* Placeholder for an image */}
                                <GraduationCap className="h-32 w-32 text-muted-foreground/20" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-20 bg-primary/5">
                    <div className="container">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl font-bold text-primary mb-2">$10M+</p>
                                <p className="text-sm text-muted-foreground">Scholarships Awarded</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-primary mb-2">50k+</p>
                                <p className="text-sm text-muted-foreground">Students Helped</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                                <p className="text-sm text-muted-foreground">Partner Sponsors</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-primary mb-2">100%</p>
                                <p className="text-sm text-muted-foreground">Transparent</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>;
};
export default About;