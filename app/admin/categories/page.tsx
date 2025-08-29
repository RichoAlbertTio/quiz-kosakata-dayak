// app/admin/categories/page.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { toSlug } from "@/lib/slug";
import CategoriesClient from "./CategoriesClient";

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

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Manajemen Kategori</h1>
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
                <Input name="name" placeholder="Masukkan nama kategori..." className="h-12 text-lg border-2 focus:border-green-500 focus:ring-green-500" />
              </div>
              <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List - Client Component */}
        <CategoriesClient initialCategories={list} />
      </div>
    </div>
  );
}
