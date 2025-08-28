// app/leaderboard/page.tsx
import { db } from "@/lib/db";
import { quizAttempts, users, quizzes } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function fmtDate(d: string | Date) {
  const dd = new Date(d);
  return dd.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRankIcon(position: number) {
  switch (position) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return null;
  }
}

function getScorePercentage(score: number, total: number) {
  return Math.round((score / total) * 100);
}

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const displayName = session.user.name || session.user.email || "Pengguna";
  const isAdmin = session.user.role === "ADMIN";

  const rows = await db
    .select({
      id: quizAttempts.id,
      score: quizAttempts.score,
      total: quizAttempts.total,
      durationS: quizAttempts.durationS,
      createdAt: quizAttempts.createdAt,
      userName: users.name,
      userEmail: users.email,
      userRole: users.role,
      quizTitle: quizzes.title,
    })
    .from(quizAttempts)
    .innerJoin(users, eq(users.id, quizAttempts.userId))
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .orderBy(
      desc(quizAttempts.score), // skor tertinggi dulu
      asc(quizAttempts.durationS), // waktu paling cepat
      desc(quizAttempts.createdAt) // terbaru
    )
    .limit(10);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="font-bold text-xl tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {isAdmin ? "Dayak Quiz" : "Dayak Quiz"}
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
                  <Link href="/leaderboard" className="text-blue-600 font-semibold">
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
                  <Link href="/leaderboard" className="text-blue-600 font-semibold">
                    Leaderboard
                  </Link>
                  <Link href="/quiz" className="hover:text-blue-600 transition-colors">
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
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Leaderboard
              </h1>
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 3l-14 9 14 9V3z" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Kompetisi seru antar peserta! Lihat siapa yang berhasil meraih skor tertinggi dengan waktu tercepat.
            </p>
          </div>

          {/* Top 3 Podium */}
          {rows.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 2nd Place */}
              <Card className="transform hover:scale-105 transition-all duration-300 border-2 border-slate-200 shadow-lg">
                <CardHeader className="text-center pb-3">
                  <div className="text-6xl mb-2">🥈</div>
                  <CardTitle className="text-lg">{rows[1]?.userName || rows[1]?.userEmail}</CardTitle>
                  <CardDescription className="font-medium">{rows[1]?.quizTitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-slate-600 mb-2">
                    {rows[1]?.score}/{rows[1]?.total}
                  </div>
                  <div className="text-sm text-slate-500">
                    {fmtDuration(rows[1]?.durationS || 0)} • {fmtDate(rows[1]?.createdAt as unknown as string)}
                  </div>
                </CardContent>
              </Card>

              {/* 1st Place */}
              <Card className="transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50 md:-mt-4">
                <CardHeader className="text-center pb-3">
                  <div className="text-8xl mb-2">🥇</div>
                  <CardTitle className="text-xl text-yellow-700">{rows[0]?.userName || rows[0]?.userEmail}</CardTitle>
                  <CardDescription className="font-semibold text-yellow-600">{rows[0]?.quizTitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {rows[0]?.score}/{rows[0]?.total}
                  </div>
                  <div className="text-sm text-yellow-600">
                    {fmtDuration(rows[0]?.durationS || 0)} • {fmtDate(rows[0]?.createdAt as unknown as string)}
                  </div>
                </CardContent>
              </Card>

              {/* 3rd Place */}
              <Card className="transform hover:scale-105 transition-all duration-300 border-2 border-amber-200 shadow-lg">
                <CardHeader className="text-center pb-3">
                  <div className="text-6xl mb-2">🥉</div>
                  <CardTitle className="text-lg">{rows[2]?.userName || rows[2]?.userEmail}</CardTitle>
                  <CardDescription className="font-medium">{rows[2]?.quizTitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {rows[2]?.score}/{rows[2]?.total}
                  </div>
                  <div className="text-sm text-amber-600">
                    {fmtDuration(rows[2]?.durationS || 0)} • {fmtDate(rows[2]?.createdAt as unknown as string)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="text-2xl font-bold text-center">
                🏆 Rangking Lengkap
              </CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Top 10 skor terbaru di semua kuis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b-2">
                      <TableHead className="font-bold text-slate-700 text-center w-16">#</TableHead>
                      <TableHead className="font-bold text-slate-700">Nama</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Role</TableHead>
                      <TableHead className="font-bold text-slate-700">Kuis</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Skor</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">%</TableHead>
                      <TableHead className="font-bold text-slate-700 text-center">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl opacity-50">📊</div>
                            <div className="text-xl font-semibold text-slate-600">Belum ada data</div>
                            <p className="text-slate-500">Ayo kerjakan kuis pertama kamu dan raih posisi #1!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((r, i) => (
                        <TableRow 
                          key={r.id} 
                          className={`hover:bg-slate-50 transition-colors ${
                            i < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-orange-50/30' : ''
                          }`}
                        >
                          <TableCell className="text-center font-bold">
                            <div className="flex items-center justify-center gap-2">
                              {getRankIcon(i + 1) && (
                                <span className="text-2xl">{getRankIcon(i + 1)}</span>
                              )}
                              <span className={`text-lg ${i < 3 ? 'text-yellow-600 font-bold' : 'text-slate-600'}`}>
                                {i + 1}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                i === 0 ? 'bg-yellow-400' : 
                                i === 1 ? 'bg-slate-400' : 
                                i === 2 ? 'bg-amber-600' : 'bg-blue-400'
                              }`}></div>
                              {r.userName || r.userEmail}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={r.userRole === "ADMIN" ? "destructive" : "secondary"} className="font-medium">
                              {r.userRole}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-700">{r.quizTitle}</TableCell>
                          <TableCell className="text-center">
                            <div className="font-bold text-lg text-blue-600">
                              {r.score}<span className="text-sm text-slate-500">/{r.total}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`font-bold ${
                              getScorePercentage(r.score, r.total) >= 80 ? 'text-green-600' :
                              getScorePercentage(r.score, r.total) >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {getScorePercentage(r.score, r.total)}%
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center text-sm text-slate-600">
                            {fmtDate(r.createdAt as unknown as string)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          {rows.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
              <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{rows.length}</div>
                  <div className="text-sm font-medium text-blue-700">Total Peserta</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round(rows.reduce((acc, r) => acc + getScorePercentage(r.score, r.total), 0) / rows.length)}%
                  </div>
                  <div className="text-sm font-medium text-green-700">Rata-rata Skor</div>
                </CardContent>
              </Card>
             
            </div>
          )}
        </div>
      </main>
    </div>
  );
}