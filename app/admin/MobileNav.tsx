"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  displayName: string;
}

export default function MobileNav({ displayName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/admin/categories", label: "Kategori", icon: "📂" },
    { href: "/admin/materials", label: "Materi", icon: "📚" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { href: "/admin/quizzes", label: "Kuis", icon: "🧠" },
  ];

  const isActive = (href: string) => pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors" aria-label="Toggle menu">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
            <div className="px-4 py-6 space-y-4">
              {/* User info */}
              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              {/* Navigation items */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "mobile-menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 opacity-0",
                      isActive(item.href) ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
