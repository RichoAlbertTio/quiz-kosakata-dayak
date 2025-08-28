import { db } from "@/lib/db";
import { materials, categories, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function fmtDate(d: string | Date) {
  const dd = new Date(d);
  return dd.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminMaterialView({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Pastikan hanya admin yang bisa mengakses
  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin) redirect("/materials");

  const { slug } = await params;
  const row = (
    await db
      .select({
        id: materials.id,
        title: materials.title,
        contentMd: materials.contentMd,
        createdAt: materials.createdAt,
        published: materials.published,
        catName: categories.name,
        authorName: users.name,
      })
      .from(materials)
      .leftJoin(categories, eq(categories.id, materials.categoryId))
      .leftJoin(users, eq(users.id, materials.authorId))
      .where(eq(materials.slug, slug))
      .limit(1)
  )[0];

  // Admin dapat mengakses semua materi (published dan draft)
  if (!row) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto text-center shadow-xl">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-slate-700 mb-2">Materi Tidak Ditemukan</h1>
            <p className="text-slate-500 mb-6">Materi dengan slug &quot;{slug}&quot; tidak ditemukan di database.</p>
            <Link href="/admin/materials">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Kembali ke Daftar Materi</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/admin/materials" className="hover:text-blue-600 transition-colors">
            Materi
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-blue-600 font-medium truncate">{row.title}</span>
        </nav>

        {/* Header Card */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-white py-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold mb-2">{row.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {row.catName ?? "Umum"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <Badge variant={row.published ? "default" : "destructive"} className={row.published ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}>
                      {row.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{row.authorName ?? "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fmtDate(row.createdAt as unknown as string)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-800 prose-pre:text-slate-200 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-blue-800">
              <ReactMarkdown>{row.contentMd}</ReactMarkdown>
            </article>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="bg-gradient-to-r from-slate-100 to-slate-200 border-slate-300">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-300 rounded-lg">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-800">Admin Preview</div>
                  <div className="text-sm text-slate-600">Anda sedang melihat materi sebagai admin</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/admin/materials">
                  <Button variant="outline" className="border-slate-400 hover:bg-slate-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar
                  </Button>
                </Link>
                <Link href={`/admin/materials/${row.id}`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Materi
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
