// app/play/quiz/[id]/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { quizzes, questions, choices, quizAttempts } from "@/lib/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";
import QuizPlayer from "./QuizPlayer";

export const dynamic = "force-dynamic";

function shuffle<T>(arr: T[]) {
  return arr
    .map((v) => [Math.random(), v] as const)
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export default async function QuizPlayPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resolvedParams = await params;
  const quizId = parseInt(resolvedParams.id);

  // Check if user has already completed this quiz
  const existingAttempt = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, session.user.id), eq(quizAttempts.quizId, quizId)))
    .limit(1);

  if (existingAttempt.length > 0) {
    // User has already completed this quiz, redirect to quiz list
    redirect("/quiz?message=already-completed");
  }

  // Get quiz data
  const quiz = (
    await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.published, true)))
      .limit(1)
  )[0];

  if (!quiz) {
    redirect("/quiz?message=not-found");
  }

  // Get questions and choices
  const qs = await db.select().from(questions).where(eq(questions.quizId, quizId)).orderBy(asc(questions.order));
  const qIds = qs.map((q) => q.id);
  const allChoices = qIds.length ? await db.select().from(choices).where(inArray(choices.questionId, qIds)) : [];

  // Prepare quiz data for client component
  const quizData = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || "",
    questions: qs.map((q) => {
      const questionChoices = shuffle(allChoices.filter((ch) => ch.questionId === q.id));
      return {
        id: q.id,
        question: q.prompt,
        options: questionChoices.map((choice, index) => ({
          id: choice.id,
          text: choice.text,
          index: index,
        })),
        correctAnswer: 0, // This will be handled during submission
      };
    }),
  };

  return <QuizPlayer quiz={quizData} />;
}
