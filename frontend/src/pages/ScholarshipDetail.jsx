import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { scholarshipAPI } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, GraduationCap, Building2, Clock, CheckCircle2, FileText, Globe, Loader2, AlertCircle } from "lucide-react";
const ScholarshipDetail = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    data: scholarshipResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => scholarshipAPI.getById(id),
    enabled: !!id
  });
  const scholarship = scholarshipResponse?.data;
  const formatCurrency = amount => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };
  const daysUntilDeadline = () => {
    if (!scholarship?.deadline) return 0;
    const deadline = new Date(scholarship.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  if (isLoading) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>;
  }
  if (error || !scholarship) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Scholarship Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The scholarship you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/scholarships">Back to Scholarships</Link>
          </Button>
        </main>
        <Footer />
      </div>;
  }

  // Determine sponsor name safely
  const sponsorName = scholarship.sponsor?.organization || scholarship.sponsor?.fullName || "Verified Sponsor";
  return <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-muted/30 py-4">
          <div className="container">
            <Link to="/scholarships" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Scholarships
            </Link>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{scholarship.category}</Badge>
                  <Badge variant="outline" className={`${daysUntilDeadline() < 7 ? "status-warning" : "status-approved"} border`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {daysUntilDeadline() > 0 ? `${daysUntilDeadline()} days left` : "Closed"}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {scholarship.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{sponsorName}</span>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Scholarship</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {scholarship.description}
                  </p>
                </CardContent>
              </Card>

              {/* Eligibility */}
              {scholarship.eligibility && scholarship.eligibility.length > 0 && <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Eligibility Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scholarship.eligibility.map((item, index) => <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>}

              {/* Requirements / Documents */}
              {scholarship.requirements?.documents && scholarship.requirements.documents.length > 0 && <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scholarship.requirements.documents.map((item, index) => <li key={index} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>}

              {/* Application Process - Static for now as not in backend model */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Create an account and complete your profile", "Gather all required documents", "Submit your application before the deadline", "Applications are reviewed by the sponsor", "Winners notified via the platform"].map((step, index) => <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full hero-gradient text-primary-foreground text-sm font-medium">
                            {index + 1}
                          </span>
                          {index < 4 && <div className="w-0.5 h-full bg-border mt-2" />}
                        </div>
                        <p className="text-muted-foreground pt-1">{step}</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="card-elevated sticky top-24">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Award Amount</p>
                    <p className="text-4xl font-bold text-foreground">
                      {formatCurrency(scholarship.amount)}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Deadline
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDate(scholarship.deadline)}
                      </span>
                    </div>
                  </div>

                  {user ? <Button size="lg" className="w-full mb-3" asChild disabled={daysUntilDeadline() <= 0}>
                      <Link to={`/scholarships/${scholarship._id}/apply`}>
                        {daysUntilDeadline() > 0 ? "Apply Now" : "Applications Closed"}
                      </Link>
                    </Button> : <Button size="lg" className="w-full mb-3" asChild>
                      <Link to="/login">
                        Login to Apply
                      </Link>
                    </Button>}

                  {!user && <p className="text-xs text-center text-muted-foreground">
                      You'll need to create an account to apply
                    </p>}
                </CardContent>
              </Card>

              {/* Sponsor Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Sponsor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{sponsorName}</p>
                      <p className="text-sm text-muted-foreground">Scholarship Provider</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default ScholarshipDetail;