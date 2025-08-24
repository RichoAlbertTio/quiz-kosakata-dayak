// app/api/admin/quizzes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { quizzes, questions, choices } from "@/lib/db/schema";
import { z } from "zod";

export const dynamic = "force-dynamic";

type CustomJWT = JWT & { id?: number; role?: "ADMIN" | "USER" };

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

export async function POST(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || token.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const data = BodyZ.parse(await req.json());

  // Basic validation: exactly one correct per question
  for (const q of data.questions) {
    const correctCount = q.choices.filter((c) => c.isCorrect).length;
    if (correctCount !== 1) {
      return new Response("Each question must have exactly 1 correct choice", { status: 400 });
    }
  }

  const [quiz] = await db
    .insert(quizzes)
    .values({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      authorId: token.id!,
      published: data.published,
    })
    .returning();

  for (const q of data.questions) {
    const [qRow] = await db.insert(questions).values({ quizId: quiz.id, prompt: q.prompt, explain: q.explain, order: q.order }).returning();
    await db.insert(choices).values(q.choices.map((c) => ({ questionId: qRow.id, text: c.text, isCorrect: c.isCorrect })));
  }

  return NextResponse.json({ id: quiz.id });
}

export async function GET(req: NextRequest) {
  // Optional: list quizzes (admin only)
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || token.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const list = await db.select().from(quizzes);
  return NextResponse.json(list);
}
