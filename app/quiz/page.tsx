// app/quiz/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { quizzes, quizAttempts, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function QuizListPage({ searchParams }: { searchParams?: Promise<{ message?: string; score?: string; total?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const message = params?.message;
  const score = params?.score;
  const total = params?.total;

  // Get all published quizzes with category info
  const allQuizzes = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      categoryName: categories.name,
    })
    .from(quizzes)
    .leftJoin(categories, eq(categories.id, quizzes.categoryId))
    .where(eq(quizzes.published, true));

  // Get completed quizzes for current user
  const completedQuizzes = await db.select({ quizId: quizAttempts.quizId }).from(quizAttempts).where(eq(quizAttempts.userId, session.user.id));

  const completedQuizIds = new Set(completedQuizzes.map((q) => q.quizId));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold tracking-tight">
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6">
        {/* Success/Error Messages */}
        {message === "completed" && score && total && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800">Kuis Berhasil Diselesaikan!</h3>
            <p className="text-green-700">
              Skor Anda: {score}/{total}
            </p>
          </div>
        )}
        {message === "already-completed" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800">Kuis Sudah Pernah Dikerjakan</h3>
            <p className="text-yellow-700">Anda sudah pernah menyelesaikan kuis ini sebelumnya.</p>
          </div>
        )}
        {message === "not-found" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-red-800">Kuis Tidak Ditemukan</h3>
            <p className="text-red-700">Kuis yang Anda cari tidak ditemukan atau tidak tersedia.</p>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Daftar Kuis</h1>
          <p className="text-gray-600">Pilih kuis yang ingin kamu kerjakan</p>
        </div>

        <div className="grid gap-4">
          {allQuizzes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Belum ada kuis tersedia</p>
              </CardContent>
            </Card>
          ) : (
            allQuizzes.map((quiz) => {
              const isCompleted = completedQuizIds.has(quiz.id);

              return (
                <Card key={quiz.id} className={`transition-all ${isCompleted ? "opacity-60" : "hover:shadow-md"}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{quiz.categoryName || "Umum"}</Badge>
                          {isCompleted && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Selesai
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {isCompleted ? (
                          <Button disabled variant="outline">
                            Sudah Dikerjakan
                          </Button>
                        ) : (
                          <Button asChild>
                            <Link href={`/play/quiz/${quiz.id}`}>Mulai Kuis</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
