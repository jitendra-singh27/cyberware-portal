import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useListForumPosts, useCreateForumPost } from "@/lib/query-hooks";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Plus, Loader2, UserCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Forum() {
  const { data: posts, isLoading } = useListForumPosts();
  const { isAuthenticated } = useAuth();
  const [showNewPost, setShowNewPost] = useState(false);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General Discussion");

  const createMutation = useCreateForumPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
        setShowNewPost(false);
        setTitle("");
        setContent("");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: { title, content, category } });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">Discuss threats, share tips, and ask questions.</p>
          </div>
          {isAuthenticated && !showNewPost && (
            <Button variant="glow" onClick={() => setShowNewPost(true)}>
              <Plus className="w-4 h-4 mr-2" /> New Discussion
            </Button>
          )}
        </div>

        {showNewPost && (
          <Card className="mb-10 border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Start a Discussion</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="Topic Title" 
                  value={title} 
                  onChange={e=>setTitle(e.target.value)} 
                  required 
                />
                <select 
                  className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 appearance-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>General Discussion</option>
                  <option>Malware Analysis</option>
                  <option>Career Advice</option>
                  <option>News & Alerts</option>
                </select>
                <textarea 
                  required 
                  rows={4}
                  placeholder="What's on your mind?"
                  className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-y"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowNewPost(false)}>Cancel</Button>
                  <Button type="submit" variant="glow" isLoading={createMutation.isPending}>Post Topic</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {!isAuthenticated && (
           <div className="bg-secondary/30 border border-white/5 p-4 rounded-xl mb-10 flex items-center justify-between">
             <p className="text-sm text-muted-foreground">You must be logged in to participate in discussions.</p>
             <Link href="/login"><Button size="sm" variant="outline">Log in</Button></Link>
           </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-4">
            {posts?.map(post => (
              <Link key={post.id} href={`/forum/${post.id}`}>
                <Card className="bg-card/40 border-white/5 hover:bg-card hover:border-white/20 transition-all cursor-pointer">
                  <CardContent className="p-5 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="bg-black/40 text-xs border-white/10">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white/90 mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.content}</p>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                      <div className="flex items-center text-sm text-white/60 mb-2">
                        <UserCircle2 className="w-4 h-4 mr-1.5" /> {post.authorName}
                      </div>
                      <div className="flex items-center text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> {post.replyCount} Replies
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {posts?.length === 0 && (
              <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                No discussions found. Be the first to start one!
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
