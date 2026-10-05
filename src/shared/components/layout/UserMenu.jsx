"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/providers/AuthProvider";
import {
  User,
  LogOut,
  Package,
  Shield,
} from "lucide-react";

export default function UserMenu() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user || null;
  const loading = auth?.loading || false;
  const logout = auth?.logout;
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
      <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
    );
  }

  // Khi chưa đăng nhập: hiển thị nút icon User tròn, không dùng nút chữ Đăng nhập / Đăng ký
  if (!user) {
    return (
      <Link
        href="/login"
        className="relative p-2 rounded-full text-slate-700 hover:text-[#0097b2] hover:bg-slate-100 transition-colors flex items-center justify-center shrink-0"
        title="Đăng nhập"
        aria-label="Đăng nhập"
      >
        <User className="w-5 h-5" />
      </Link>
    );
  }

  const displayName = user.fullName || user.name || "Khách hàng";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-0.5 rounded-full hover:ring-2 hover:ring-[#0097b2]/40 transition-all flex items-center justify-center shrink-0 cursor-pointer"
        aria-label="Menu tài khoản"
        title={displayName}
      >
        <div className="w-8 h-8 rounded-full bg-[#0097b2] text-white flex items-center justify-center font-black text-xs shadow-xs">
          {initial}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 bg-gradient-to-br from-[#00687a] to-[#004f5e] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-base shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-teal-100/80 truncate">
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-semibold text-teal-400 transition-colors"
              >
                <Shield className="w-4 h-4 text-[#0097b2] shrink-0" />
                <span>Trang quản trị (Admin)</span>
              </Link>
            )}

            <Link
              href="/tai-khoan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Hồ sơ cá nhân</span>
            </Link>

            <Link
              href="/tai-khoan?tab=don-hang"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Đơn hàng của tôi</span>
            </Link>

            <div className="h-px bg-slate-800 my-1.5" />

            <button
              onClick={() => {
                setOpen(false);
                if (logout) logout();
                router.push("/");
                router.refresh();
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
