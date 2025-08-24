import { db } from "@/lib/db";
import { quizzes, questions, choices } from "@/lib/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";

export const dynamic = "force-dynamic";

type CustomJWT = JWT & { id?: number; role?: "ADMIN" | "USER" };

const Q = z.object({ quizId: z.coerce.number().int().positive() });

function shuffle<T>(arr: T[]) {
  return arr
    .map((v) => [Math.random(), v] as const)
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export async function GET(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const { quizId } = Q.parse({ quizId: searchParams.get("quizId") });

  const quiz = (
    await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.published, true)))
      .limit(1)
  )[0];
  if (!quiz) return new Response("Not found", { status: 404 });

  const qs = await db.select().from(questions).where(eq(questions.quizId, quizId)).orderBy(asc(questions.order));

  const qIds = qs.map((q) => q.id);
  const allChoices = qIds.length ? await db.select().from(choices).where(inArray(choices.questionId, qIds)) : [];

  const packed = qs.map((q) => {
    const c = shuffle(allChoices.filter((ch) => ch.questionId === q.id)).map((it) => ({
      id: it.id,
      text: it.text, // penting: JANGAN kirim isCorrect
    }));
    return { id: q.id, prompt: q.prompt, choices: c };
  });

  return Response.json({
    quiz: { id: quiz.id, title: quiz.title, description: quiz.description },
    questions: packed,
  });
}
