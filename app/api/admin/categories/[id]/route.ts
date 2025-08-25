// app/api/admin/categories/[id]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  await db.delete(categories).where(eq(categories.id, Number(params.id)));
  return new Response("OK");
}
