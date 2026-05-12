import { Router, type IRouter } from "express";
import { db } from "../db/index.js";
import { newsTable } from "../db/schema/index.js";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/news?page=1&limit=10
router.get("/", async (req, res) => {
  const page   = Number(req.query.page)  || 1;
  const limit  = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const items = await db
    .select()
    .from(newsTable)
    .orderBy(desc(newsTable.publishedAt))
    .limit(limit)
    .offset(offset);

  res.json(items);
});

export default router;
