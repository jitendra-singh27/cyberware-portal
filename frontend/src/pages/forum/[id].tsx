import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout";
import { useListForumPosts, useGetForumReplies, useCreateForumReply } from "@/lib/query-hooks";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, UserCircle, CornerDownRight, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ForumPostDetail({ params }: { params?: { id: string } }) {
  const [, matchParams] = useRoute("/forum/:id");
  const id = Number(params?.id || matchParams?.id);
  
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Hack to get the post detail since API doesn't have getForumPost(id), we find it in the list
  const { data: posts } = useListForumPosts();
  const post = posts?.find(p => p.id === id);
  
  const { data: replies, isLoading } = useGetForumReplies(id, { query: { enabled: !!id } });
  
  const [replyContent, setReplyContent] = useState("");
  
  const replyMutation = useCreateForumReply({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/forum/posts/${id}/replies`] });
        setReplyContent("");
      }
    }
  });

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    replyMutation.mutate({ id, data: { content: replyContent } });
  };

  if (!post) return <Layout><div className="p-20 text-center">Loading post...</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/forum" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
        </Link>

        {/* Original Post */}
        <Card className="bg-card border-white/10 mb-8">
          <CardContent className="p-6 md:p-8">
            <h1 className="text-3xl font-display font-bold mb-6 text-white">{post.title}</h1>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5 text-sm">
              <div className="flex items-center text-primary font-medium">
                <UserCircle className="w-5 h-5 mr-2" /> {post.authorName}
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{formatDate(post.createdAt)}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{post.category}</span>
            </div>
            
            <div className="prose prose-invert max-w-none text-white/80 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="pl-4 md:pl-12 border-l-2 border-white/5 space-y-6">
          <h3 className="font-display font-bold text-xl mb-6 flex items-center">
            <CornerDownRight className="w-5 h-5 mr-3 text-muted-foreground" />
            {replies?.length || 0} Replies
          </h3>

          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            replies?.map(reply => (
              <Card key={reply.id} className="bg-card/40 border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    <span className="font-medium text-white/90 flex items-center">
                      <UserCircle className="w-4 h-4 mr-1.5 opacity-50" /> {reply.authorName}
                    </span>
                    <span className="text-muted-foreground text-xs">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{reply.content}</p>
                </CardContent>
              </Card>
            ))
          )}

          {/* Reply Form */}
          <div className="pt-6 mt-6">
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <textarea 
                  required 
                  rows={3}
                  placeholder="Write a reply..."
                  className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-y"
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                />
                <Button type="submit" variant="glow" isLoading={replyMutation.isPending}>
                  Post Reply
                </Button>
              </form>
            ) : (
              <div className="bg-background/50 p-4 rounded-xl border border-white/5 text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">Log in</Link> to join the discussion.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
