// ==================================================
// src/app/login/page.jsx
// Server Component — chỉ render LoginForm + metadata.
// Không cần connection() hay LoginWrapper/dynamic(ssr:false)
// nữa: Suspense đã được đặt đúng chỗ bên trong LoginForm.jsx,
// nên Next.js prerender bình thường mà không lỗi.
// ==================================================

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản HUNI UNIFORM",
};

export default function LoginPage() {
  return <LoginForm />;
}
