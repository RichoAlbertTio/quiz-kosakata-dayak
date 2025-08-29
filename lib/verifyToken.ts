import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

function errorResponse({ message, status }: { message: string; status: number }) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function verifyToken(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!session) return errorResponse({ message: "Unauthorized", status: 401 });
  return { session };
}
