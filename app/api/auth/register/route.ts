// app/api/auth/register/route.ts
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const data = schema.parse(body);

  const exists = (await db.select().from(users).where(eq(users.email, data.email)).limit(1))[0];
  if (exists) return new Response("Email already used", { status: 409 });

  const passwordHash = await bcrypt.hash(data.password, 10);
  await db.insert(users).values({ name: data.name, email: data.email, passwordHash, role: "USER" });

  return new Response("OK", { status: 201 });
}
