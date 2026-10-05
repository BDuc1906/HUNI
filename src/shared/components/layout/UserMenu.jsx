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
import { useLanguage } from "@/shared/providers/LanguageProvider";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
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

  // Khi chưa đăng nhập hoặc đang tải trạng thái khách, hiển thị ngay icon link dẫn tới /login
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="relative p-2 rounded-full text-slate-700 hover:text-[#0097b2] hover:bg-slate-100 transition-colors flex items-center justify-center shrink-0"
        title={t("action.login", "Đăng nhập")}
        aria-label="Đăng nhập"
      >
        <User className="w-4.5 h-4.5" />
      </Link>
    );
  }

  const user = session.user;
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-0.5 rounded-full hover:ring-2 hover:ring-[#0097b2]/40 transition-all flex items-center justify-center shrink-0"
        aria-label="Menu tài khoản"
        title={user.name || "Tài khoản"}
      >
        <div className="w-8 h-8 rounded-full bg-[#0097b2] text-white flex items-center justify-center font-black text-xs shadow-xs">
          {initial}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
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
              <span>{t("action.logout", "Đăng xuất")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
