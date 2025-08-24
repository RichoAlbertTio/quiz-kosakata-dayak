// app/admin/quizzes/page.tsx
import { db } from "@/lib/db";
import { quizzes, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
  // List all quizzes with category name
  const rows = await db.select({ id: quizzes.id, title: quizzes.title, published: quizzes.published, createdAt: quizzes.createdAt, categoryId: quizzes.categoryId }).from(quizzes);

  // Get category names in one query (simple approach; could join but keep types simple)
  const catIds = Array.from(new Set(rows.map((r) => r.categoryId)));
  const cats = catIds.length ? await db.select({ id: categories.id, name: categories.name }).from(categories).where(eq(categories.id, catIds[0])) : [];
  // If multiple categories, fetch them all individually
  if (catIds.length > 1) {
    for (let i = 1; i < catIds.length; i++) {
      const c = (await db.select({ id: categories.id, name: categories.name }).from(categories).where(eq(categories.id, catIds[i])))[0];
      if (c) cats.push(c);
    }
  }
  const catMap = new Map(cats.map((c) => [c.id, c.name] as const));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Kuis</h1>
          <p className="text-sm opacity-70">Kelola semua kuis.</p>
        </div>
        <Button asChild>
          <Link href="/admin/quizzes/new">+ Kuis Baru</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.title}</TableCell>
                <TableCell>{catMap.get(q.categoryId) ?? q.categoryId}</TableCell>
                <TableCell>{q.published ? "Ya" : "Tidak"}</TableCell>
                <TableCell>{new Date(q.createdAt!).toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/quizzes/${q.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
