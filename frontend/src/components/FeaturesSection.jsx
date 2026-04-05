import { FileCheck2, Bell, ShieldCheck, LayoutDashboard, Upload, BarChart3 } from "lucide-react";
const features = [{
  icon: LayoutDashboard,
  title: "Role-Based Dashboards",
  description: "Personalized dashboards for students, sponsors, and administrators with relevant tools and insights."
}, {
  icon: FileCheck2,
  title: "Document Verification",
  description: "Secure document upload with institutional verification to prevent fraudulent applications."
}, {
  icon: Bell,
  title: "Real-Time Notifications",
  description: "Stay updated with instant notifications about application status changes and deadlines."
}, {
  icon: ShieldCheck,
  title: "Institutional Verification",
  description: "Educational institutions verify student records ensuring authentic applications reach sponsors."
}, {
  icon: Upload,
  title: "Easy Application Process",
  description: "Streamlined online application with document upload and progress tracking."
}, {
  icon: BarChart3,
  title: "Analytics & Reports",
  description: "Comprehensive reporting for sponsors and administrators to track scholarship distribution."
}];
const FeaturesSection = () => {
  return <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-muted-foreground">
            Our comprehensive platform simplifies scholarship management for students, 
            sponsors, and educational institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => <div key={index} className="p-6 rounded-xl bg-card border border-border card-elevated animate-fade-in" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg hero-gradient mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default FeaturesSection;