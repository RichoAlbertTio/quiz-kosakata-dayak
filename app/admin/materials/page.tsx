// app/admin/materials/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { materials, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const rows = await db
    .select({
      id: materials.id,
      title: materials.title,
      slug: materials.slug,
      published: materials.published,
      cat: categories.name,
    })
    .from(materials)
    .leftJoin(categories, eq(categories.id, materials.categoryId));

  async function remove(formData: FormData) {
    "use server";
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
    const id = Number(formData.get("id"));
    await db.delete(materials).where(eq(materials.id, id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                Manajemen Materi
              </h1>
              <p className="text-gray-600">Kelola semua materi pembelajaran dan konten edukasi</p>
            </div>
            <Link 
              href="/admin/materials/new" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buat Materi Baru
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materi</p>
                <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{rows.filter(m => m.published).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{rows.filter(m => !m.published).length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Daftar Materi
              </h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-white">
                {rows.length} materi
              </span>
            </div>
          </div>

          <div className="p-6">
            {rows.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum ada materi</h3>
                <p className="text-gray-500 mb-6">Mulai dengan membuat materi pembelajaran pertama Anda.</p>
                <Link 
                  href="/admin/materials/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Buat Materi Pertama
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {rows.map((m, index) => (
                  <form key={m.id} action={remove} className="group">
                    <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Material Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                                {m.title}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  /{m.slug}
                                </div>
                                
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  <span className="text-blue-600 font-medium">{m.cat ?? "Tanpa Kategori"}</span>
                                </div>
                                
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  m.published 
                                    ? "bg-green-100 text-green-800 border border-green-200" 
                                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                }`}>
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    m.published ? "bg-green-500" : "bg-yellow-500"
                                  }`}></div>
                                  {m.published ? "Published" : "Draft"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Link 
                            href={`/materials/${m.slug}`}
                            className="inline-flex items-center px-4 py-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Lihat
                          </Link>
                          
                          <input type="hidden" name="id" value={m.id} />
                          <Button 
                            type="submit" 
                            variant="destructive"
                            className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}