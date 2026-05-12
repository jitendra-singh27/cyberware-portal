import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useListContent } from "@/lib/query-hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/utils";
import { Clock, BookOpen, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LearningModules() {
  const [category, setCategory] = useState<string>("");
  const { data, isLoading, error } = useListContent(category ? { category } : undefined);

  const categories = ["All", "phishing", "malware", "password", "privacy", "social_media", "ransomware", "general"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold mb-4">Learning Modules</h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Explore our comprehensive library of cybersecurity topics. From basic password hygiene to advanced threat vectors.
            </p>
          </div>
          
          <div className="w-full md:w-auto relative">
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c === "All" ? "" : c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    (c === "All" && !category) || c === category 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p>Decrypting knowledge base...</p>
          </div>
        ) : error ? (
           <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-xl text-center">
             Failed to load modules. Please try again later.
           </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No modules found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((module) => (
              <Link key={module.id} href={`/learn/${module.id}`}>
                <Card className="h-full flex flex-col hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="bg-black/40 text-xs tracking-wider uppercase border-white/10 group-hover:border-primary/30 transition-colors">
                        {module.category.replace('_', ' ')}
                      </Badge>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-6">
                      {module.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground font-medium bg-black/20 w-max px-3 py-1.5 rounded-md">
                      <Clock className="w-3.5 h-3.5 mr-2 text-primary" />
                      {module.readTime} min read
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
