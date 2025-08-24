import { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { quizAttempts, quizAnswers, questions, choices } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

type CustomJWT = JWT & { id?: number; role?: "ADMIN" | "USER" };

const Payload = z.object({
  quizId: z.number().int().positive(),
  durationS: z.number().int().min(0),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        choiceId: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || !token.id) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const data = Payload.parse(body);
  const uid = Number(token.id);

  // Ambil semua pertanyaan & jawaban benar untuk quiz ini
  const qs = await db.select().from(questions).where(eq(questions.quizId, data.quizId));
  const qIds = qs.map((q) => q.id);

  // Validasi jawaban memang untuk quiz ini
  if (!data.answers.every((a) => qIds.includes(a.questionId))) {
    return new Response("Invalid question in answers", { status: 400 });
  }

  const allChoices = qIds.length ? await db.select().from(choices).where(inArray(choices.questionId, qIds)) : [];

  const correctByQ = new Map<number, number>(); // questionId -> correct choiceId
  for (const ch of allChoices) if (ch.isCorrect) correctByQ.set(ch.questionId, ch.id);

  let score = 0;
  const rows = data.answers.map((a) => {
    const ok = correctByQ.get(a.questionId) === a.choiceId;
    if (ok) score++;
    return { questionId: a.questionId, choiceId: a.choiceId, isCorrect: ok };
  });

  const attempt = (await db.insert(quizAttempts).values({ userId: uid, quizId: data.quizId, score, total: qs.length, durationS: data.durationS }).returning())[0];

  // simpan detail jawaban
  await db.insert(quizAnswers).values(
    rows.map((r) => ({
      attemptId: attempt.id,
      questionId: r.questionId,
      choiceId: r.choiceId,
      isCorrect: r.isCorrect,
    }))
  );

  return Response.json({ attemptId: attempt.id, score, total: qs.length });
}
