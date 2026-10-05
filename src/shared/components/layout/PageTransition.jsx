"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children, className = "" }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/register";
  const transitionKey = isAuth ? "auth" : pathname;

  useEffect(() => {
    // Cuộn mượt lên đầu trang khi đổi route (nếu không có hash anchor)
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [transitionKey]);

  return (
    <div
      key={transitionKey}
      className={`page-transition-enter w-full ${className}`}
    >
      {children}
    </div>
  );
}
