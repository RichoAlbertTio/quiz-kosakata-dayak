// app/admin/layout.tsx
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
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/admin/dashboard" className="text-blue-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/admin/categories" className="hover:text-blue-600 transition-colors">
                Kategori
              </Link>
              <Link href="/admin/materials" className="hover:text-blue-600 transition-colors">
                Materi
              </Link>
              <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
                Leaderboard
              </Link>
              <Link href="/admin/quizzes" className="hover:text-blue-600 transition-colors">
                Kuis
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-70 hidden sm:inline font-medium">{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
        
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
