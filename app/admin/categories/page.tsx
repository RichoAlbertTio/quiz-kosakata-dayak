// app/admin/categories/page.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const list = await db.select().from(categories).orderBy(categories.createdAt);

  async function create(formData: FormData) {
    "use server";
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
    const name = String(formData.get("name") || "").trim();
    if (!name) throw new Error("Nama wajib");
    await db
      .insert(categories)
      .values({ name, slug: toSlug(name) })
      .onConflictDoNothing();
  }

  async function remove(formData: FormData) {
    "use server";
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
    const id = Number(formData.get("id"));
    await db.delete(categories).where(eq(categories.id, id));
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Manajemen Kategori
          </h1>
          <p className="text-gray-600">Kelola kategori untuk mengorganisir konten dengan lebih baik</p>
        </div>

        {/* Create Category Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <CardTitle className="text-white flex items-center text-xl">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buat Kategori Baru
            </CardTitle>
          </div>
          <CardContent className="p-6">
            <form action={create} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  name="name" 
                  placeholder="Masukkan nama kategori..." 
                  className="h-12 text-lg border-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <CardTitle className="text-white flex items-center justify-between text-xl">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Daftar Kategori
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {list.length} kategori
              </span>
            </CardTitle>
          </div>
          <CardContent className="p-6">
            {list.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum ada kategori</h3>
                <p className="text-gray-500">Mulai dengan membuat kategori pertama Anda di atas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {list.map((c, index) => (
                  <form key={c.id} action={remove} className="group">
                    <div className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 text-lg">{c.name}</div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                /{c.slug}
                              </div>
                            </div>
                          </div>
                        </div>
                        <input type="hidden" name="id" value={c.id} />
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
                  </form>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        {list.length > 0 && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-600 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Total Kategori</h3>
                  <p className="text-purple-100">Kategori yang telah dibuat</p>
                </div>
                <div className="text-4xl font-bold">{list.length}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}