import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegisterUser } from "@/lib/query-hooks";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        setLocation("/learn");
      },
      onError: (error: any) => {
        setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    registerMutation.mutate({ data: { name, email, password } });
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center relative py-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
            alt="Auth background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>

        <div className="w-full max-w-md relative z-10 px-4">
          <div className="glass-panel rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent mb-4">
                <ShieldPlus className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-bold">Request Clearance</h2>
              <p className="text-muted-foreground mt-2">Join the security initiative</p>
            </div>

            {errorMsg && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground px-4 py-3 rounded-lg mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Full Name</label>
                <Input 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email Address</label>
                <Input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="agent@cyber.local"
                  className="bg-black/20 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Secure Password</label>
                <Input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="bg-black/20 border-white/10"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base mt-4 bg-accent hover:bg-accent/90 text-accent-foreground glow-accent"
                isLoading={registerMutation.isPending}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground border-t border-white/5 pt-6">
              Already have clearance?{" "}
              <Link href="/login" className="text-accent hover:text-accent/80 font-medium hover:underline">
                Log in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
