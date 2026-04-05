import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Dashboard from "./pages/Dashboard";
import ApplicationDetail from "./pages/ApplicationDetail";
import ScholarshipApplication from "./pages/ScholarshipApplication";
import Profile from "./pages/Profile";
import Documents from "./pages/Documents";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ManageScholarships from "./pages/ManageScholarships";
import ScholarshipForm from "./pages/ScholarshipForm";
import { useAuth } from "@/contexts/AuthContext";
const queryClient = new QueryClient();

// Redirects logged-in users away from the landing page to their dashboard
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Index />;
};

// Redirects logged-in users away from the auth page to their dashboard
const AuthRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Auth />;
};
const App = () => <QueryClientProvider client={queryClient}>
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth" element={<AuthRedirect />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute>
            <Documents />
          </ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute>
            <ApplicationDetail />
          </ProtectedRoute>} />
          <Route path="/scholarships/:id/apply" element={<ProtectedRoute allowedRoles={['student']}>
            <ScholarshipApplication />
          </ProtectedRoute>} />
          <Route path="/manage-scholarships" element={<ProtectedRoute allowedRoles={['sponsor', 'admin']}>
            <ManageScholarships />
          </ProtectedRoute>} />
          <Route path="/manage-scholarships/new" element={<ProtectedRoute allowedRoles={['sponsor', 'admin']}>
            <ScholarshipForm />
          </ProtectedRoute>} />
          <Route path="/manage-scholarships/:id/edit" element={<ProtectedRoute allowedRoles={['sponsor', 'admin']}>
            <ScholarshipForm />
          </ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>;
export default App;