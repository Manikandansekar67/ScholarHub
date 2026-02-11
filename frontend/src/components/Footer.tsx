import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ScholarHub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting students with life-changing scholarship opportunities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/scholarships" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Scholarships
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Applications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Sponsors</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/auth?mode=register&role=sponsor" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScholarHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
