"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}

export default function NavLink({ href, children, className, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
        isActive ? "text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100" : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:shadow-sm",
        className
      )}
    >
      {icon && <span className={cn("text-lg transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-105")}>{icon}</span>}
      {children}
      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-xl" />}
    </Link>
  );
}
