"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../lib/authStore";
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from "@mall/ui";
import { User, UserPlus, ArrowRight, ShoppingBag } from "lucide-react";

export default function AuthChoicePage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  // 이미 로그인 되어 있으면 바로 체크아웃으로
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/checkout");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 회원 주문 */}
        <Card className="rounded-3xl border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="h-2 bg-indigo-500" />
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <User className="text-indigo-600 dark:text-indigo-400" size={40} />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">회원으로 주문하기</CardTitle>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm px-6">
              포인트 적립, 쿠폰 할인 등 다양한 회원 혜택을 누려보세요! ✨
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-10">
            <Button 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              onClick={() => router.push("/login?redirect=/checkout")}
            >
              로그인하고 혜택 받기 <ArrowRight size={20} />
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-2"
              onClick={() => router.push("/signup")}
            >
              <UserPlus size={20} /> 신규 회원가입
            </Button>
          </CardContent>
        </Card>

        {/* 비회원 주문 */}
        <Card className="rounded-3xl border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="h-2 bg-slate-400" />
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-slate-600 dark:text-slate-400" size={36} />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">비회원으로 주문하기</CardTitle>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm px-6">
              로그인 없이 빠르고 간편하게 주문을 진행합니다. 🚀
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-10 flex flex-col pt-6">
            <Button 
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              onClick={() => router.push("/checkout")}
            >
              비회원 구매 진행 <ArrowRight size={20} />
            </Button>
            <div className="text-center mt-4">
              <p className="text-[10px] text-slate-400 font-medium italic">회원가입 없이 즉시 결제가 가능합니다. ⚡</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
