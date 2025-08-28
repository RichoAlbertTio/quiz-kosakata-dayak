"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteProgress() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse">
        <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-600 animate-progress"></div>
      </div>
    </div>
  );
}
