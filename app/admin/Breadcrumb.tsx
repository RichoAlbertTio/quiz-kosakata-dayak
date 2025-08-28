"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const routeLabels: Record<string, string> = {
  "/admin": "Admin",
  "/admin/dashboard": "Dashboard",
  "/admin/categories": "Kategori",
  "/admin/materials": "Materi",
  "/admin/materials/new": "Buat Materi Baru",
  "/admin/quizzes": "Kuis",
  "/admin/quizzes/new": "Buat Kuis Baru",
  "/leaderboard": "Leaderboard",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Skip breadcrumb for dashboard
  if (pathname === "/admin/dashboard") return null;

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = [];

  for (let i = 0; i < pathSegments.length; i++) {
    const path = "/" + pathSegments.slice(0, i + 1).join("/");
    const label = routeLabels[path] || pathSegments[i];

    breadcrumbItems.push({
      path,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      isLast: i === pathSegments.length - 1,
    });
  }

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
            🏠 Dashboard
          </Link>
          {breadcrumbItems.map((item) => (
            <div key={item.path} className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {item.isLast ? (
                <span className="text-blue-600 font-semibold">{item.label}</span>
              ) : (
                <Link href={item.path} className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
