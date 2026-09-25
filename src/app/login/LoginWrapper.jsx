"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Tải động LoginForm — CHỈ render ở client, bỏ qua hoàn toàn SSR
const LoginForm = dynamic(() => import("./LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#071b34] via-[#0a2540] to-[#04121f] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
    </div>
  ),
});

export default function LoginWrapper() {
  return <LoginForm />;
}