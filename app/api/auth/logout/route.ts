// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const defaultName = process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token";
  const cookieName = process.env.NEXTAUTH_COOKIE_NAME || defaultName;
  const allNames = ["next-auth.session-token", "__Secure-next-auth.session-token"]; // cleanup both
  for (const name of allNames) {
    try {
      res.cookies.delete(name);
    } catch {}
  }
  // Ensure the main cookie is gone
  try {
    res.cookies.delete(cookieName);
  } catch {}
  return res;
}

export async function GET() {
  return POST();
}
