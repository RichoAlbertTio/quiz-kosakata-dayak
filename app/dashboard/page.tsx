import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?reason=user");
  if (session.user.role === "ADMIN") redirect("/admin");

  const displayName = session.user.name ?? session.user.email ?? "Pengguna";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight">
              Lexi Dayak
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/materials" className="hover:underline">
                Materi
              </Link>
              <Link href="/play/quiz/1" className="hover:underline">
                Kuis
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="opacity-70 hidden sm:inline">{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard Pengguna</h1>
        <p className="opacity-70">Selamat datang, {displayName}.</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <li>
            <Link className="block rounded-lg border p-4 hover:bg-accent transition" href="/materials">
              <div className="font-medium">Materi</div>
              <div className="opacity-70">Lanjut belajar materi.</div>
            </Link>
          </li>
          <li>
            <Link className="block rounded-lg border p-4 hover:bg-accent transition" href="/play/quiz/1">
              <div className="font-medium">Kuis</div>
              <div className="opacity-70">Ikuti kuis contoh.</div>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
