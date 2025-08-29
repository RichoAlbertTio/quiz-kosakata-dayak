// app/api/admin/categories/[id]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return new Response("Nama kategori wajib diisi", { status: 400 });
    }

    const updatedCategory = await db
      .update(categories)
      .set({
        name: name.trim(),
        slug: toSlug(name.trim()),
      })
      .where(eq(categories.id, Number(id)))
      .returning();

    if (updatedCategory.length === 0) {
      return new Response("Kategori tidak ditemukan", { status: 404 });
    }

    return Response.json(updatedCategory[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  await db.delete(categories).where(eq(categories.id, Number(id)));
  return new Response("OK");
}
