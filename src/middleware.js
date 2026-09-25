// ==================================================
// src/middleware.js — Bảo vệ routes
// ==================================================

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Bảo vệ /admin/* — chỉ ADMIN
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, req.url)
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
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