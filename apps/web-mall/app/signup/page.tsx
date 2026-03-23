"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from "@mall/ui";
import api from "../../lib/api";
import { useToastStore } from "../../lib/toastStore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToastStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/api/auth/api/auth/signup", { email, password, name });
      showToast("회원가입 성공! 🎉 로그인해주세요.", "success");
      router.push("/login");
    } catch (error: any) {
      showToast(error.response?.data?.message || "회원가입 실패 🥲", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">회원가입 ✨</CardTitle>
          <p className="text-sm text-muted-foreground">새로운 계정을 만들고 혜택을 누리세요.</p>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name">이름</label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-slate-200 focus:ring-indigo-500"
              />
            </div>
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
                placeholder="6자리 이상 입력해주세요."
                required
                className="rounded-xl border-slate-200 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11" disabled={isLoading}>
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
            <p className="text-center text-sm text-slate-500">
              이미 계정이 있으신가요?{" "}
              <span className="text-indigo-600 cursor-pointer font-semibold" onClick={() => router.push("/login")}>
                로그인
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
