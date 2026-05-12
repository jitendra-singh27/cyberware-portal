import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import Home           from "@/pages/home";
import Login          from "@/pages/login";
import Register       from "@/pages/register";
import LearningModules from "@/pages/learning";
import ContentDetail  from "@/pages/learning/[id]";
import QuizzesList    from "@/pages/quizzes";
import QuizTake       from "@/pages/quizzes/[id]";
import News           from "@/pages/news";
import ReportIncident from "@/pages/report";
import Forum          from "@/pages/forum";
import ForumPostDetail from "@/pages/forum/[id]";
import AdminDashboard from "@/pages/admin";
import NotFound       from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/"           component={Home} />
      <Route path="/login"      component={Login} />
      <Route path="/register"   component={Register} />
      <Route path="/learn"      component={LearningModules} />
      <Route path="/learn/:id"  component={ContentDetail} />
      <Route path="/quizzes"    component={QuizzesList} />
      <Route path="/quizzes/:id" component={QuizTake} />
      <Route path="/news"       component={News} />
      <Route path="/report"     component={ReportIncident} />
      <Route path="/forum"      component={Forum} />
      <Route path="/forum/:id"  component={ForumPostDetail} />
      <Route path="/admin"      component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
