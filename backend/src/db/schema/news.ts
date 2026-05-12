import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const newsTable = pgTable("cybersecurity_news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  summary: text("summary").notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull().default("medium"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export type News = typeof newsTable.$inferSelect;
