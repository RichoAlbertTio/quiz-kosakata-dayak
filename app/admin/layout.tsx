// app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/admin/LogoutButton";
import NavLink from "@/app/admin/NavLink";
import MobileNav from "@/app/admin/MobileNav";
import Breadcrumb from "@/app/admin/Breadcrumb";
import RouteProgress from "@/app/admin/RouteProgress";
import StatusIndicator from "@/app/admin/StatusIndicator";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  const displayName = session?.user?.name ?? session?.user?.email ?? "Admin";

  return (
    <div className="min-h-screen flex flex-col">
      <RouteProgress />

      <header className="border-b bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm relative z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">DQ</span>
              </div>
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Dayak Quiz</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/admin/dashboard" icon="🏠">
                Dashboard
              </NavLink>
              <NavLink href="/admin/categories" icon="📂">
                Kategori
              </NavLink>
              <NavLink href="/admin/materials" icon="📚">
                Materi
              </NavLink>
              <NavLink href="/admin/leaderboard" icon="🏆">
                Leaderboard
              </NavLink>
              <NavLink href="/admin/quizzes" icon="🧠">
                Kuis
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <StatusIndicator />
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-700">{displayName}</span>
              </div>
            </div>
            <LogoutButton />
            <MobileNav displayName={displayName} />
          </div>
        </div>
      </header>

      <Breadcrumb />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
