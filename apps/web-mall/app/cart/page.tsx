"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../lib/store";
import { useAuthStore } from "../../lib/authStore";
import { Button, Card, CardContent, Badge } from "@mall/ui";
import { Trash2, ShoppingBag, CreditCard, Minus, Plus } from "lucide-react";
import Link from "next/link";
import api from "../../lib/api";

export default function CartPage() {
  const { items, removeItem, updateQuantity, fetchCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (id: number, current: number, delta: number) => {
    const next = current + delta;
    if (next < 1) return;
    updateQuantity(id, next);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (isLoggedIn) {
      router.push("/checkout");
    } else {
      router.push("/checkout/auth-choice");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">장바구니 🛒</h1>
            <p className="text-slate-500 mt-2">담아두신 멋진 상품들을 확인하세요.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-6xl mb-6">🤷‍♂️</div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">장바구니가 텅 비었어요</h2>
            <p className="text-slate-500 mb-8">맘에 드는 상품을 먼저 골라보세요!</p>
            <Link href="/">
              <Button size="lg" className="rounded-xl px-8 font-black bg-indigo-600 hover:bg-indigo-700">쇼핑하러 가기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.product_id} className="overflow-hidden border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl">
                  <CardContent className="p-0 flex items-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 flex-shrink-0 flex items-center justify-center text-4xl">
                      🛍️
                    </div>
                    <div className="flex-1 p-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">{item.product_name}</h3>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
                            {(item.price * item.quantity).toLocaleString()}원
                          </span>
                          
                          {/* 수량 조절기 (컴팩트 버전) */}
                          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                            <button 
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity, -1)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all active:scale-90 text-slate-500 disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-bold text-xs text-slate-700 dark:text-slate-200">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity, 1)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all active:scale-90 text-slate-500"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product_id)}
                        className="w-12 h-12 flex items-center justify-center text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors ml-4"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl sticky top-24">
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">결제 요약 💸</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-500">
                    <span>상품 금액</span>
                    <span className="font-mono">{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>배송비</span>
                    <span className="font-mono text-emerald-500">무료 🚀</span>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">총 결제 금액</span>
                    <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                      {totalPrice.toLocaleString()}<span className="text-lg ml-1">원</span>
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-16 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1"
                  onClick={handleCheckout}
                >
                    <CreditCard size={24} />
                    구매하기
                </Button>
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-400 font-medium">안전결제(에스크로)가 적용되어 있습니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
