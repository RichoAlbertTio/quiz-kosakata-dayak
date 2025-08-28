// app/api/admin/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizzes, questions, choices } from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ChoiceZ = z.object({ text: z.string().min(1), isCorrect: z.boolean().default(false) });
const QuestionZ = z.object({
  prompt: z.string().min(1),
  explain: z.string().optional(),
  order: z.number().int().min(1),
  choices: z.array(ChoiceZ).min(2),
});
const BodyZ = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.number().int().positive(),
  published: z.boolean().default(true),
  questions: z.array(QuestionZ).min(1),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
  const { id: paramId } = await params;
  const id = Number(paramId);
  if (!Number.isFinite(id)) return new Response("Invalid id", { status: 400 });

  const quiz = (await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1))[0];
  if (!quiz) return new Response("Not found", { status: 404 });

  const qs = await db.select().from(questions).where(eq(questions.quizId, id)).orderBy(asc(questions.order));
  const qIds = qs.map((q) => q.id);
  const allChoices = qIds.length ? await db.select().from(choices).where(inArray(choices.questionId, qIds)) : [];

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    categoryId: quiz.categoryId,
    published: quiz.published,
    questions: qs.map((q) => ({
      prompt: q.prompt,
      explain: q.explain ?? undefined,
      order: q.order,
      choices: allChoices.filter((c) => c.questionId === q.id).map((c) => ({ text: c.text, isCorrect: c.isCorrect })),
    })),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
  const { id: paramId } = await params;
  const id = Number(paramId);
  if (!Number.isFinite(id)) return new Response("Invalid id", { status: 400 });

  const data = BodyZ.parse(await req.json());
  for (const q of data.questions) {
    const correctCount = q.choices.filter((c) => c.isCorrect).length;
    if (correctCount !== 1) return new Response("Each question must have exactly 1 correct choice", { status: 400 });
  }

  await db.transaction(async (tx) => {
    await tx.update(quizzes).set({ title: data.title, description: data.description, categoryId: data.categoryId, published: data.published }).where(eq(quizzes.id, id));

    // Replace all questions (and their choices) for simplicity
    await tx.delete(questions).where(eq(questions.quizId, id));

    for (const q of data.questions) {
      const [qRow] = await tx.insert(questions).values({ quizId: id, prompt: q.prompt, explain: q.explain, order: q.order }).returning();
      await tx.insert(choices).values(q.choices.map((c) => ({ questionId: qRow.id, text: c.text, isCorrect: c.isCorrect })));
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
  const { id: paramId } = await params;
  const id = Number(paramId);
  if (!Number.isFinite(id)) return new Response("Invalid id", { status: 400 });

  await db.delete(quizzes).where(eq(quizzes.id, id));
  return NextResponse.json({ ok: true });
}
