// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Module augmentation to carry custom fields in JWT and Session
declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    role?: "ADMIN" | "USER";
  }
}

declare module "next-auth" {
  interface Session {
    user: { id?: number; role?: "ADMIN" | "USER" } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type WithRoleUser = { id?: string | number; role?: "ADMIN" | "USER" };

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  jwt: {
    // Align with custom SignJWT alg
    encode: undefined,
    decode: undefined,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const row = (await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1))[0];
        if (!row) return null;

        const valid = await bcrypt.compare(parsed.data.password, row.passwordHash);
        if (!valid) return null;

        const userOut = {
          id: String(row.id),
          email: row.email,
          name: row.name ?? null,
          role: row.role,
        } satisfies WithRoleUser & { id: string; email: string; name: string | null };

        // Cast through unknown to align with NextAuth User type without using any
        return userOut as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const u = user as unknown as WithRoleUser | undefined;
      if (u?.id != null) token.id = typeof u.id === "string" ? Number(u.id) : u.id;
      if (u?.role) token.role = u.role;
      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
