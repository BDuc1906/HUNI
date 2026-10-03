import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("huni_token")?.value;

  if (pathname.startsWith("/admin")) {
    if (process.env.REQUIRE_ADMIN_AUTH === "true" && !token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, req.nextUrl.origin)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/tai-khoan")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const proxy = middleware;
export default middleware;

export const config = {
  matcher: ["/admin/:path*", "/tai-khoan/:path*"],
};