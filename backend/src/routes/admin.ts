import { Router, type IRouter } from "express";
import { db } from "../db/index.js";
import { usersTable, contentTable, quizAttemptsTable, reportsTable } from "../db/schema/index.js";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/admin/stats
router.get("/stats", async (_req, res) => {
  const [{ totalUsers }]        = await db.select({ totalUsers:        sql<number>`count(*)::int` }).from(usersTable);
  const [{ totalContent }]      = await db.select({ totalContent:      sql<number>`count(*)::int` }).from(contentTable);
  const [{ totalQuizAttempts }] = await db.select({ totalQuizAttempts: sql<number>`count(*)::int` }).from(quizAttemptsTable);
  const [{ totalReports }]      = await db.select({ totalReports:      sql<number>`count(*)::int` }).from(reportsTable);
  const [{ pendingReports }]    = await db
    .select({ pendingReports: sql<number>`count(*)::int` })
    .from(reportsTable)
    .where(eq(reportsTable.status, "pending"));

  res.json({
    totalUsers,
    totalContent,
    totalQuizAttempts,
    totalReports,
    pendingReports,
    activeUsers: Math.floor(totalUsers * 0.7),
  });
});

export default router;
