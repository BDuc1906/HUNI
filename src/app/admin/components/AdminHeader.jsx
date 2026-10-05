"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/shared/services/apiClient";
import {
  ChevronRight, Clock, ExternalLink, ChevronDown, LayoutDashboard,
  ShoppingBag, FileText, Package, Users, Tag, LogOut, Info,
  CheckCircle2, X, Server, Sparkles, Bell, Shirt,
} from "lucide-react";

const ROUTE_NAMES = {
  "/admin": "Dashboard",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/quotes": "Quản Lý Báo Giá",
  "/admin/products": "Quản Lý Sản Phẩm",
  "/admin/reviews": "Đánh Giá & Phản Hồi",
  "/admin/returns": "Đổi Trả & Hoàn Tiền",
  "/admin/customers": "Quản Lý Khách Hàng",
  "/admin/vouchers": "Quản Lý Voucher",
};

export default function AdminHeader({ user }) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "short", day: "2-digit", month: "2-digit",
        year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
      }).format(new Date());
      setCurrentTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setIsDropdownOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    if (confirm("Đăng xuất khỏi Cổng Quản Trị?")) {
      authService.logout();
      window.location.href = "/login";
    }
  };

  const currentPageTitle = ROUTE_NAMES[pathname] || "Dashboard";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "Q";

  return (
    <>
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs">
          <Link href="/admin" className="text-slate-400 hover:text-slate-900 transition-colors font-medium">
            Dashboard
          </Link>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[#0097B2] font-bold">{currentPageTitle}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#0097B2]" />
            <span>{currentTime || "Hà Nội (GMT+7)"}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <span>Cửa hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0097B2] ring-2 ring-white" />
          </button>

          <div className="relative pl-3 border-l border-slate-200" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((p) => !p)}
              className={`flex items-center gap-2.5 p-1.5 rounded-xl transition-all group ${
                isDropdownOpen ? "bg-slate-100 ring-2 ring-[#0097B2]/30" : "hover:bg-slate-100"
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0097B2] to-[#66c5d8] flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-105 transition-transform">
                  {userInitial}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{user?.name || "Quản Trị Viên"}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180 text-[#0097B2]" : ""}`} />
                </div>
                <div className="text-[10px] text-[#0097B2] font-semibold leading-tight">Super Admin</div>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0097B2] to-[#66c5d8] flex items-center justify-center text-white font-black text-base shadow-lg ring-2 ring-[#0097B2]/30">
                        {userInitial}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                        <span>{user?.name || "Quản Trị Viên"}</span>
                        <Shirt className="w-4 h-4 text-[#0097B2] shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user?.email || "admin@hdcfashion.vn"}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0097B2]/15 text-[#0097B2] border border-[#0097B2]/25">
                          <Sparkles className="w-2.5 h-2.5" /> ADMIN MASTER
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Trực tuyến
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Truy Cập Nhanh
                  </div>
                  {[
                    { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, color: "text-[#0097B2]" },
                    { href: "/admin/orders", label: "Đơn Hàng", Icon: ShoppingBag, color: "text-emerald-500" },
                    { href: "/admin/quotes", label: "Báo Giá", Icon: FileText, color: "text-amber-500" },
                    { href: "/admin/products", label: "Sản Phẩm", Icon: Package, color: "text-purple-500" },
                    { href: "/admin/customers", label: "Khách Hàng", Icon: Users, color: "text-cyan-500" },
                    { href: "/admin/vouchers", label: "Voucher", Icon: Tag, color: "text-pink-500" },
                  ].map(({ href, label, Icon, color }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-slate-200 my-1.5" />

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Xem Website</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Mở tab mới</span>
                </Link>

                <button
                  type="button"
                  onClick={() => { setIsDropdownOpen(false); setIsSystemModalOpen(true); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-[#0097B2]" />
                    <span>Thông Tin Hệ Thống</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">v2.0</span>
                </button>

                <div className="h-px bg-slate-200 my-1.5" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isSystemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsSystemModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0097B2]/10 border border-[#0097B2]/25 text-[#0097B2] flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Thông Tin Hệ Thống</h3>
                <p className="text-xs text-slate-500">HDC Fashion Management</p>
              </div>
            </div>
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              {[
                { label: "Phiên bản:", value: "Admin UI v2.0 (2026)" },
                { label: "Framework:", value: "Next.js 15 + React 19" },
                { label: "Màu thương hiệu:", value: "#0097B2 (Teal)", accent: true },
                { label: "Múi giờ:", value: "Asia/Ho_Chi_Minh (GMT+7)", mono: true },
              ].map(({ label, value, mono, accent }) => (
                <div key={label} className="flex justify-between py-1 border-b border-slate-200 last:border-0">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-bold ${accent ? "text-[#0097B2]" : mono ? "font-mono text-slate-700" : "text-slate-900"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSystemModalOpen(false)}
                className="px-5 py-2.5 bg-[#0097B2] hover:bg-[#007f96] text-white font-bold text-xs rounded-xl transition-all"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}