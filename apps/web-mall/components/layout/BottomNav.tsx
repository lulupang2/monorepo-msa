"use client";

import { Home, Search, LayoutGrid, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/authStore";

export function BottomNav() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const navItems = [
    { icon: Home, label: "홈", href: "/" },
    { icon: LayoutGrid, label: "카테고리", href: "/category" },
    { icon: Search, label: "검색", href: "/search" },
    { icon: User, label: "마이", href: isLoggedIn ? "/profile" : "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-500 dark:text-slate-400 hover:text-indigo-500"
                )}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
