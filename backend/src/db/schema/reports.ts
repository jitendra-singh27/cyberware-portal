import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const reportsTable = pgTable("suspicious_reports", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  url: varchar("url", { length: 500 }),
  contactEmail: varchar("contact_email", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  reportedBy: integer("reported_by"),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
});

export type Report = typeof reportsTable.$inferSelect;
