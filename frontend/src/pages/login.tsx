import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLoginUser } from "@/lib/query-hooks";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginMutation = useLoginUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        setLocation("/learn");
      },
      onError: (error: any) => {
        setErrorMsg(error.response?.data?.message || "Invalid credentials. Please try again.");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    loginMutation.mutate({ data: { email, password } });
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-bold">Welcome Back</h2>
              <p className="text-muted-foreground mt-2">Access your secure dashboard</p>
            </div>

            {errorMsg && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground px-4 py-3 rounded-lg mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="text-sm font-medium text-white/80">Password</label>
                <Input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-black/20 border-white/10"
                />
              </div>

              <Button 
                type="submit" 
                variant="glow" 
                className="w-full h-12 text-base mt-4"
                isLoading={loginMutation.isPending}
              >
                Authenticate
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground border-t border-white/5 pt-6">
              Don't have an access clearance?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium hover:underline">
                Request access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
