import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const contentTable = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("beginner"),
  readTime: integer("read_time").notNull().default(5),
  contentUrl: varchar("content_url", { length: 500 }),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Content = typeof contentTable.$inferSelect;
