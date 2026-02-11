import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            Trusted by 500+ institutions
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Gateway to{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Educational Success
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover, apply, and track scholarships from trusted sponsors. 
            Simplify your journey to funding your education with our centralized platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" asChild className="gap-2">
              <Link to="/auth?mode=register">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/scholarships">Browse Scholarships</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">$2.5M+</div>
              <div className="text-sm text-muted-foreground">Scholarships Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">200+</div>
              <div className="text-sm text-muted-foreground">Active Scholarships</div>
            </div>
          </div>
        </div>

        {/* Feature highlights below hero */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: Search,
              title: "Smart Search",
              description: "Find scholarships matching your profile and eligibility",
            },
            {
              icon: CheckCircle2,
              title: "Verified Applications",
              description: "Institutions verify your details for trusted applications",
            },
            {
              icon: Users,
              title: "Direct to Sponsors",
              description: "Connect directly with scholarship providers",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border card-elevated"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
