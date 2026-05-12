import { Router, type IRouter } from "express";
import { db } from "../db/index.js";
import { contentTable } from "../db/schema/index.js";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const createContentSchema = z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  category:    z.string().min(1),
  difficulty:  z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  readTime:    z.number().int().positive(),
  contentUrl:  z.string().optional(),
});

// GET /api/content?category=phishing&page=1&limit=10
router.get("/", async (req, res) => {
  const page     = Number(req.query.page)  || 1;
  const limit    = Number(req.query.limit) || 10;
  const category = req.query.category as string | undefined;
  const offset   = (page - 1) * limit;

  let query = db.select().from(contentTable);
  if (category) {
    query = query.where(eq(contentTable.category, category)) as typeof query;
  }

  const items = await query.limit(limit).offset(offset);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contentTable);

  res.json({ items, total: count, page, limit });
});

// GET /api/content/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [item] = await db.select().from(contentTable).where(eq(contentTable.id, id)).limit(1);
  if (!item) {
    res.status(404).json({ error: "Not found", message: "Content not found" });
    return;
  }
  res.json(item);
});

// POST /api/content
router.post("/", async (req, res) => {
  const parsed = createContentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }
  const userId = (req.session as any)?.userId;
  const [item] = await db
    .insert(contentTable)
    .values({ ...parsed.data, createdBy: userId })
    .returning();
  res.status(201).json(item);
});

export default router;
