// app/api/admin/categories/[id]/route.ts
import { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type CustomJWT = JWT & { id?: number; role?: "ADMIN" | "USER" };

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const token = (await getToken({ req: _req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || token.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  await db.delete(categories).where(eq(categories.id, Number(params.id)));
  return new Response("OK");
}
