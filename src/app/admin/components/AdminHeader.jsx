"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { authService } from "@/shared/services/apiClient";

const ROUTE_NAMES = {
  "/admin": "Tổng Quan Vận Hành",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/quotes": "Quản Lý Báo Giá",
  "/admin/products": "Kho Hàng & Sản Phẩm",
  "/admin/customers": "Khách Hàng Doanh Nghiệp",
  "/admin/vouchers": "Khuyến Mãi & Voucher",
  "/admin/reviews": "Đánh Giá & Phản Hồi",
  "/admin/returns": "Đổi Trả & Bảo Hành",
};

export default function AdminHeader({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [currentTime, setCurrentTime] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đồng hồ thời gian thực múi giờ Việt Nam
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      setCurrentTime(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`/admin/orders?search=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi Cổng Quản Trị?")) {
      authService.logout();
      window.location.href = "/login";
    }
  };

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
                </div>
              </div>

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

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
