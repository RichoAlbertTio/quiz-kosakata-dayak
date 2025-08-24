// app/api/auth/me/route.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  // Rebuild a NextRequest with cookies from the original request
  const headers = new Headers(req.headers);
  const nextReq = new NextRequest(new URL("/api/auth/me", process.env.NEXT_PUBLIC_URL_DOMAIN || "http://localhost:3000").toString(), { headers });
  const token = await getToken({ req: nextReq, secret });
  return NextResponse.json({ token });
}
