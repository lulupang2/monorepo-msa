"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from "@mall/ui";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { useToastStore } from "@/lib/toastStore";

import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const { showToast } = useToastStore();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/api/auth/api/auth/login", { email, password });
      setAuth(data.user, data.access_token, data.refresh_token);
      showToast("로그인 성공! 🎉", "success");
      router.push(redirect);
    } catch (error: any) {
      showToast(error.response?.data?.message || "로그인 실패 🥲", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">로그인 🔐</CardTitle>
        <p className="text-sm text-muted-foreground">계정에 접속하여 쇼핑을 계속하세요.</p>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">이메일</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-slate-200 focus:ring-indigo-500"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">비밀번호</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-slate-200 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            계정이 없으신가요?{" "}
            <span className="text-indigo-600 cursor-pointer font-semibold" onClick={() => router.push("/signup")}>
              회원가입
            </span>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<div className="text-slate-500 font-bold">로딩 중... 🔃</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
