// app/api/auth/login/route.ts
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return new Response("Invalid", { status: 400 });

  const user = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
  if (!user) return new Response("Invalid credentials", { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return new Response("Invalid credentials", { status: 401 });

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return new Response("Server misconfigured", { status: 500 });

  // Build a token compatible with next-auth/jwt getToken usage elsewhere
  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(String(user.id))
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));

  const res = NextResponse.json({ role: user.role });

  // Detect protocol/host to decide secure cookies
  const url = new URL(req.url);
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const isHttps = (forwardedProto ?? url.protocol.replace(":", "")).toLowerCase() === "https";

  // Always set standard cookie (works on http and https)
  res.cookies.set({
    name: "next-auth.session-token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps, // secure only when https
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Additionally set __Secure- cookie only when HTTPS, browsers will ignore otherwise
  if (isHttps) {
    res.cookies.set({
      name: "__Secure-next-auth.session-token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return res;
}
