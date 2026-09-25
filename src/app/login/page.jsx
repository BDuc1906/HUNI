// ==================================================
// Server Component — Chỉ render wrapper + metadata
// ==================================================

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginWrapper from "./LoginWrapper";

export const metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản HUNI UNIFORM",
};

// Buộc route này là dynamic — không prerender
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
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