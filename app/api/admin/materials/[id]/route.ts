// app/api/admin/materials/[id]/route.ts
import { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

type CustomJWT = JWT & { id?: number; role?: "ADMIN" | "USER" };

const PatchBody = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  contentMd: z.string().min(1).optional(),
  categoryId: z.number().int().positive().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || token.role !== "ADMIN") return new Response("Forbidden", { status: 403 });
  const body = await req.json();
  const data = PatchBody.parse(body);
  await db
    .update(materials)
    .set({ ...data })
    .where(eq(materials.id, Number(params.id)));
  return new Response("OK");
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || token.role !== "ADMIN") return new Response("Forbidden", { status: 403 });
  await db.delete(materials).where(eq(materials.id, Number(params.id)));
  return new Response("OK");
}
