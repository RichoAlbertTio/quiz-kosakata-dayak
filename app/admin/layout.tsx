import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/admin/LogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const displayName = session?.user?.name ?? session?.user?.email ?? "Admin";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold tracking-tight">
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/admin/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/admin/categories" className="hover:underline">
                Kategori
              </Link>
              <Link href="/admin/materials" className="hover:underline">
                Materi
              </Link>
              <Link href="/admin/quizzes" className="hover:underline">
                Kuis
              </Link>
              <Link href="/leaderboard" className="hover:underline">
                Leaderboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-70 hidden sm:inline">{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
