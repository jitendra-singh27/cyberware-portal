import { Router, type IRouter } from "express";
import { db } from "../db/index.js";
import { quizzesTable, quizQuestionsTable, quizAttemptsTable } from "../db/schema/index.js";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

// GET /api/quizzes
router.get("/", async (_req, res) => {
  const quizzes = await db.select().from(quizzesTable);
  const result = await Promise.all(
    quizzes.map(async (q) => {
      const [{ cnt }] = await db
        .select({ cnt: sql<number>`count(*)::int` })
        .from(quizQuestionsTable)
        .where(eq(quizQuestionsTable.quizId, q.id));
      return { ...q, questionCount: cnt };
    })
  );
  res.json(result);
});

// GET /api/quizzes/:id  — questions WITHOUT correctAnswer
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, id)).limit(1);
  if (!quiz) {
    res.status(404).json({ error: "Not found", message: "Quiz not found" });
    return;
  }

  const questions = await db
    .select({
      id:      quizQuestionsTable.id,
      question:quizQuestionsTable.question,
      optionA: quizQuestionsTable.optionA,
      optionB: quizQuestionsTable.optionB,
      optionC: quizQuestionsTable.optionC,
      optionD: quizQuestionsTable.optionD,
    })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, id));

  res.json({ ...quiz, questions });
});

const submitSchema = z.object({
  answers: z.array(
    z.object({ questionId: z.number(), answer: z.enum(["A", "B", "C", "D"]) })
  ),
});

// POST /api/quizzes/:id/submit
router.post("/:id/submit", async (req, res) => {
  const quizId = Number(req.params.id);
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, quizId));

  let score = 0;
  for (const ans of parsed.data.answers) {
    const q = questions.find((q) => q.id === ans.questionId);
    if (q && q.correctAnswer === ans.answer) score++;
  }

  const total      = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed     = percentage >= 60;

  const userId = (req.session as any)?.userId;
  await db.insert(quizAttemptsTable).values({ quizId, userId, score, total, passed });

  let feedback = "";
  if      (percentage >= 90) feedback = "Excellent! You have outstanding cybersecurity knowledge.";
  else if (percentage >= 75) feedback = "Great job! You have a strong understanding of cybersecurity.";
  else if (percentage >= 60) feedback = "Good work! You passed. Keep learning to improve further.";
  else                       feedback = "Keep studying! Review the learning modules and try again.";

  res.json({ score, total, percentage, passed, feedback });
});

export default router;
