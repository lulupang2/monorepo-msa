"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mall/ui";
import { CheckCircle2, ChevronRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-10 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">결제 완료! 🎉</h1>
        <p className="text-slate-500 mb-8">성공적으로 주문이 접수되었습니다.</p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
            <PackageCheck size={20} />
            주문 상태: 결제완료
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
             <div className="flex justify-between">
               <span>주문번호</span>
               <span className="font-mono font-bold text-slate-900 dark:text-slate-100">ORD-{id}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/orders">
            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 font-bold text-lg">
              주문 내역 보기
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full rounded-xl h-14 font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              계속 쇼핑하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
