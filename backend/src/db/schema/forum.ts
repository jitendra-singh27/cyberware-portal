import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const forumPostsTable = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  authorId: integer("author_id"),
  authorName: varchar("author_name", { length: 100 }).notNull().default("Anonymous"),
  replyCount: integer("reply_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumRepliesTable = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id"),
  authorName: varchar("author_name", { length: 100 }).notNull().default("Anonymous"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumPost = typeof forumPostsTable.$inferSelect;
export type ForumReply = typeof forumRepliesTable.$inferSelect;
