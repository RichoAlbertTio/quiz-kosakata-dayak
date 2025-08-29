// app/admin/quizzes/[id]/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { quizzes, questions, choices, categories } from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import Form from "./Form";

export const dynamic = "force-dynamic";

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const { id: paramId } = await params;
  const id = Number(paramId);
  const quiz = (await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1))[0];
  if (!quiz) return <div className="p-6">Kuis tidak ditemukan.</div>;

  const qs = await db.select().from(questions).where(eq(questions.quizId, id)).orderBy(asc(questions.order));
  const qIds = qs.map((q) => q.id);
  const allChoices = qIds.length ? await db.select().from(choices).where(inArray(choices.questionId, qIds)) : [];

  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories);

  const packed = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description ?? "",
    categoryId: quiz.categoryId ?? 1, // Default to category 1 if null
    published: quiz.published,
    questions: qs.map((q) => ({
      prompt: q.prompt,
      explain: q.explain ?? "",
      order: q.order,
      choices: allChoices.filter((c) => c.questionId === q.id).map((c) => ({ text: c.text, isCorrect: c.isCorrect })),
    })),
  };

  return <Form cats={cats} initial={packed} quizId={id} />;
}
