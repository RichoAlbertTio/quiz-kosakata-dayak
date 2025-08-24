import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login?reason=admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
        <p className="text-sm opacity-70">Kelola konten aplikasi.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link className="rounded-lg border p-4 hover:bg-accent transition" href="/admin/categories">
          <div className="font-medium">Kategori</div>
          <div className="text-sm opacity-70">Tambah, ubah, dan hapus kategori.</div>
        </Link>
        <Link className="rounded-lg border p-4 hover:bg-accent transition" href="/admin/materials">
          <div className="font-medium">Materi</div>
          <div className="text-sm opacity-70">Kelola materi pembelajaran.</div>
        </Link>
        <Link className="rounded-lg border p-4 hover:bg-accent transition" href="/admin/quizzes">
          <div className="font-medium">Kuis</div>
          <div className="text-sm opacity-70">Buat dan kelola kuis.</div>
        </Link>
      </div>
    </div>
  );
}
