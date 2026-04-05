import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { applicationAPI, notificationAPI } from "@/lib/api";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, FileText, Clock, CheckCircle2, XCircle, ArrowRight, Bell, User, Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react";
const getStatusConfig = status => {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        class: "status-submitted",
        icon: FileText
      };
    case "under-verification":
      return {
        label: "Under Verification",
        class: "status-verification",
        icon: Clock
      };
    case "forwarded":
      return {
        label: "Forwarded to Sponsor",
        class: "status-forwarded",
        icon: TrendingUp
      };
    case "approved":
      return {
        label: "Approved",
        class: "status-approved",
        icon: CheckCircle2
      };
    case "rejected":
      return {
        label: "Rejected",
        class: "status-rejected",
        icon: XCircle
      };
    default:
      return {
        label: status,
        class: "status-submitted",
        icon: FileText
      };
  }
};
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState("applications");
  const {
    data: applicationsResponse,
    isLoading: isLoadingApps
  } = useQuery({
    queryKey: ["myApplications", user?.role],
    queryFn: () => {
      if (user?.role === "sponsor") return applicationAPI.getForSponsor();
      if (user?.role === "admin") return applicationAPI.getForAdmin();
      return applicationAPI.getMyApplications();
    },
    enabled: !!user
  });
  const {
    data: notificationsResponse,
    isLoading: isLoadingNotifs
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationAPI.getAll(),
    enabled: !!user
  });
  const applications = applicationsResponse?.data || [];
  const notifications = notificationsResponse?.data || [];
  const stats = {
    totalApplications: applications.length,
    approved: applications.filter(a => a.status === "approved").length,
    pending: applications.filter(a => ["submitted", "under-verification", "forwarded"].includes(a.status)).length,
    rejected: applications.filter(a => a.status === "rejected").length,
    awardedAmount: applications.filter(a => a.status === "approved").reduce((sum, a) => sum + (a.scholarship?.amount || 0), 0)
  };
  const profileCompletion = 75; // This could be calculated from user profile data

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>;
  }
  return <div className="min-h-screen flex flex-col bg-muted/30">
    <Header />

    <main className="flex-1 py-8">
      <div className="container">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {user.fullName.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your scholarship applications
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/scholarships">
              Browse Scholarships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalApplications}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${stats.awardedAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Awarded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applications Section */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your scholarship applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="applications">All ({applications.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({stats.approved + stats.rejected})</TabsTrigger>
                  </TabsList>

                  {isLoadingApps ? <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div> : <>
                    <TabsContent value="applications" className="space-y-4 mt-0">
                      {applications.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                        No applications found. <Link to="/scholarships" className="text-primary hover:underline">Apply for a scholarship</Link>
                      </div> : applications.map(app => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;
                        // Handle optional scholarship data just in case
                        const scholarshipTitle = app.scholarship?.title || "Unknown Scholarship";
                        const sponsorName = app.scholarship?.sponsor?.organization || app.scholarship?.sponsor?.fullName || "Unknown Sponsor";
                        const amount = app.scholarship?.amount || 0;
                        return <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {scholarshipTitle}
                            </h4>
                            <p className="text-sm text-muted-foreground">{sponsorName}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                ${amount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`${statusConfig.class} border gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/applications/${app._id}`}>View</Link>
                            </Button>
                          </div>
                        </div>;
                      })}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4 mt-0">
                      {applications.filter(a => ["submitted", "under-verification", "forwarded"].includes(a.status)).map(app => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;
                        const scholarshipTitle = app.scholarship?.title || "Unknown Scholarship";
                        const sponsorName = app.scholarship?.sponsor?.organization || app.scholarship?.sponsor?.fullName || "Unknown Sponsor";
                        return <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {scholarshipTitle}
                            </h4>
                            <p className="text-sm text-muted-foreground">{sponsorName}</p>
                          </div>
                          <Badge variant="outline" className={`${statusConfig.class} border gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </div>;
                      })}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4 mt-0">
                      {applications.filter(a => ["approved", "rejected"].includes(a.status)).map(app => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;
                        const scholarshipTitle = app.scholarship?.title || "Unknown Scholarship";
                        const sponsorName = app.scholarship?.sponsor?.organization || app.scholarship?.sponsor?.fullName || "Unknown Sponsor";
                        return <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {scholarshipTitle}
                            </h4>
                            <p className="text-sm text-muted-foreground">{sponsorName}</p>
                          </div>
                          <Badge variant="outline" className={`${statusConfig.class} border gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </div>;
                      })}
                    </TabsContent>
                  </>}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to improve your chances
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoadingNotifs ? <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div> : notifications.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p> : notifications.map(notif => <div key={notif._id} className={`p-3 rounded-lg border ${notif.read ? "border-border" : "border-primary/20 bg-primary/5"}`}>
                    <div className="flex items-start gap-2">
                      {!notif.read && <span className="flex h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/scholarships">
                    <GraduationCap className="h-4 w-4" />
                    Browse Scholarships
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/documents">
                    <FileText className="h-4 w-4" />
                    Manage Documents
                  </Link>
                </Button>
                {(user.role === 'sponsor' || user.role === 'admin') && (
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link to="/manage-scholarships">
                      <FileText className="h-4 w-4" />
                      Manage Scholarships
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </div>;
};
export default Dashboard;