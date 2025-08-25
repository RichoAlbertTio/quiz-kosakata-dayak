// app/api/admin/materials/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  contentMd: z.string().min(1),
  categoryId: z.number().int().positive(),
  published: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }
  const uid = session.user.id;

  const body = await req.json();
  const data = Body.parse(body);

  await db.insert(materials).values({
    title: data.title,
    slug: data.slug,
    contentMd: data.contentMd,
    categoryId: data.categoryId,
    published: data.published,
    authorId: uid,
  });

  return new Response("OK", { status: 201 });
}
