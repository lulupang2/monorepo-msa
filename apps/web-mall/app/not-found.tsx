"use client";

import Link from "next/link";
import { MoveLeft, Home, Search, Ghost } from "lucide-react";
import { Button } from "@mall/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-2xl w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
        
        {/* Visual Element */}
        <div className="relative">
          <div className="text-[12rem] md:text-[18rem] font-black text-slate-200 dark:text-slate-900 leading-none select-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white dark:bg-slate-900 rounded-full shadow-2xl flex items-center justify-center animate-bounce">
              <Ghost size={80} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            길을 잃으셨나요? 🗺️
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            죄송합니다. 요청하신 페이지가 존재하지 않거나 <br className="hidden md:block" />
            삭제되어 찾을 수 없습니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto h-16 px-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 font-black text-lg gap-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-95"
            onClick={() => window.history.back()}
          >
            <MoveLeft size={22} /> 이전으로
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg gap-2 shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              <Home size={22} /> 메인으로 가기
            </Button>
          </Link>
        </div>

        {/* Support Section */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            문제가 지속된다면 고객센터로 문의해주세요. <br />
            <span className="font-bold text-indigo-500 cursor-pointer hover:underline">고객센터 바로가기 ➔</span>
          </p>
        </div>

      </div>
    </div>
  );
}
