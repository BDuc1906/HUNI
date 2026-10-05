"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
import { authService } from "@/shared/services/apiClient";
import {
  ChevronRight, Clock, ExternalLink, ChevronDown, LayoutDashboard,
  ShoppingBag, FileText, Package, Users, Tag, LogOut, Info,
  CheckCircle2, X, Server, Sparkles, Bell, Shirt,
=======
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  ExternalLink,
  Clock,
  Shield,
  ChevronRight,
  LogOut,
  ShoppingBag,
  FileText,
  Package,
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { authService } from "@/shared/services/apiClient";

const ROUTE_NAMES = {
<<<<<<< HEAD
  "/admin": "Dashboard",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/quotes": "Quản Lý Báo Giá",
  "/admin/products": "Quản Lý Sản Phẩm",
  "/admin/reviews": "Đánh Giá & Phản Hồi",
  "/admin/returns": "Đổi Trả & Hoàn Tiền",
  "/admin/customers": "Quản Lý Khách Hàng",
  "/admin/vouchers": "Quản Lý Voucher",
=======
  "/admin": "Tổng Quan Vận Hành",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/quotes": "Quản Lý Báo Giá",
  "/admin/products": "Kho Hàng & Sản Phẩm",
  "/admin/customers": "Khách Hàng Doanh Nghiệp",
  "/admin/vouchers": "Khuyến Mãi & Voucher",
  "/admin/reviews": "Đánh Giá & Phản Hồi",
  "/admin/returns": "Đổi Trả & Bảo Hành",
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
};

export default function AdminHeader({ user }) {
  const pathname = usePathname();
<<<<<<< HEAD
=======
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
  const [currentTime, setCurrentTime] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

<<<<<<< HEAD
=======
  // Đồng hồ thời gian thực múi giờ Việt Nam
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
<<<<<<< HEAD
        weekday: "short", day: "2-digit", month: "2-digit",
        year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
      }).format(new Date());
=======
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
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

<<<<<<< HEAD
  useEffect(() => { setIsDropdownOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    if (confirm("Đăng xuất khỏi Cổng Quản Trị?")) {
=======
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`/admin/orders?search=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi Cổng Quản Trị?")) {
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
      authService.logout();
      window.location.href = "/login";
    }
  };

<<<<<<< HEAD
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
=======
  const currentTitle = ROUTE_NAMES[pathname] || "Khu Vực Quản Trị";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <header
      className={`h-16 shrink-0 px-4 sm:px-6 flex items-center justify-between gap-4 select-none transition-colors duration-200 border-b sticky top-0 z-20 ${
        isDark
          ? "bg-[#0F172A] border-[#1E293B] text-white"
          : "bg-white border-slate-200/90 text-slate-900 shadow-xs"
      }`}
    >
      {/* 1. Breadcrumb điều hướng */}
      <div className="flex items-center gap-2 text-xs font-medium min-w-0">
        <Link
          href="/admin"
          className="text-slate-500 hover:text-[#0097B2] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Shield className="w-3.5 h-3.5 text-[#0097B2]" />
          <span>Admin</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
        <span className="font-extrabold text-slate-900 dark:text-white truncate">
          {currentTitle}
        </span>
      </div>

      {/* 2. Thanh tìm kiếm nhanh (hoạt động thực tế dẫn tới /admin/orders) */}
      <div className="hidden md:flex flex-1 max-w-sm mx-4">
        <form onSubmit={handleSearch} className="w-full relative">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm kiếm đơn hàng, khách hàng, số điện thoại..."
            className={`w-full text-xs pl-8 pr-12 py-2 rounded-xl border outline-none transition-all ${
              isDark
                ? "bg-[#1E293B] border-[#334155] text-white placeholder:text-slate-500 focus:border-[#0097B2]"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0097B2]"
            }`}
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <kbd className="hidden lg:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs pointer-events-none">
            ↵
          </kbd>
        </form>
      </div>

      {/* 3. Tiện ích bên phải: Đồng hồ + Cửa hàng + Nút Light/Dark + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Đồng hồ GMT+7 */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#0097B2]" />
          <span>{currentTime || "Hà Nội"}</span>
        </div>

        {/* Nút xem website cửa hàng ngoài */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <span>Cửa hàng</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* Nút chuyển đổi Sáng / Tối */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isDark
              ? "bg-[#1E293B] border-slate-700 text-amber-400 hover:bg-[#334155]"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Profile Avatar & Menu dropdown */}
        <div className="relative pl-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0097B2] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              {userInitial}
            </div>
          </button>

          {isDropdownOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-64 rounded-2xl p-2 border shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? "bg-[#1E293B] border-slate-700 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="p-2.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-200/80 dark:border-slate-800 mb-1.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || "Quản Trị Viên"}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {user?.email || "admin@hdcfashion.vn"}
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
                </div>
                <div className="text-[10px] text-[#0097B2] font-semibold leading-tight">Super Admin</div>
              </div>

<<<<<<< HEAD
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
=======
              <div className="space-y-0.5">
                <Link
                  href="/admin/orders"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0097B2]" />
                  <span>Quản Lý Đơn Hàng</span>
                </Link>

                <Link
                  href="/admin/quotes"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Quản Lý Báo Giá</span>
                </Link>

                <Link
                  href="/admin/products"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Package className="w-4 h-4 text-purple-500" />
                  <span>Kho Hàng & Sản Phẩm</span>
                </Link>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac

                <button
                  type="button"
                  onClick={handleLogout}
<<<<<<< HEAD
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
=======
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
<<<<<<< HEAD
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
=======
      </div>
    </header>
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
  );
}