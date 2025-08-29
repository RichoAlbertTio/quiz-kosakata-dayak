import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizAttempts, quizAnswers, questions, choices } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Payload = z.object({
  quizId: z.number().int().positive(),
  choiceIds: z.array(z.number().nullable()).min(1), // Array of choice IDs (can be null for unanswered)
});

export async function POST(req: NextRequest) {
  // Get authenticated user
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const data = Payload.parse(body);
  const uid = session.user.id;

  // Ambil semua pertanyaan & choices untuk quiz ini
  const qs = await db.select().from(questions).where(eq(questions.quizId, data.quizId));
  const qIds = qs.map((q) => q.id);

  if (qIds.length !== data.choiceIds.length) {
    return new Response("Answer count mismatch", { status: 400 });
  }

  const allChoices = qIds.length ? await db.select().from(choices).where(inArray(choices.questionId, qIds)) : [];

  // Create a map of choices by ID for quick lookup
  const choiceMap = new Map(allChoices.map(choice => [choice.id, choice]));

  let score = 0;
  const rows = qs.map((q, index) => {
    const userChoiceId = data.choiceIds[index];
    let isCorrect = false;
    let choiceId = 0;

    if (userChoiceId !== null) {
      const selectedChoice = choiceMap.get(userChoiceId);
      if (selectedChoice && selectedChoice.questionId === q.id) {
        choiceId = selectedChoice.id;
        isCorrect = selectedChoice.isCorrect;
        if (isCorrect) score++;
      }
    }

    return {
      questionId: q.id,
      choiceId,
      isCorrect,
    };
  });

  const attempt = (
    await db
      .insert(quizAttempts)
      .values({
        userId: uid,
        quizId: data.quizId,
        score,
        total: qs.length,
        durationS: 0, // Default duration for testing
      })
      .returning()
  )[0];

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
