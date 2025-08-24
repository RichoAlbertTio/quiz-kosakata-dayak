// app/materials/[slug]/page.tsx
import { db } from "@/lib/db";
import { materials, categories, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-dynamic";

export default async function MaterialDetail({ params }: { params: { slug: string } }) {
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
      .where(eq(materials.slug, params.slug))
      .limit(1)
  )[0];

  if (!row || !row.published) {
    return <div className="max-w-3xl mx-auto p-6">Materi tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{row.title}</h1>
      <div className="text-sm opacity-70">
        Kategori: {row.catName ?? "-"} • Penulis: {row.authorName ?? "-"}
      </div>
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{row.contentMd}</ReactMarkdown>
      </article>
    </div>
  );
}
