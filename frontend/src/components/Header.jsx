import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Settings, FileText } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };
  const navLinks = [{
    href: user ? "/dashboard" : "/",
    label: "Home"
  }, {
    href: "/scholarships",
    label: "Scholarships"
  }, {
    href: "/about",
    label: "About"
  }, {
    href: "/contact",
    label: "Contact"
  }];
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">ScholarHub</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map(link => <Link key={link.href} to={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"}`}>
          {link.label}
        </Link>)}
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-3">
        {user ? <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/documents" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Documents</span>
                </Link>
              </DropdownMenuItem>
              {user && (user.role === 'sponsor' || user.role === 'admin') && (
                <DropdownMenuItem asChild>
                  <Link to="/manage-scholarships" className="cursor-pointer">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Manage Scholarships</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {/* Settings could be a future page */}
              {/* <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                   </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> : <>
          <Button variant="ghost" asChild>
            <Link to="/auth?mode=login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?mode=register">Get Started</Link>
          </Button>
        </>}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>

    {/* Mobile Menu */}
    {mobileMenuOpen && <div className="md:hidden border-t border-border animate-fade-in">
      <nav className="container py-4 flex flex-col gap-3">
        {navLinks.map(link => <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)} className={`text-sm font-medium py-2 transition-colors hover:text-primary ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"}`}>
          {link.label}
        </Link>)}
        <div className="flex flex-col gap-2 pt-4 border-t border-border">
          {user ? <>
            <div className="flex items-center gap-3 py-2 px-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <Button variant="outline" asChild className="justify-start gap-2">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start gap-2">
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start gap-2">
              <Link to="/documents" onClick={() => setMobileMenuOpen(false)}>
                <FileText className="h-4 w-4" />
                Documents
              </Link>
            </Button>
            {user && (user.role === 'sponsor' || user.role === 'admin') && (
              <Button variant="outline" asChild className="justify-start gap-2">
                <Link to="/manage-scholarships" onClick={() => setMobileMenuOpen(false)}>
                  <GraduationCap className="h-4 w-4" />
                  Manage Scholarships
                </Link>
              </Button>
            )}
            <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </> : <>
            <Button variant="outline" asChild>
              <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </>}
        </div>
      </nav>
    </div>}
  </header>;
};
export default Header;