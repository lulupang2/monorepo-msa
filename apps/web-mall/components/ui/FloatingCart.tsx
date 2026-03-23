"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@mall/ui";
import { useCartStore } from "@/lib/store";
import { useEffect } from "react";
import Link from "next/link";

export function FloatingCart() {
  const { items, fetchCart } = useCartStore();
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8">
      <Link href="/cart">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-transform active:scale-95"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-in zoom-in duration-300">
                {totalCount}
              </span>
            )}
          </div>
        </Button>
      </Link>
    </div>
  );
}
