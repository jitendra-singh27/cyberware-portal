import { Layout } from "@/components/layout";
import { useListQuizzes } from "@/lib/query-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDifficultyColor } from "@/lib/utils";
import { Brain, HelpCircle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function QuizzesList() {
  const { data: quizzes, isLoading } = useListQuizzes();

  return (
    <Layout>
      <div className="bg-secondary/20 border-b border-white/5 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Knowledge Assessments</h1>
          <p className="text-xl text-muted-foreground">
            Evaluate your understanding of critical security concepts through scenario-based assessments.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col bg-card/60 backdrop-blur border-white/5 hover:border-accent/30 transition-colors group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-black/40 border-white/10">
                      {quiz.category}
                    </Badge>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center text-sm font-medium text-white/70">
                      <HelpCircle className="w-4 h-4 mr-2 text-accent" />
                      {quiz.questionCount} Questions
                    </div>
                    <Link href={`/quizzes/${quiz.id}`}>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent group-hover:scale-105 transition-transform">
                        Start <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
