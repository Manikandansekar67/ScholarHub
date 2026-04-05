import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, Building2, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const { login, register, user } = useAuth();
  const homeHref = user ? "/dashboard" : "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const initialRole = searchParams.get("role") || "student";
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    institution: "",
    organization: ""
  });
  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          role,
          fullName: formData.fullName,
          institution: role === "student" ? formData.institution : undefined,
          organization: role === "sponsor" ? formData.organization : undefined
        });
        toast({
          title: "Account created!",
          description: "Welcome to ScholarHub"
        });
      } else {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard..."
        });
      }

      // Navigate based on role
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const roleOptions = [{
    value: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Apply for scholarships"
  }, {
    value: "sponsor",
    label: "Sponsor",
    icon: Building2,
    description: "Offer scholarships"
  }, {
    value: "admin",
    label: "Administrator",
    icon: Shield,
    description: "Manage & verify"
  }];
  return <div className="min-h-screen flex flex-col">
    {/* Background */}
    <div className="fixed inset-0 hero-gradient opacity-5" />

    {/* Header */}
    <header className="relative z-10 p-4">
      <Link to={homeHref} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </header>

    {/* Main Content */}
    <main className="relative z-10 flex-1 flex items-center justify-center p-4 pb-16">
      <Card className="w-full max-w-md card-elevated animate-scale-in">
        <CardHeader className="text-center">
          <Link to={homeHref} className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg hero-gradient">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ScholarHub</span>
          </Link>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "login" ? "Sign in to access your dashboard" : "Join thousands of students finding scholarships"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={mode} onValueChange={v => setMode(v)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="register" className="space-y-4 mt-0">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <RadioGroup value={role} onValueChange={v => setRole(v)} className="grid grid-cols-3 gap-3">
                    {roleOptions.map(option => <div key={option.value}>
                      <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                      <Label htmlFor={option.value} className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-muted bg-popover cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <option.icon className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </Label>
                    </div>)}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} required />
                </div>

                {role === "student" && <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input id="institution" name="institution" placeholder="University of Example" value={formData.institution} onChange={handleInputChange} required />
                </div>}

                {role === "sponsor" && <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" name="organization" placeholder="Company or Foundation name" value={formData.organization} onChange={handleInputChange} required />
                </div>}
              </TabsContent>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === "register" && <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>}

                {mode === "login" && <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
          <p>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-primary hover:underline font-medium">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </main>
  </div>;
};
export default Auth;