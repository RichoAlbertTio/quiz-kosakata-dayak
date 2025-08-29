// app/materials/page.tsx
import { db } from "@/lib/db";
import { materials, categories } from "@/lib/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function fmtDate(d: string | Date) {
  const dd = new Date(d);
  return dd.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function Search({ q }: { q?: string }) {
  return (
    <form action="/materials" method="GET" className="max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input name="q" placeholder="Cari materi..." defaultValue={q ?? ""} className="pl-10 bg-white/80 backdrop-blur border-slate-300 focus:border-blue-400 focus:ring-blue-400" />
      </div>
    </form>
  );
}

export default async function MaterialsPage({ searchParams }: { searchParams?: Promise<{ q?: string; cat?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const displayName = session.user.name || session.user.email || "Pengguna";
  const isAdmin = session.user.role === "ADMIN";

  const params = await searchParams;
  const q = params?.q?.trim() ?? "";
  const cat = params?.cat?.trim() ?? "";

  const where = [eq(materials.published, true)];
  if (q) where.push(ilike(materials.title, `%${q}%`));
  if (cat) where.push(eq(categories.slug, cat));

  const rows = await db
    .select({
      id: materials.id,
      title: materials.title,
      slug: materials.slug,
      createdAt: materials.createdAt,
      category: categories.name,
      catSlug: categories.slug,
    })
    .from(materials)
    .leftJoin(categories, eq(categories.id, materials.categoryId))
    .where(and(...where))
    .orderBy(materials.createdAt);

  const cats = await db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="font-bold text-xl tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {isAdmin ? "Admin" : "Dayak Quiz"}
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
                  <Link href="/admin/materials" className="text-blue-600 font-semibold">
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
                  <Link href="/materials" className="text-blue-600 font-semibold">
                    Materi
                  </Link>
                  <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
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
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Materi Pembelajaran</h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Jelajahi koleksi materi pembelajaran Bahasa Dayak yang tersedia untuk memperdalam pemahamanmu</p>
          </div>

          {/* Search and Filter Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                  <Search q={q} />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span>Filter:</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mt-4">
                <Link
                  href="/materials"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !cat ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  Semua Kategori
                </Link>
                {cats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/materials?cat=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      cat === c.slug ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              {q && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm">
                      Hasil pencarian untuk: <strong>&ldquo;{q}&rdquo;</strong>
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-700">{rows.length > 0 ? `Ditemukan ${rows.length} materi` : "Materi"}</h2>
              {rows.length > 0 && <div className="text-sm text-slate-500">Diurutkan berdasarkan tanggal terbaru</div>}
            </div>

            <div className="grid gap-4 md:gap-6">
              {rows.length === 0 ? (
                <Card className="shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4 opacity-50">📚</div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">{q ? "Tidak ada hasil yang ditemukan" : "Belum ada materi"}</h3>
                    <p className="text-slate-500 mb-6">{q ? `Coba gunakan kata kunci lain atau hapus filter pencarian.` : "Materi pembelajaran sedang dalam proses pengembangan."}</p>
                    {q && (
                      <Link href="/materials">
                        <Button variant="outline">Lihat Semua Materi</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                rows.map((m, index) => (
                  <Card key={m.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          <Link href={`/materials/${m.slug}`} className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              {m.title}
                              <div className="text-sm text-slate-500 font-normal mt-1">Dipublikasikan {fmtDate(m.createdAt as unknown as string)}</div>
                            </div>
                          </Link>
                        </CardTitle>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-400">#{String(index + 1).padStart(2, "0")}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {m.category ?? "Umum"}
                          </Badge>
                        </div>
                        <Link href={`/materials/${m.slug}`}>
                          <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 group-hover:scale-105 transition-transform">
                            Baca Materi
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Call to Action */}
          {!isAdmin && rows.length > 0 && (
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">Siap untuk tantangan?</h3>
                <p className="text-green-100 mb-6">Setelah mempelajari materi, uji pemahamanmu dengan mengerjakan kuis!</p>
                <Link href="/quiz">
                  <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                    Kerjakan Kuis Sekarang
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
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
