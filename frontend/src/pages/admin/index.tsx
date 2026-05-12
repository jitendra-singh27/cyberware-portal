import { Layout } from "@/components/layout";
import { useGetAdminStats, useListReports } from "@/lib/query-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Brain, AlertTriangle, Activity, ShieldCheck, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: reports, isLoading: reportsLoading } = useListReports();

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <ShieldCheck className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have clearance to view this sector.</p>
          <Link href="/"><Button>Return to Base</Button></Link>
        </div>
      </Layout>
    );
  }

  // Mock data for the chart based on stats
  const chartData = [
    { name: 'Mon', attempts: 12 },
    { name: 'Tue', attempts: 19 },
    { name: 'Wed', attempts: 15 },
    { name: 'Thu', attempts: 22 },
    { name: 'Fri', attempts: 28 },
    { name: 'Sat', attempts: 14 },
    { name: 'Sun', attempts: Math.floor((stats?.totalQuizAttempts || 100) / 7) },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8 flex items-center">
          <Activity className="w-8 h-8 mr-3 text-primary" />
          Command Center
        </h1>

        {statsLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <StatCard title="Total Agents" value={stats?.totalUsers || 0} icon={<Users className="w-5 h-5" />} color="text-blue-500" />
            <StatCard title="Active Scanners" value={stats?.activeUsers || 0} icon={<Activity className="w-5 h-5" />} color="text-green-500" />
            <StatCard title="Knowledge Modules" value={stats?.totalContent || 0} icon={<BookOpen className="w-5 h-5" />} color="text-purple-500" />
            <StatCard title="Assessments Taken" value={stats?.totalQuizAttempts || 0} icon={<Brain className="w-5 h-5" />} color="text-indigo-500" />
            <StatCard title="Total Incident Reports" value={stats?.totalReports || 0} icon={<AlertTriangle className="w-5 h-5" />} color="text-orange-500" />
            <StatCard title="Pending Review" value={stats?.pendingReports || 0} icon={<AlertTriangle className="w-5 h-5" />} color="text-destructive" alert={!!stats?.pendingReports} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display font-bold mb-4">Recent Incident Reports</h2>
            <Card className="bg-card/50 border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs text-white/70 uppercase bg-black/20">
                    <tr>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsLoading ? (
                      <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                    ) : reports?.slice(0, 5).map(report => (
                      <tr key={report.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className="text-white/90 font-medium">{report.type.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 truncate max-w-[200px]">{report.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(report.reportedAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant="outline" className={
                            report.status === 'pending' ? 'border-destructive text-destructive bg-destructive/10' :
                            report.status === 'reviewing' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                            'border-accent text-accent bg-accent/10'
                          }>
                            {report.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reports?.length === 0 && <div className="text-center py-8">No reports found.</div>}
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold mb-4">Activity Overview</h2>
            <Card className="bg-card/50 border-white/5 p-6 h-[400px]">
              <h3 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Quiz Attempts (7 Days)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1F2937', borderRadius: '8px' }} />
                    <Bar dataKey="attempts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color, alert }: { title: string, value: number, icon: any, color: string, alert?: boolean }) {
  return (
    <Card className={`bg-card/60 backdrop-blur border-white/5 relative overflow-hidden ${alert ? 'border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`}>
      {alert && <div className="absolute top-0 right-0 w-12 h-12 bg-destructive blur-[30px] opacity-50 rounded-full" />}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-black/40 border border-white/5 ${color}`}>
            {icon}
          </div>
        </div>
        <div>
          <div className="text-4xl font-display font-bold text-white mb-1">{value}</div>
          <div className="text-sm text-muted-foreground font-medium">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
