"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (r.ok) window.location.href = "/login";
    else alert(await r.text());
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
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
          <h1 className="text-3xl font-bold text-black mb-2">Bergabung di Dayak Quiz</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full"></div>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-center">
            <h2 className="text-xl font-semibold text-white">Daftar Akun Baru</h2>
            <div className="mt-2 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-4 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Masukkan nama lengkap Anda" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-4 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Masukkan email Anda" 
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z"/>
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-4 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Masukkan password Anda"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.524-2h.98a9.97 9.97 0 01.524 2A10.055 10.055 0 0112 19c4.478 0 8.268-2.943 9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                onClick={submit}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Daftar Sekarang</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <a 
                  className="font-semibold text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-2 hover:decoration-emerald-300 transition-all duration-200" 
                  href="/login"
                >
                  Masuk Sekarang
                </a>
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}