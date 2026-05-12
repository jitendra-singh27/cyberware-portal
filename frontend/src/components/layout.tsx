import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Shield, BookOpen, BrainCircuit, Newspaper, MessageSquare, AlertTriangle, LogIn, LogOut, Menu, UserCircle, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const navLinks = [
    { href: "/learn", label: "Learn", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { href: "/quizzes", label: "Quizzes", icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
    { href: "/news", label: "News", icon: <Newspaper className="w-4 h-4 mr-2" /> },
    { href: "/forum", label: "Forum", icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { href: "/report", label: "Report Incident", icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Cyber<span className="text-primary">Aware</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${location.startsWith(link.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
               <Link href="/admin" className="hidden lg:flex px-4 py-2 rounded-lg text-sm font-medium items-center text-accent hover:bg-accent/10 transition-colors border border-accent/20">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCircle className="w-5 h-5 text-primary" />
                  <span>{user?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="border-white/10 hover:border-destructive/50 hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="glow">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-white/5 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium text-sm">© {new Date().getFullYear()} CyberAware Portal. Stay safe online.</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
