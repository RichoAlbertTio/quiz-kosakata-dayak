// app/materials/page.tsx
import { db } from "@/lib/db";
import { materials, categories } from "@/lib/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

function Search({ q }: { q?: string }) {
  return (
    <form action="/materials" method="GET" className="max-w-sm">
      <Input name="q" placeholder="Cari materi..." defaultValue={q ?? ""} />
    </form>
  );
}

export default async function MaterialsPage({ searchParams }: { searchParams?: Promise<{ q?: string; cat?: string }> }) {
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
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Materi</h1>
      <Search q={q} />

      <div className="flex gap-2 flex-wrap">
        <Link href="/materials" className={`px-3 py-1 border rounded ${!cat ? "bg-black text-white" : ""}`}>
          Semua
        </Link>
        {cats.map((c) => (
          <Link key={c.id} href={`/materials?cat=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={`px-3 py-1 border rounded ${cat === c.slug ? "bg-black text-white" : ""}`}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-3 mt-4">
        {rows.length === 0 ? (
          <div className="text-sm opacity-70">Belum ada materi.</div>
        ) : (
          rows.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={`/materials/${m.slug}`}>{m.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm opacity-75">Kategori: {m.category ?? "-"}</CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
