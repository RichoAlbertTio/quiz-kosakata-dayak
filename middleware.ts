import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

type Role = "ADMIN" | "USER";
interface TokenPayload extends JWTPayload {
  id?: number | string;
  role?: Role;
}

async function readRoleFromCookie(req: NextRequest): Promise<{ role?: Role; id?: number } | null> {
  const c = req.cookies;
  const raw = c.get("next-auth.session-token")?.value || c.get("__Secure-next-auth.session-token")?.value;
  if (!raw) return null;
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(raw, new TextEncoder().encode(secret));
    const pl = payload as TokenPayload;
    const role = pl.role;
    let id: number | undefined = undefined;
    if (typeof pl.id === "number") id = pl.id;
    else if (typeof pl.id === "string") id = Number(pl.id);
    else if (typeof pl.sub === "string") id = Number(pl.sub);
    return { role, id };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const from = `${pathname}${search || ""}`;

  const token = await readRoleFromCookie(req);
  const role = token?.role ?? "USER";

  // Protect /admin for ADMIN role only
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("reason", "admin");
      url.searchParams.set("from", from);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect /dashboard for authenticated users; redirect ADMINs to /admin
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("reason", "user");
      url.searchParams.set("from", from);
      return NextResponse.redirect(url);
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};
