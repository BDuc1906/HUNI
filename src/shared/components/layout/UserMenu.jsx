"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  LogIn,
  LogOut,
  Package,
  LayoutDashboard,
  ChevronDown,
  Settings,
  Heart
} from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Click ngoài để đóng dropdown
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Loading
  if (status === "loading") {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700 animate-pulse" />
    );
  }

  // Chưa đăng nhập — hiện nút Đăng nhập + Đăng ký
  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 border border-amber-400/40 hover:border-amber-400 rounded-full transition-colors"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Đăng nhập</span>
        </Link>
        <Link
          href="/register"
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#071b34] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full shadow-lg shadow-amber-500/20 transition-all"
        >
          <span>Đăng ký</span>
        </Link>
        {/* Mobile — chỉ hiện icon */}
        <Link
          href="/login"
          className="sm:hidden p-2 rounded-full bg-slate-800/60 text-amber-300 border border-slate-700"
          aria-label="Đăng nhập"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  // Đã đăng nhập
  const user = session.user;
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 transition-colors"
        aria-label="Menu tài khoản"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#071b34] font-black text-xs sm:text-sm">
          {initial}
        </div>
        <span className="hidden lg:block text-xs font-bold text-white max-w-[100px] truncate">
          {user.name?.split(" ").slice(-1)[0] || "User"}
        </span>
        <ChevronDown
          className={`hidden lg:block w-3.5 h-3.5 text-amber-300 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#071b34] to-[#0a2540] border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#071b34] font-black text-base shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-white truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-amber-200/80 truncate">
                  {user.email}
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400/20 border border-amber-400/40 rounded-full text-[10px] font-bold text-amber-300">
                <LayoutDashboard className="w-2.5 h-2.5" />
                ADMIN
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="p-2">
            <Link
              href="/tai-khoan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
            >
              <User className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Trang tài khoản</span>
            </Link>

            <Link
              href="/tai-khoan/don-hang"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
            >
              <Package className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <Link
              href="/tai-khoan/yeu-thich"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
            >
              <Heart className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sản phẩm yêu thích</span>
            </Link>

            {isAdmin && (
              <>
                <div className="h-px bg-slate-100 my-1" />
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-sm font-bold text-amber-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Trang Quản Trị Admin</span>
                </Link>
              </>
            )}

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