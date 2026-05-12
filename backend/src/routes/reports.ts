import { Router, type IRouter } from "express";
import { db } from "../db/index.js";
import { reportsTable } from "../db/schema/index.js";
import { desc } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const createReportSchema = z.object({
  title:        z.string().min(1),
  description:  z.string().min(1),
  type:         z.enum(["phishing", "scam", "malware", "identity_theft", "other"]),
  url:          z.string().optional(),
  contactEmail: z.string().email().optional(),
});

// GET /api/reports
router.get("/", async (_req, res) => {
  const reports = await db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.reportedAt));
  res.json(reports);
});

// POST /api/reports
router.post("/", async (req, res) => {
  const parsed = createReportSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }
  const userId = (req.session as any)?.userId;
  const [report] = await db
    .insert(reportsTable)
    .values({ ...parsed.data, reportedBy: userId, status: "pending" })
    .returning();
  res.status(201).json(report);
});

export default router;
