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
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Materials</h1>
        <Link href="/admin/materials/new" className="px-3 py-2 rounded bg-black text-white">
          + New
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-sm opacity-70">Belum ada materi.</div>
      ) : (
        <div className="grid gap-2">
          {rows.map((m) => (
            <form key={m.id} action={remove} className="flex items-center justify-between border p-2 rounded">
              <div>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs opacity-70">
                  /{m.slug} • {m.cat ?? "-"} • {m.published ? "Published" : "Draft"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/materials/${m.slug}`} className="px-3 py-1 border rounded">
                  Lihat
                </Link>
                <input type="hidden" name="id" value={m.id} />
                <Button type="submit" variant="destructive">
                  Hapus
                </Button>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
