import { useState } from "react";
import { Layout } from "@/components/layout";
import { useSubmitReport } from "@/lib/query-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ReportIncident() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "phishing" as const,
    url: "",
    contactEmail: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useSubmitReport({
    mutation: {
      onSuccess: () => setSubmitted(true)
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: formData });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex justify-center">
          <Card className="max-w-md w-full text-center p-8 bg-card/80 border-accent/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Report Submitted Successfully</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for helping secure our community. Our threat analysis team will review the incident immediately.
            </p>
            <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({title:'', description:'', type:'phishing', url:'', contactEmail:''}) }}>
              Submit Another Report
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 mb-4 border border-orange-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">Report Suspicious Activity</h1>
          <p className="text-muted-foreground">
            Encountered a potential threat? Provide details below. Your vigilance protects everyone.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Incident Type <span className="text-destructive">*</span></label>
                <select 
                  className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors appearance-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                  required
                >
                  <option value="phishing">Phishing Email / Message</option>
                  <option value="malware">Malware / Suspicious File</option>
                  <option value="scam">Scam / Social Engineering</option>
                  <option value="identity_theft">Identity Theft / Account Compromise</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Title / Brief Summary <span className="text-destructive">*</span></label>
                <Input 
                  required 
                  placeholder="e.g. Suspicious password reset email from 'IT Dept'"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Detailed Description <span className="text-destructive">*</span></label>
                <textarea 
                  required 
                  rows={5}
                  placeholder="Provide as much context as possible. How did you encounter it? What did it ask you to do?"
                  className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-y"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Malicious URL (Optional)</label>
                <Input 
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Contact Email (Optional)</label>
                <Input 
                  type="email"
                  placeholder="For follow-up questions"
                  value={formData.contactEmail}
                  onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                  isLoading={mutation.isPending}
                >
                  Submit Security Report
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting, you agree to our data handling policy for threat intelligence.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
