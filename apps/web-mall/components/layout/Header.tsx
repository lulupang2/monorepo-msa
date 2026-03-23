"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Search, Menu, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../../lib/authStore";
import { useCartStore } from "../../lib/store";
import { cn } from "../../lib/utils";
import { Button } from "@mall/ui";

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();
  const { items } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      // 초기 상태 체크
      handleScroll();
    } else {
      setIsScrolled(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);
  
  // 첫 화면(홈)에서 스크롤 전에는 아예 렌더링 안 하거나 투명하게 처리
  const isHome = pathname === "/";
  const showHeader = !isHome || isScrolled;

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {!isHome && <div className="h-20 hidden md:block" />} {/* 상세페이지용 스페이서 */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[60] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 hidden md:block transition-all duration-500",
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/30">
            <ShoppingBag size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
            ROCKY <span className="text-indigo-600">STORE</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 ml-10">
          <Link href="/category" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">카테고리</Link>
          <Link href="/best" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">베스트</Link>
          <Link href="/events" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">이벤트</Link>
        </nav>

        {/* Search Bar (Centered Placeholder) */}
        <div className="hidden xl:flex flex-1 max-w-md mx-10 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="어떤 상품을 찾으시나요? 🔍" 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <div className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
              <ShoppingCart size={22} className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          <Link href={isLoggedIn ? "/profile" : "/login"}>
            <div className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group flex items-center gap-2">
              <User size={22} className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400 hidden xl:block">
                {isLoggedIn ? "마이페이지" : "로그인"}
              </span>
            </div>
          </Link>
          <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors lg:hidden">
            <Menu size={22} className="text-slate-700 dark:text-slate-300" />
          </button>
        </div>

      </div>
    </header>
    </>
  );
}
