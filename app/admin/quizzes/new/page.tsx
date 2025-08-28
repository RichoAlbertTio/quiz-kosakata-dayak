// app/admin/quizzes/new/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import QuizForm from "./QuizForm";

export const dynamic = "force-dynamic";

export default async function QuizNewPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories);
  return <QuizForm cats={cats} />;
}
