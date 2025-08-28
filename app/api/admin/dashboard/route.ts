import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, materials, quizzes } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    // Check if user is admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts from database
    const [userCount, materialCount, quizCount] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(materials).where(eq(materials.published, true)),
      db.select({ count: count() }).from(quizzes).where(eq(quizzes.published, true)),
    ]);

    const stats = {
      totalUsers: userCount[0]?.count || 0,
      activeMaterials: materialCount[0]?.count || 0,
      availableQuizzes: quizCount[0]?.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
