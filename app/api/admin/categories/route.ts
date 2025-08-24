// app/api/admin/categories/route.ts
import { NextRequest } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { z } from "zod";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

type CustomJWT = JWT & { id?: number; role?: "ADMIN" | "USER" };

export async function POST(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })) as CustomJWT | null;
  if (!token || token.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const data = z.object({ name: z.string().min(1) }).parse(await req.json());

  await db
    .insert(categories)
    .values({ name: data.name, slug: toSlug(data.name) })
    .onConflictDoNothing();

  return new Response("OK", { status: 201 });
}
