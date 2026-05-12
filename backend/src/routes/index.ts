import { Router, type IRouter } from "express";
import authRouter    from "./auth.js";
import contentRouter from "./content.js";
import quizRouter    from "./quiz.js";
import newsRouter    from "./news.js";
import reportsRouter from "./reports.js";
import forumRouter   from "./forum.js";
import adminRouter   from "./admin.js";

const router: IRouter = Router();

// Health check
router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth",    authRouter);
router.use("/content", contentRouter);
router.use("/quizzes", quizRouter);
router.use("/news",    newsRouter);
router.use("/reports", reportsRouter);
router.use("/forum",   forumRouter);
router.use("/admin",   adminRouter);

export default router;
