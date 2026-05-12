import { Router, type IRouter } from "express";
import { db } from "../db/index.js";
import { forumPostsTable, forumRepliesTable, usersTable } from "../db/schema/index.js";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const createPostSchema  = z.object({ title: z.string().min(1), content: z.string().min(1), category: z.string().min(1) });
const createReplySchema = z.object({ content: z.string().min(1) });

async function getAuthorName(req: any): Promise<string> {
  const userId = (req.session as any)?.userId;
  if (!userId) return "Anonymous";
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  return user?.name || "Anonymous";
}

// GET /api/forum/posts
router.get("/posts", async (req, res) => {
  const page   = Number(req.query.page) || 1;
  const offset = (page - 1) * 20;
  const posts  = await db
    .select()
    .from(forumPostsTable)
    .orderBy(desc(forumPostsTable.createdAt))
    .limit(20)
    .offset(offset);
  res.json(posts);
});

// POST /api/forum/posts
router.post("/posts", async (req, res) => {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }
  const userId     = (req.session as any)?.userId;
  const authorName = await getAuthorName(req);
  const [post] = await db
    .insert(forumPostsTable)
    .values({ ...parsed.data, authorId: userId, authorName })
    .returning();
  res.status(201).json(post);
});

// GET /api/forum/posts/:id/replies
router.get("/posts/:id/replies", async (req, res) => {
  const postId = Number(req.params.id);
  const replies = await db
    .select()
    .from(forumRepliesTable)
    .where(eq(forumRepliesTable.postId, postId))
    .orderBy(forumRepliesTable.createdAt);
  res.json(replies);
});

// POST /api/forum/posts/:id/replies
router.post("/posts/:id/replies", async (req, res) => {
  const postId = Number(req.params.id);
  const parsed = createReplySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }
  const userId     = (req.session as any)?.userId;
  const authorName = await getAuthorName(req);
  const [reply] = await db
    .insert(forumRepliesTable)
    .values({ postId, content: parsed.data.content, authorId: userId, authorName })
    .returning();
  await db
    .update(forumPostsTable)
    .set({ replyCount: sql`${forumPostsTable.replyCount} + 1` })
    .where(eq(forumPostsTable.id, postId));
  res.status(201).json(reply);
});

export default router;
