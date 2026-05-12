import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout";
import { useGetQuiz, useSubmitQuiz } from "@/lib/query-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle2, XCircle, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AnswerRecord = { questionId: number; answer: 'A' | 'B' | 'C' | 'D' };

export default function QuizTake({ params }: { params?: { id: string } }) {
  const [, matchParams] = useRoute("/quizzes/:id");
  const id = Number(params?.id || matchParams?.id);
  
  const { data: quiz, isLoading } = useGetQuiz(id, { query: { enabled: !!id, refetchOnWindowFocus: false } });
  const submitMutation = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (isLoading || !quiz) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div></Layout>;
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex) / quiz.questions.length) * 100;

  const handleSelectAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId: currentQuestion.id, answer: option };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, answer: option });
    }
    setAnswers(newAnswers);
  };

  const currentSelection = answers.find(a => a.questionId === currentQuestion.id)?.answer;

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      submitMutation.mutate({ id, data: { answers } });
      setIsFinished(true);
    }
  };

  if (isFinished && submitMutation.data) {
    const result = submitMutation.data;
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 max-w-2xl">
          <Card className="text-center p-8 bg-card/80 backdrop-blur border-white/10 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${result.passed ? 'bg-accent glow-accent' : 'bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`} />
            
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-black/40 mb-6 border-4 border-white/5">
              {result.passed ? (
                <CheckCircle2 className="w-12 h-12 text-accent" />
              ) : (
                <XCircle className="w-12 h-12 text-destructive" />
              )}
            </div>
            
            <h2 className="text-4xl font-display font-bold mb-2">
              {result.passed ? 'Assessment Passed' : 'Assessment Failed'}
            </h2>
            <div className="text-6xl font-display font-black my-8 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
              {result.percentage}%
            </div>
            
            <p className="text-xl text-white/80 mb-2">
              Score: {result.score} out of {result.total}
            </p>
            <p className="text-muted-foreground mb-10 p-4 bg-black/20 rounded-lg">
              {result.feedback}
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/quizzes">
                <Button variant="outline">Return to Quizzes</Button>
              </Link>
              {!result.passed && (
                <Button variant="glow" onClick={() => { setIsFinished(false); setCurrentIndex(0); setAnswers([]); submitMutation.reset(); }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              )}
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <Link href="/quizzes" className="text-sm text-muted-foreground hover:text-white transition-colors mb-6 inline-block">
            ← Abort Assessment
          </Link>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-2xl font-bold font-display">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {quiz.questions.length}</p>
            </div>
            <div className="text-accent font-bold">{Math.round(progress)}%</div>
          </div>
          
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent glow-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitMutation.isPending ? (
            <motion.div key="loading" className="flex flex-col items-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
              <p className="text-xl font-medium">Analyzing responses...</p>
            </motion.div>
          ) : (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-white/10 bg-card/60 backdrop-blur p-1">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-medium text-white mb-8 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                  
                  <div className="space-y-4">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 flex items-center group ${
                          currentSelection === opt 
                            ? 'border-accent bg-accent/10 text-white' 
                            : 'border-white/5 bg-black/20 text-white/70 hover:border-white/20 hover:bg-black/40'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm transition-colors ${
                          currentSelection === opt ? 'bg-accent text-accent-foreground' : 'bg-white/10 text-white/50 group-hover:bg-white/20'
                        }`}>
                          {opt}
                        </div>
                        <span className="text-lg">{currentQuestion[`option${opt}`]}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleNext} 
                  disabled={!currentSelection}
                  className={!currentSelection ? 'opacity-50' : 'bg-accent text-accent-foreground hover:bg-accent/90 glow-accent'}
                >
                  {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'Submit Assessment'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
