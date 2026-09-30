"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  LogIn,
  LogOut,
  Package,
  ChevronDown
} from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-brand-300 hover:text-brand-200 border border-brand-400/40 hover:border-brand-400 rounded-full transition-colors"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Đăng nhập</span>
        </Link>
        <Link
          href="/register"
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-400 to-brand-500 hover:from-brand-300 hover:to-brand-400 rounded-full shadow-lg shadow-brand-500/20 transition-all"
        >
          <span>Đăng ký</span>
        </Link>
        <Link
          href="/login"
          className="sm:hidden p-2 rounded-full bg-slate-800/60 text-brand-300 border border-slate-700"
          aria-label="Đăng nhập"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const user = session.user;
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-brand-400/60 transition-colors"
        aria-label="Menu tài khoản"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-xs sm:text-sm">
          {initial}
        </div>
        <span className="hidden lg:block text-xs font-bold text-white max-w-[100px] truncate">
          {user.name?.split(" ").slice(-1)[0] || "User"}
        </span>
        <ChevronDown
          className={`hidden lg:block w-3.5 h-3.5 text-brand-300 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#004f5e] to-[#00677a] border-b border-brand-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-base shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-white truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-brand-200/80 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu items — 2 mục, dùng ?tab= để mở đúng tab */}
          <div className="p-2">
            <Link
              href="/tai-khoan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
            >
              <User className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Trang tài khoản</span>
            </Link>

            <Link
              href="/tai-khoan?tab=orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
            >
              <Package className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <div className="h-px bg-slate-100 my-1" />

            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-sm font-medium text-rose-600 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
