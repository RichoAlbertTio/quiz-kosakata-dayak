import { cookies } from "next/headers";
import { jwtVerify, type JWTPayload } from "jose";

export type Role = "ADMIN" | "USER";
export type AuthUser = { id?: number; role?: Role; email?: string | null; name?: string | null };
export type Session = { user: AuthUser } | null;

interface TokenPayload extends JWTPayload {
  id?: number | string;
  role?: Role;
  email?: string | null;
  name?: string | null;
}

export async function auth(): Promise<Session> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const store = await cookies();
  const raw = store.get("next-auth.session-token")?.value || store.get("__Secure-next-auth.session-token")?.value;
  if (!raw) return null;

  try {
    const { payload } = await jwtVerify(raw, new TextEncoder().encode(secret));
    const pl = payload as TokenPayload;
    let id: number | undefined = undefined;
    if (typeof pl.id === "number") id = pl.id;
    else if (typeof pl.id === "string") id = Number(pl.id);
    else if (typeof pl.sub === "string") id = Number(pl.sub);

    return {
      user: {
        id,
        role: pl.role,
        email: pl.email ?? null,
        name: pl.name ?? null,
      },
    };
  } catch {
    return null;
  }
}
