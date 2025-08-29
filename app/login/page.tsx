"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-green-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-teal-400 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 border-2 border-emerald-300 rounded-full"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Decorative Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Selamat Datang di Dayak Quiz</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full"></div>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-center">
            <h2 className="text-xl font-semibold text-white">Masuk</h2>
            <div className="mt-2 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            {/* Alert Messages */}
            {sp.get("reason") === "admin" && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
                <div className="text-sm text-amber-700">Silakan login sebagai admin untuk melanjutkan.</div>
              </div>
            )}
            {sp.get("reason") === "user" && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
                <div className="text-sm text-amber-700">Silakan login untuk melanjutkan.</div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Email
                </label>
                <div className="relative">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    type="email"
                    required
                    className="pl-4 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    type="password"
                    required
                    className="pl-4 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                onClick={onSubmit}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Masuk</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                )}
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <a className="font-semibold text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-2 hover:decoration-emerald-300 transition-all duration-200" href="/register">
                  Daftar Sekarang
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
