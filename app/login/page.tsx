"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hardNavigate = (url: string) => {
    // Use full navigation to ensure Set-Cookie is visible to middleware immediately
    if (typeof window !== "undefined") {
      window.location.assign(url);
    } else {
      router.replace(url);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (r.ok) {
        let data: { role?: string } | undefined = undefined;
        try {
          data = await r.json();
        } catch {}
        const spFrom = sp.get("from");
        if (spFrom) {
          if (spFrom.startsWith("/admin") && data?.role !== "ADMIN") {
            return hardNavigate("/dashboard");
          }
          return hardNavigate(spFrom);
        }
        if (data?.role === "ADMIN") return hardNavigate("/admin/dashboard");
        return hardNavigate("/dashboard");
      } else {
        setError(await r.text());
      }
    } catch {
      setError("Gagal login. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Masuk</h1>
      {sp.get("reason") === "admin" && <div className="text-sm text-amber-600">Silakan login sebagai admin untuk melanjutkan.</div>}
      {sp.get("reason") === "user" && <div className="text-sm text-amber-600">Silakan login untuk melanjutkan.</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm block mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" type="email" required />
        </div>
        <div>
          <label className="text-sm block mb-1">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" required />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Masuk..." : "Masuk"}
        </Button>
      </form>
      <p className="text-sm">
        Belum punya akun?{" "}
        <a className="underline" href="/register">
          Daftar
        </a>
      </p>
    </div>
  );
}
