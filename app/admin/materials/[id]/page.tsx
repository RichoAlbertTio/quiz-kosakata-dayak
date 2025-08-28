// app/admin/materials/[id]/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { materials, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditMaterialPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const id = Number(params.id);
  if (isNaN(id)) notFound();

  // Get material data
  const material = await db.select().from(materials).where(eq(materials.id, id)).limit(1);

  if (material.length === 0) notFound();

  // Get categories
  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories);

  return <EditForm material={material[0]} cats={cats} />;
}
