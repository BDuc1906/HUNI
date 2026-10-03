"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/shared/services/apiClient";
import {
  ChevronRight,
  Clock,
  ExternalLink,
  Shield,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Package,
  Users,
  Tag,
  LogOut,
  Info,
  ShieldCheck,
  CheckCircle2,
  X,
  Server,
  Sparkles,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

const ROUTE_NAMES = {
  "/admin": "Dashboard Tổng Quan",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/quotes": "Quản Lý Báo Giá",
  "/admin/products": "Quản Lý Sản Phẩm",
  "/admin/reviews": "Quản Lý Đánh Giá & Phản Hồi",
  "/admin/returns": "Quản Lý Đổi Trả & Hoàn Tiền",
  "/admin/customers": "Quản Lý Khách Hàng",
  "/admin/vouchers": "Quản Lý Voucher",
};

export default function AdminHeader({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đồng hồ hiển thị thời gian thực múi giờ Việt Nam
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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

  // Đóng dropdown khi chuyển trang
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi Cổng Quản Trị?")) {
      authService.logout();
      window.location.href = "/login";
    }
  };

  const currentTitle = ROUTE_NAMES[pathname] || "Khu Vực Quản Trị";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "Q";

  return (
    <>
      <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-md z-30 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
        {/* Cột trái: Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin"
            className="text-slate-500 hover:text-brand-600 transition-colors font-medium flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>Admin</span>
          </Link>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">{currentTitle}</span>
            </>
          )}
        </div>

        {/* Cột phải: Đồng hồ VN + Cửa hàng + Menu Profile Quản Trị Viên */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Đồng hồ múi giờ Việt Nam */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 font-mono">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>{currentTime || "Hà Nội (GMT+7)"}</span>
          </div>

          {/* Nút xem website ngoài */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors"
          >
            <span>Cửa hàng</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Nút bấm mở Menu Profile Quản Trị Viên */}
          <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              title="Nhấn để mở menu tài khoản Quản trị"
              className={`flex items-center gap-2.5 p-1.5 rounded-xl transition-all select-none cursor-pointer group ${
                isDropdownOpen
                  ? "bg-slate-100 ring-2 ring-brand-500/30"
                  : "hover:bg-slate-100/80"
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
                  {userInitial}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-brand-600 transition-colors flex items-center gap-1">
                  <span>{user?.name || "Quản Trị Viên"}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </div>
                <div className="text-[10px] text-brand-600 font-semibold leading-tight">
                  Toàn quyền quản trị
                </div>
              </div>
            </button>

            {/* DROPDOWN MENU PROFILE KHI NHẤN VÀO */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                {/* 1. Header Card Thông Tin Quản Trị */}
                <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/80 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-500 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-base shadow-lg ring-2 ring-brand-400/30">
                        {userInitial}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                        <span>{user?.name || "Quản Trị Viên"}</span>
                        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user?.email || "admin@hdcfashion.vn"}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          <Sparkles className="w-2.5 h-2.5 text-brand-600" />
                          <span>ADMIN MASTER</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Trực tuyến
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Menu Lối Tắt Nhanh */}
                <div className="space-y-0.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Truy Cập Nhanh
                  </div>

                  <Link
                    href="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-600" />
                    <span>Dashboard Tổng Quan</span>
                  </Link>

                  <Link
                    href="/admin/orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Quản Lý Đơn Hàng</span>
                  </Link>

                  <Link
                    href="/admin/quotes"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Quản Lý Báo Giá</span>
                  </Link>

                  <Link
                    href="/admin/products"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-slate-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>Kho Hàng & Sản Phẩm</span>
                  </Link>

                  <Link
                    href="/admin/reviews"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>Đánh Giá & Phản Hồi</span>
                  </Link>

                  <Link
                    href="/admin/returns"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-indigo-600" />
                    <span>Đổi Trả & Hoàn Tiền</span>
                  </Link>

                  <Link
                    href="/admin/customers"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-cyan-700 hover:bg-slate-50 transition-colors"
                  >
                    <Users className="w-4 h-4 text-cyan-600" />
                    <span>Khách Hàng Doanh Nghiệp</span>
                  </Link>

                  <Link
                    href="/admin/vouchers"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-pink-700 hover:bg-slate-50 transition-colors"
                  >
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Khuyến Mãi & Voucher</span>
                  </Link>
                </div>

                <div className="h-px bg-slate-100 my-1.5" />

                {/* 3. Tiện Ích & Thông Tin */}
                <div className="space-y-0.5">
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                      <span>Xem Website Bán Hàng</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Mở tab mới</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsSystemModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-4 h-4 text-brand-600" />
                      <span>Thông Tin Hệ Thống</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      v2.0
                    </span>
                  </button>
                </div>

                <div className="h-px bg-slate-100 my-1.5" />

                {/* 4. Nút Đăng Xuất */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Đăng Xuất Khỏi Quản Trị</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL THÔNG TIN HỆ THỐNG */}
      {isSystemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsSystemModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Thông Tin Hệ Thống HDC Admin
                </h3>
                <p className="text-xs text-slate-500">
                  HUNI Uniform Management Platform
                </p>
              </div>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Phiên bản giao diện:</span>
                <span className="font-bold text-slate-900">Admin UI v2.0 (2026)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Framework:</span>
                <span className="font-bold text-slate-900">Next.js 16 + React 19</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Chế độ vận hành:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sẵn sàng / Live Demo
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Múi giờ máy chủ:</span>
                <span className="font-mono text-slate-700">Asia/Ho_Chi_Minh (GMT+7)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Quyền hạn tài khoản:</span>
                <span className="font-bold text-brand-600">SUPER ADMIN (Toàn quyền)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSystemModalOpen(false)}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-brand-600/20 transition-all"
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
