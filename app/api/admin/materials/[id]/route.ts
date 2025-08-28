// app/api/admin/materials/[id]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatchBody = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  contentMd: z.string().min(1).optional(),
  categoryId: z.number().int().positive().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }
  const body = await req.json();
  const data = PatchBody.parse(body);
  const { id } = await params;
  await db
    .update(materials)
    .set({ ...data })
    .where(eq(materials.id, Number(id)));
  return new Response("OK");
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }
  const { id } = await params;
  await db.delete(materials).where(eq(materials.id, Number(id)));
  return new Response("OK");
}
