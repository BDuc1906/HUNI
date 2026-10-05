"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/shared/providers/AuthProvider";
import {
  User,
  LogIn,
  LogOut,
  Package,
  ChevronDown,
  Shield,
} from "lucide-react";

export default function UserMenu() {
  const { user, loading, logout } = useAuth();
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

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-800/60 border border-slate-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-brand-800 bg-slate-50 hover:bg-brand-50/80 border border-slate-200 hover:border-brand-500 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-brand-500/10 group"
        >
          <LogIn className="w-3.5 h-3.5 text-brand-600 group-hover:text-brand-700 transition-colors" />
          <span>Đăng nhập</span>
        </Link>
        <Link
          href="/register"
          className="hidden lg:flex items-center gap-1.5 px-4.5 py-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 hover:from-brand-500 hover:via-brand-600 hover:to-brand-600 rounded-full shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 hover:scale-105"
        >
          <span>Đăng ký</span>
        </Link>
        <Link
          href="/login"
          className="sm:hidden p-2 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-slate-200 hover:border-brand-400 transition-all hover:scale-105"
          aria-label="Đăng nhập"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const displayName = user.fullName || user.name || "Khách hàng";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-brand-400/60 transition-colors cursor-pointer"
        aria-label="Menu tài khoản"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-xs sm:text-sm">
          {initial}
        </div>
        <span className="hidden lg:block text-xs font-bold text-white max-w-[100px] truncate">
          {displayName.split(" ").slice(-1)[0]}
        </span>
        <ChevronDown
          className={`hidden lg:block w-3.5 h-3.5 text-brand-300 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-base">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-brand-200/80 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 text-sm font-semibold text-brand-700 transition-colors"
              >
                <Shield className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Trang quản trị (Admin)</span>
              </Link>
            )}

            <Link
              href="/tai-khoan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Hồ sơ cá nhân</span>
            </Link>

            <Link
              href="/tai-khoan?tab=don-hang"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-slate-400" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <div className="h-px bg-slate-800 my-1.5" />

            <button
              onClick={() => {
                setOpen(false);
                logout();
                window.location.href = "/";
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/20 text-sm font-medium text-rose-400 transition-colors text-left cursor-pointer"
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
