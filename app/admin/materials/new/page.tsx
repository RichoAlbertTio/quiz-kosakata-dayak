// app/admin/materials/new/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import Form from "./Form";

export const dynamic = "force-dynamic";

export default async function NewMaterialPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories);
  return <Form cats={cats} />;
}
