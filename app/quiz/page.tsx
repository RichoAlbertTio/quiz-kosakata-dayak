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

  const displayName = session.user.name || session.user.email || "Pengguna";
  const isAdmin = session.user.role === "ADMIN";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isAdmin ? "Admin" : "Quiz Dayak"}
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {isAdmin ? (
                <>
                  <Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/admin/categories" className="hover:text-blue-600 transition-colors">
                    Kategori
                  </Link>
                  <Link href="/admin/materials" className="hover:text-blue-600 transition-colors">
                    Materi
                  </Link>
                  <Link href="/admin/quizzes" className="hover:text-blue-600 transition-colors">
                    Kuis
                  </Link>
                  <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
                    Leaderboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/materials" className="hover:text-blue-600 transition-colors">
                    Materi
                  </Link>
                  <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
                    Leaderboard
                  </Link>
                  <Link href="/quiz" className="text-blue-600 font-semibold">
                    Kuis
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-70 hidden sm:inline font-medium">{displayName}</span>
            <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
              <Button variant="outline" size="sm" className="hover:bg-blue-50 border-blue-200">
                {isAdmin ? "Admin Panel" : "Dashboard"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Kuis Interaktif
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Uji pemahamanmu tentang Bahasa Dayak melalui kuis-kuis menarik yang telah kami siapkan
            </p>
          </div>

          {/* Success/Error Messages */}
          {message === "completed" && score && total && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-green-800 mb-1">🎉 Selamat! Kuis Berhasil Diselesaikan!</h3>
                    <p className="text-green-700 text-lg">
                      Skor Anda: <span className="font-bold text-xl">{score}/{total}</span> 
                      <span className="text-sm ml-2">({Math.round((parseInt(score) / parseInt(total)) * 100)}%)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {message === "already-completed" && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-yellow-800 mb-1">⚠️ Kuis Sudah Pernah Dikerjakan</h3>
                    <p className="text-yellow-700">Anda sudah pernah menyelesaikan kuis ini sebelumnya. Coba kuis lain yang tersedia!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {message === "not-found" && (
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-red-800 mb-1">❌ Kuis Tidak Ditemukan</h3>
                    <p className="text-red-700">Kuis yang Anda cari tidak ditemukan atau tidak tersedia saat ini.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">📝</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{allQuizzes.length}</div>
                <div className="text-sm font-medium text-blue-700">Total Kuis</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-600 mb-1">{completedQuizIds.size}</div>
                <div className="text-sm font-medium text-green-700">Kuis Selesai</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{allQuizzes.length - completedQuizIds.size}</div>
                <div className="text-sm font-medium text-purple-700">Belum Dikerjakan</div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz List Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Daftar Kuis Tersedia</h2>
              <p className="text-slate-500">Pilih kuis yang ingin kamu kerjakan dan uji pemahamanmu</p>
            </div>

            <div className="grid gap-6">
              {allQuizzes.length === 0 ? (
                <Card className="shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4 opacity-50">🧩</div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Belum Ada Kuis Tersedia</h3>
                    <p className="text-slate-500 mb-6">Kuis sedang dalam proses pengembangan. Silakan cek kembali nanti!</p>
                    <Link href="/materials">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Pelajari Materi Dulu
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                allQuizzes.map((quiz, index) => {
                  const isCompleted = completedQuizIds.has(quiz.id);

                  return (
                    <Card 
                      key={quiz.id} 
                      className={`group transition-all duration-300 shadow-lg border-0 ${
                        isCompleted 
                          ? "bg-gradient-to-r from-gray-50 to-gray-100 opacity-75" 
                          : "bg-white/80 backdrop-blur hover:shadow-2xl transform hover:scale-[1.02]"
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex gap-4 flex-1">
                            <div className={`p-3 rounded-xl ${
                              isCompleted 
                                ? "bg-gray-200" 
                                : "bg-gradient-to-br from-purple-100 to-blue-100 group-hover:scale-110 transition-transform"
                            }`}>
                              {isCompleted ? (
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className={`text-xl ${
                                  isCompleted ? "text-gray-600" : "text-slate-800 group-hover:text-purple-600"
                                } transition-colors`}>
                                  {quiz.title}
                                </CardTitle>
                                <div className="text-lg font-bold text-slate-400">
                                  #{String(index + 1).padStart(2, '0')}
                                </div>
                              </div>
                              <p className={`text-sm mb-4 ${
                                isCompleted ? "text-gray-500" : "text-slate-600"
                              }`}>
                                {quiz.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="secondary" 
                                  className={`${
                                    isCompleted 
                                      ? "bg-gray-200 text-gray-600" 
                                      : "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
                                  }`}
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {quiz.categoryName || "Umum"}
                                </Badge>
                                {isCompleted && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Selesai
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {isCompleted ? (
                              <Button disabled variant="outline" size="lg" className="bg-gray-100 text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Sudah Dikerjakan
                              </Button>
                            ) : (
                              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group-hover:scale-105 transition-transform">
                                <Link href={`/play/quiz/${quiz.id}`}>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Mulai Kuis
                                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
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
          </div>

          {/* Call to Action */}
          {allQuizzes.length > 0 && completedQuizIds.size < allQuizzes.length && (
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-2">Siap Untuk Tantangan?</h3>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                  Selesaikan semua kuis dan buktikan pemahamanmu tentang Bahasa Dayak. 
                  Jangan lupa cek leaderboard untuk melihat pencapaianmu!
                </p>
                <Link href="/leaderboard">
                  <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Lihat Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}