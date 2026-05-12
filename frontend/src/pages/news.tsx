import { Layout } from "@/components/layout";
import { useListNews } from "@/lib/query-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getSeverityColor } from "@/lib/utils";
import { Newspaper, ExternalLink, Loader2, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";

export default function News() {
  const { data: news, isLoading } = useListNews();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
          <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-destructive">
             <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold">Threat Intelligence</h1>
            <p className="text-muted-foreground mt-1">Real-time alerts on vulnerabilities, breaches, and active campaigns.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-destructive" />
          </div>
        ) : (
          <div className="space-y-6">
            {news?.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-card/40 border-white/5 hover:border-white/20 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl md:text-2xl font-semibold leading-tight text-white/90">
                        {item.title}
                      </CardTitle>
                      <Badge className={`shrink-0 uppercase tracking-wider text-[10px] ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {item.summary}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm pt-4 border-t border-white/5 text-white/50">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center"><Newspaper className="w-4 h-4 mr-1.5" /> {item.source}</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      <button className="text-primary hover:text-primary/80 flex items-center font-medium transition-colors">
                        Read full report <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
