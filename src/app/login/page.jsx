// ==================================================
// src/app/login/page.jsx
// Server Component — Chỉ render wrapper + metadata
// Sử dụng connection() để buộc route render động
// (thay thế cho force-dynamic không còn hiệu quả trong Next.js 16)
// ==================================================

import { Suspense } from "react";
import { connection } from "next/server";
import { Loader2 } from "lucide-react";
import LoginWrapper from "./LoginWrapper";

export const metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản HUNI UNIFORM",
};

// ==================================================
// LoginPage — Server Component
// await connection() buộc route này phải render động,
// bỏ qua hoàn toàn quá trình prerender tại build time.
// ==================================================
export default async function LoginPage() {
  await connection();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#071b34] via-[#0a2540] to-[#04121f] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      }
    >
      <LoginWrapper />
    </Suspense>
  );
}