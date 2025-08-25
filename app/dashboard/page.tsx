import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?reason=user");
  if (session.user.role === "ADMIN") redirect("/admin");

  const displayName = session.user.name ?? session.user.email ?? "Pengguna";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Dayak
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="text-blue-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/materials" className="hover:text-blue-600 transition-colors">
                Materi
              </Link>
              <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
                Leaderboard
              </Link>
              <Link href="/quiz" className="hover:text-blue-600 transition-colors">
                Kuis
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-70 hidden sm:inline font-medium">{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Pengguna
              </h1>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/20">
              <p className="text-xl text-slate-600">
                Selamat datang, <span className="font-semibold text-blue-600">{displayName}</span> 👋
              </p>
              <p className="text-slate-500 mt-2">
                Mari mulai perjalanan belajar Bahasa Dayak yang menyenangkan!
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-2xl font-bold text-green-600 mb-1">Materi</div>
                <div className="text-sm text-green-700">Belajar bahasa Dayak</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-orange-600 mb-1">Ranking</div>
                <div className="text-sm text-orange-700">Lihat pencapaianmu</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">🧩</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">Kuis</div>
                <div className="text-sm text-purple-700">Uji pemahamanmu</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Navigation Cards */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Pilih Aktivitas</h2>
              <p className="text-slate-500">Mulai perjalanan belajarmu dari sini</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <li>
                <Link 
                  className="group block rounded-2xl border-2 border-green-200 p-6 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100" 
                  href="/materials"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-green-700">Materi</div>
                      <div className="text-green-600">Lanjut belajar materi.</div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600 group-hover:text-green-700">
                    <span className="text-sm font-medium">Mulai Belajar</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </li>

              <li>
                <Link 
                  className="group block rounded-2xl border-2 border-orange-200 p-6 hover:border-orange-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-orange-50 to-yellow-100" 
                  href="/leaderboard"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-orange-700">Leaderboard</div>
                      <div className="text-orange-600">Lihat peringkat peserta.</div>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-600 group-hover:text-orange-700">
                    <span className="text-sm font-medium">Lihat Ranking</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </li>

              <li>
                <Link 
                  className="group block rounded-2xl border-2 border-purple-200 p-6 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100" 
                  href="/quiz"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-purple-700">Kuis</div>
                      <div className="text-purple-600">Pilih dan kerjakan kuis.</div>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                    <span className="text-sm font-medium">Mulai Kuis</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Motivational Quote */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">💫</div>
              <blockquote className="text-xl font-medium mb-4">
                "Bahasa adalah jendela budaya. Belajar bahasa Dayak berarti membuka pintu kearifan leluhur."
              </blockquote>
              <div className="text-blue-100">- Tim Quiz Dayak</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}