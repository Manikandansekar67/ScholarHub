import { UserPlus, Search, FileText, CheckCircle } from "lucide-react";
const steps = [{
  icon: UserPlus,
  step: "01",
  title: "Create Your Account",
  description: "Sign up as a student and complete your profile with academic details and achievements."
}, {
  icon: Search,
  step: "02",
  title: "Discover Scholarships",
  description: "Browse and filter scholarships based on your eligibility, field of study, and preferences."
}, {
  icon: FileText,
  step: "03",
  title: "Apply Online",
  description: "Submit your application with required documents. Your institution verifies your details."
}, {
  icon: CheckCircle,
  step: "04",
  title: "Track & Receive",
  description: "Monitor your application status and receive notifications when decisions are made."
}];
const HowItWorksSection = () => {
  return <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Get started in minutes with our simple four-step process
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => <div key={index} className="relative text-center">
                <div className="relative inline-flex mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full hero-gradient">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-card border-2 border-primary text-xs font-bold text-primary">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorksSection;