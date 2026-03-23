import type { Metadata } from "next";

// @mall/ui 에 등록해둔 글로벌 테일윈드 CSS 등 공통 스타일 임포트
import "@mall/ui/globals.css";

import Providers from "./providers";
import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";
import { FloatingCart } from "../components/ui/FloatingCart";

export const metadata: Metadata = {
  title: "로키스토어 (Rocky Store)",
  description: "세상의 모든 쇼핑, 로키스토어",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-20 md:pb-0">
        <Providers>
          <Header />
          {children}
          <FloatingCart />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
