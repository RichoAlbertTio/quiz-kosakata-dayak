"use client";

import { usePathname } from "next/navigation";

export default function StatusIndicator() {
  const pathname = usePathname();

  const getPageStatus = () => {
    if (pathname.includes("/new")) {
      return { status: "Buat", color: "bg-emerald-500", icon: "✨" };
    }
    if (pathname.includes("/edit") || pathname.includes("/[id]")) {
      return { status: "Edit", color: "bg-amber-500", icon: "✏️" };
    }
    if (pathname === "/admin/dashboard") {
      return { status: "Dashboard", color: "bg-blue-500", icon: "🏠" };
    }
    if (pathname.includes("/materials")) {
      return { status: "Materi", color: "bg-purple-500", icon: "📚" };
    }
    if (pathname.includes("/quizzes")) {
      return { status: "Kuis", color: "bg-indigo-500", icon: "🧠" };
    }
    if (pathname.includes("/categories")) {
      return { status: "Kategori", color: "bg-pink-500", icon: "📂" };
    }
    if (pathname.includes("/leaderboard")) {
      return { status: "Leaderboard", color: "bg-yellow-500", icon: "🏆" };
    }
    return { status: "Admin", color: "bg-gray-500", icon: "⚙️" };
  };

  const pageStatus = getPageStatus();

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border shadow-sm">
      <div className={`w-2 h-2 ${pageStatus.color} rounded-full animate-pulse`}></div>
      <span className="text-xs font-medium text-gray-600">
        {pageStatus.icon} {pageStatus.status}
      </span>
    </div>
  );
}
