// ==================================================
// src/proxy.js — Bảo vệ routes (Next.js 16 proxy convention)
// Thay thế cho middleware.js cũ (đã deprecated)
// ==================================================

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Cho phép truy cập /admin để xem giao diện Admin Demo trực tiếp
  if (pathname.startsWith("/admin")) {
    if (process.env.REQUIRE_ADMIN_AUTH === "true") {
      if (!user) {
        return NextResponse.redirect(
          new URL(`/login?redirect=${pathname}`, req.nextUrl.origin)
        );
      }
      if (user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
      }
    }
    return NextResponse.next();
  }

  // Bảo vệ /tai-khoan/* — yêu cầu đăng nhập
  if (pathname.startsWith("/tai-khoan")) {
    if (!user) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/tai-khoan/:path*"],
};