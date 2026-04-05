import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { applicationAPI } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, DollarSign, Building2, Clock, CheckCircle2, FileText, XCircle, TrendingUp, Loader2, AlertCircle } from "lucide-react";
const getStatusConfig = status => {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        class: "status-submitted",
        icon: FileText,
        description: "Your application has been received and is awaiting initial review."
      };
    case "under-verification":
      return {
        label: "Under Verification",
        class: "status-verification",
        icon: Clock,
        description: "Your documents are currently being verified by the institution."
      };
    case "forwarded":
      return {
        label: "Forwarded to Sponsor",
        class: "status-forwarded",
        icon: TrendingUp,
        description: "Your application has been verified and forwarded to the sponsor for final decision."
      };
    case "approved":
      return {
        label: "Approved",
        class: "status-approved",
        icon: CheckCircle2,
        description: "Congratulations! Your application has been approved."
      };
    case "rejected":
      return {
        label: "Rejected",
        class: "status-rejected",
        icon: XCircle,
        description: "We regret to inform you that your application was not selected."
      };
    default:
      return {
        label: status,
        class: "status-submitted",
        icon: FileText,
        description: "Status update pending."
      };
  }
};
const ApplicationDetail = () => {
  const {
    id
  } = useParams();
  const {
    data: applicationResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationAPI.getById(id),
    enabled: !!id
  });
  const application = applicationResponse?.data;
  if (isLoading) {
    return <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>;
  }
  if (error || !application) {
    return <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">Application Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        The application you are looking for does not exist or you don't have permission to view it.
                    </p>
                    <Button asChild>
                        <Link to="/dashboard">Back to Dashboard</Link>
                    </Button>
                </main>
                <Footer />
            </div>;
  }
  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;
  const scholarship = application.scholarship;
  return <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="border-b border-border bg-muted/30 py-4">
                    <div className="container">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
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
                                    <Badge variant="outline" className={`${statusConfig.class} border gap-1 px-3 py-1 text-sm`}>
                                        <StatusIcon className="h-4 w-4" />
                                        {statusConfig.label}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center ml-2">
                                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-3">
                                    Application for {scholarship?.title || "Unknown Scholarship"}
                                </h1>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building2 className="h-4 w-4" />
                                    <span>{scholarship?.sponsor?.organization || scholarship?.sponsor?.fullName || "Unknown Sponsor"}</span>
                                </div>
                            </div>

                            {/* Status Details */}
                            <Card className={`border-l-4 ${application.status === 'approved' ? 'border-l-success' : application.status === 'rejected' ? 'border-l-destructive' : 'border-l-primary'}`}>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold text-lg mb-2">Current Status: {statusConfig.label}</h3>
                                    <p className="text-muted-foreground">{statusConfig.description}</p>

                                    {/* Timeline could go here */}
                                    <div className="mt-6 flex flex-col gap-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <FileText className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Application Submitted</p>
                                                <p className="text-muted-foreground">{new Date(application.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {/* Add more timeline items based on history if available */}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Application Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Application Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Personal Info Snapshot (if stored in application) */}
                                    {/* Documents */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Submitted Documents
                                        </h4>
                                        {/* This would need to iterate over submitted documents/answers */}
                                        <p className="text-muted-foreground text-sm italic">
                                            Documents are securely stored and viewable by the review committee.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Scholarship Snapshot */}
                            <Card className="card-elevated">
                                <CardHeader>
                                    <CardTitle className="text-lg">Scholarship Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Amount</p>
                                        <p className="text-2xl font-bold">
                                            {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0
                    }).format(scholarship?.amount || 0)}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-border">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm text-muted-foreground">Category</span>
                                            <span className="text-sm font-medium">{scholarship?.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm text-muted-foreground">Deadline</span>
                                            <span className="text-sm font-medium">{scholarship?.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full" asChild>
                                        <Link to={`/scholarships/${scholarship?._id}`}>
                                            View Scholarship
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Support */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Need Help?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        If you have questions about your application status, please contact the scholarship administrator.
                                    </p>
                                    <Button variant="secondary" className="w-full">
                                        Contact Support
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
export default ApplicationDetail;