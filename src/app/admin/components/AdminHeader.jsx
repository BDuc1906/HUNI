"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Clock,
  ExternalLink,
  Shield,
  Bell,
  Search,
} from "lucide-react";

const ROUTE_NAMES = {
  "/admin": "Dashboard Tổng Quan",
  "/admin/orders": "Quản Lý Đơn Hàng",
  "/admin/quotes": "Quản Lý Báo Giá",
  "/admin/products": "Quản Lý Sản Phẩm",
  "/admin/customers": "Quản Lý Khách Hàng",
  "/admin/vouchers": "Quản Lý Voucher",
};

export default function AdminHeader({ user }) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("");

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

  // Xây dựng breadcrumbs tự động
  const currentTitle = ROUTE_NAMES[pathname] || "Khu Vực Quản Trị";

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Cột trái: Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/admin"
          className="text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-1"
        >
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Admin</span>
        </Link>
        {pathname !== "/admin" && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">{currentTitle}</span>
          </>
        )}
      </div>

      {/* Cột phải: Đồng hồ VN + Avatar & Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Đồng hồ múi giờ Việt Nam */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentTime || "Hà Nội (GMT+7)"}</span>
        </div>

        {/* Nút xem website ngoài */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <span>Cửa hàng</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* Thông tin Admin */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-tight">
              {user?.name || "Admin"}
            </div>
            <div className="text-[10px] text-blue-400 font-semibold leading-tight">
              Toàn quyền quản trị
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
