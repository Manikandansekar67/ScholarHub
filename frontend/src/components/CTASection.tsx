import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Students CTA */}
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 hero-gradient">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 mb-6">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                For Students
              </h3>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Start your journey to educational success. Browse hundreds of scholarships 
                and apply with our streamlined process.
              </p>
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link to="/auth?mode=register&role=student">
                  Start Applying
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Sponsors CTA */}
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-card border border-border">
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 mb-6">
                <Building2 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                For Sponsors
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Make a difference in students' lives. Create scholarship programs 
                and reach verified, qualified candidates.
              </p>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link to="/auth?mode=register&role=sponsor">
                  Become a Sponsor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
