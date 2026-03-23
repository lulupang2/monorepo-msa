"use client";

import { useAuthStore } from "@/lib/authStore";
import api from "@/lib/api";
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Badge } from "@mall/ui";
import { useRouter } from "next/navigation";
import { LogOut, User, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout, isLoggedIn } = useAuthStore();
  const router = useRouter();

  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const handleLogout = async () => {
    try {
      if (user) {
        await api.post("/api/auth/logout", { userId: user.id });
      }
    } catch (_) {
      // 실패해도 프론트 로그아웃은 진행
    }
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">마이 페이지 👤</h1>
          <Button variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" /> 로그아웃
          </Button>
        </header>

        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="relative px-8 pb-8">
            <div className="absolute -top-12 left-8">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
                👤
              </div>
            </div>
            
            <div className="pt-16 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{user.nickname || "고객님"}</h2>
                  <p className="text-slate-500">{user.email}</p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0 px-3">VIP 회원</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Mail className="text-indigo-500" size={20} />
                  <div>
                    <p className="text-xs text-slate-400 capitalize">이메일 계정</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Calendar className="text-indigo-500" size={20} />
                  <div>
                    <p className="text-xs text-slate-400 capitalize">가입일</p>
                    <p className="text-sm font-medium">2026.03.18</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-2 gap-4">
          <Link href="/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <h3 className="font-bold mb-1">주문 내역</h3>
              <p className="text-sm text-slate-500">최근 주문한 상품을 확인하세요.</p>
            </Card>
          </Link>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="font-bold mb-1">회원 정보 수정</h3>
            <p className="text-sm text-slate-500">계정 설정을 변경합니다.</p>
          </Card>
        </section>
      </div>
    </div>
  );
}
