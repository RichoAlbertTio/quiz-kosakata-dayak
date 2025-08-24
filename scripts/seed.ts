import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, categories, quizzes, questions, choices } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  const [admin] = await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@lexi.local",
      passwordHash: hash,
      role: "ADMIN",
    })
    .onConflictDoNothing()
    .returning();

  const [hewan] = await db.insert(categories).values({ name: "Hewan", slug: "hewan" }).onConflictDoNothing().returning();

  const [quiz] = await db
    .insert(quizzes)
    .values({
      title: "Kuis Hewan Dasar",
      description: "Kosakata hewan (Dayak Ngaju)",
      categoryId: hewan!.id,
      authorId: admin!.id,
      published: true,
    })
    .returning();

  const [q1] = await db.insert(questions).values({ quizId: quiz.id, prompt: 'Apa arti "Asu"?', order: 1 }).returning();

  await db.insert(choices).values([
    { questionId: q1.id, text: "Anjing", isCorrect: true },
    { questionId: q1.id, text: "Ayam" },
    { questionId: q1.id, text: "Lebah" },
    { questionId: q1.id, text: "Buaya" },
  ]);

  console.log("Seed OK");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
