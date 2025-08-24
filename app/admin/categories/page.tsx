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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={create} className="flex gap-2">
            <Input name="name" placeholder="Nama kategori" />
            <Button type="submit">Simpan</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.length === 0 ? (
            <div className="text-sm opacity-70">Belum ada kategori.</div>
          ) : (
            list.map((c) => (
              <form key={c.id} action={remove} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs opacity-70">/{c.slug}</div>
                </div>
                <input type="hidden" name="id" value={c.id} />
                <Button type="submit" variant="destructive">
                  Hapus
                </Button>
              </form>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
