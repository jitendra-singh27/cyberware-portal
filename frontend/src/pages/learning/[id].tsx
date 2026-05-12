import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout";
import { useGetContent } from "@/lib/query-hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDifficultyColor, formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, Calendar, CheckCircle2, Loader2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function ContentDetail({ params }: { params?: { id: string } }) {
  const [, matchParams] = useRoute("/learn/:id");
  const id = Number(params?.id || matchParams?.id);
  
  const { data: content, isLoading, error } = useGetContent(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !content) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
             <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
          <p className="text-muted-foreground mb-8">The requested training module does not exist or has been removed.</p>
          <Link href="/learn">
            <Button>Return to Modules</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-card border-b border-white/5 pb-12 pt-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-wider">
              {content.category.replace('_', ' ')}
            </Badge>
            <Badge className={getDifficultyColor(content.difficulty)}>
              {content.difficulty}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6 text-white">
            {content.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              {content.readTime} min read
            </div>
            {content.createdAt && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                Updated {formatDate(content.createdAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-white/10"
        >
          {/* Since we don't have rich HTML from the API in this mock, we render description and dummy content */}
          <p className="lead text-xl text-white/80 font-medium mb-12 border-l-4 border-primary pl-6">
            {content.description}
          </p>

          <div className="bg-secondary/30 p-8 rounded-2xl border border-white/5 mb-12">
            <h3 className="flex items-center text-xl mt-0 mb-6 text-white">
              <BookOpen className="w-6 h-6 mr-3 text-primary" />
              Module Overview
            </h3>
            <p>
              In this module, you will learn the core concepts surrounding <strong>{content.category.replace('_', ' ')}</strong>. 
              As cyber threats evolve, understanding the mechanics behind these attacks is your first line of defense.
              Pay close attention to the indicators of compromise discussed below.
            </p>
          </div>

          {content.contentUrl && (
             <div className="my-12">
                <a href={content.contentUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full py-8 text-lg border-primary/30 hover:bg-primary/10">
                    <BookOpen className="w-6 h-6 mr-3 text-primary" />
                    Access Full Training Material
                  </Button>
                </a>
             </div>
          )}

          <h3>Key Takeaways</h3>
          <ul className="not-prose space-y-4 mb-12">
            {['Always verify sender addresses before clicking links.', 'Enable Multi-Factor Authentication (MFA) on all critical accounts.', 'Keep software updated to patch known vulnerabilities.', 'Report suspicious activity immediately to IT security.'].map((item, i) => (
              <li key={i} className="flex items-start bg-card/50 p-4 rounded-lg border border-white/5">
                <CheckCircle2 className="w-6 h-6 mr-4 text-accent shrink-0 mt-0.5" />
                <span className="text-white/80">{item}</span>
              </li>
            ))}
          </ul>

        </motion.div>

        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-white mb-1">Finished reading?</h4>
            <p className="text-sm text-muted-foreground">Test your knowledge on this topic.</p>
          </div>
          <Link href="/quizzes">
            <Button variant="glow">Take a Quiz</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
