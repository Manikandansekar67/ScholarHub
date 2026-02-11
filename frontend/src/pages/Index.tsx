import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import ScholarshipCard, { Scholarship } from "@/components/ScholarshipCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Sample featured scholarships
const featuredScholarships: Scholarship[] = [
  {
    id: "1",
    title: "STEM Excellence Award",
    sponsor: "TechCorp Foundation",
    amount: 15000,
    deadline: "2025-04-15",
    eligibility: ["Undergraduate students", "STEM major required", "GPA 3.5+"],
    category: "STEM",
    description: "Supporting the next generation of innovators in science, technology, engineering, and mathematics.",
    status: "open",
  },
  {
    id: "2",
    title: "Future Leaders Scholarship",
    sponsor: "Global Education Fund",
    amount: 10000,
    deadline: "2025-03-30",
    eligibility: ["All majors", "Leadership experience", "Community involvement"],
    category: "Leadership",
    description: "Empowering students who demonstrate exceptional leadership potential and community impact.",
    status: "closing-soon",
  },
  {
    id: "3",
    title: "Arts & Humanities Grant",
    sponsor: "Creative Minds Foundation",
    amount: 8000,
    deadline: "2025-05-01",
    eligibility: ["Arts or Humanities major", "Portfolio required", "Full-time student"],
    category: "Arts",
    description: "Nurturing creative talent and supporting students pursuing careers in arts and humanities.",
    status: "open",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Featured Scholarships */}
        <section className="py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Featured Scholarships
                </h2>
                <p className="text-muted-foreground">
                  Explore top opportunities from our trusted sponsors
                </p>
              </div>
              <Button variant="outline" asChild className="gap-2 shrink-0">
                <Link to="/scholarships">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredScholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          </div>
        </section>

        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
