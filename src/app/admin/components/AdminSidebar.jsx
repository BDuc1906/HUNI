"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Package,
  Users,
  Tag,
  MessageSquare,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { authService, adminService } from "@/shared/services/apiClient";

// CHỈ GIỮ LẠI CÁC TRANG CÓ THỰC VÀ HOẠT ĐỘNG 100% TRONG HỆ THỐNG
const NAV_GROUPS = [
  {
    groupLabel: "Tổng Quan",
    items: [
      {
        href: "/admin",
        label: "Dashboard Tổng Quan",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    groupLabel: "Kinh Doanh & Đơn Hàng",
    items: [
      {
        href: "/admin/orders",
        label: "Quản Lý Đơn Hàng",
        icon: ShoppingBag,
        badgeKey: "pendingOrders",
        badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      },
      {
        href: "/admin/quotes",
        label: "Yêu Cầu Báo Giá",
        icon: FileText,
        badgeKey: "newQuotes",
        badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
      },
      {
        href: "/admin/customers",
        label: "Khách Hàng Doanh Nghiệp",
        icon: Users,
      },
    ],
  },
  {
    groupLabel: "Kho Hàng & Ưu Đãi",
    items: [
      {
        href: "/admin/products",
        label: "Sản Phẩm & Mẫu Vải",
        icon: Package,
      },
      {
        href: "/admin/vouchers",
        label: "Khuyến Mãi & Voucher",
        icon: Tag,
      },
    ],
  },
  {
    groupLabel: "Dịch Vụ & Hậu Mãi",
    items: [
      {
        href: "/admin/reviews",
        label: "Đánh Giá & Phản Hồi",
        icon: MessageSquare,
      },
      {
        href: "/admin/returns",
        label: "Đổi Trả & Bảo Hành",
        icon: RotateCcw,
      },
    ],
  },
];

function SidebarContent({ user, counts, pathname, isDark, onCloseMobile, onLogout }) {
  return (
    <div
      className={`flex flex-col h-full select-none transition-colors duration-200 border-r ${
        isDark
          ? "bg-[#0F172A] border-[#1E293B] text-slate-300"
          : "bg-white border-slate-200/90 text-slate-700"
      }`}
    >
      {/* 1. BRAND HEADER */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-[#1E293B]">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007F96] to-[#0097B2] flex items-center justify-center text-white font-black text-base shadow-md shadow-[#0097B2]/20 shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 dark:text-white text-base tracking-tight truncate">
                HDC FASHION
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-[#0097B2]/15 text-[#007F96] dark:text-[#0097B2] border border-[#0097B2]/25">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Hệ Thống Quản Trị Xưởng May
            </p>
          </div>
        </Link>
      </div>

      {/* 2. MENU ITEMS - CHỈ CÁC TRANG CÓ THỰC */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupLabel} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group.groupLabel}
            </div>

            {group.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              const badge = item.badgeKey ? counts[item.badgeKey] : null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? isDark
                        ? "bg-[#1E293B] text-white font-bold border-l-3 border-[#0097B2] shadow-xs"
                        : "bg-[#0097B2]/10 text-[#007F96] font-bold border-l-3 border-[#0097B2]"
                      : isDark
                      ? "text-slate-400 hover:text-white hover:bg-[#1E293B]/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-[#0097B2]"
                          : isDark
                          ? "text-slate-500 group-hover:text-slate-300"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}
                      >
                        {badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#0097B2]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}

        {/* Lối tắt xem website bán hàng */}
        <div className="pt-2">
          <Link
            href="/"
            target="_blank"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
              isDark
                ? "bg-[#141C2E] border-[#1E293B] text-slate-300 hover:text-white hover:bg-[#1E293B]"
                : "bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#0097B2]" />
              <span>Xem Trang Bán Hàng</span>
            </div>
            <span className="text-[10px] font-mono opacity-60">huni.vn</span>
          </Link>
        </div>
      </div>

      {/* 3. PROFILE & ĐĂNG XUẤT FOOTER */}
      <div className="p-3 border-t border-slate-200/80 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0B1120]">
        <div className="p-2 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0097B2] flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "Quản Trị Viên"}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || "admin@hdcfashion.vn"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Đăng xuất khỏi hệ thống"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ user, initialCounts = {} }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [counts, setCounts] = useState({
    pendingOrders: Number(initialCounts.pendingOrders) || 0,
    newQuotes: Number(initialCounts.newQuotes) || 0,
  });

  useEffect(() => {
    let ignore = false;
    adminService.getDashboard().then((res) => {
      if (!ignore && res?.success && res?.data?.statusCounts) {
        setCounts({
          pendingOrders: Number(res.data.statusCounts.orders?.pending) || 0,
          newQuotes: Number(res.data.statusCounts.quotes?.new) || 0,
        });
      }
    }).catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị?")) {
      authService.logout();
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Mobile Bar */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between border-b shadow-xs ${
          isDark
            ? "bg-[#0F172A] border-[#1E293B] text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-sm tracking-tight text-[#0097B2]">
            HDC ADMIN
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1"
        >
          <span>Cửa hàng</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Desktop Sidebar (w-64) */}
      <aside className="hidden lg:block w-64 shrink-0 h-full z-30">
        <SidebarContent
          user={user}
          counts={counts}
          pathname={pathname}
          isDark={isDark}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85%] h-full z-10 animate-in slide-in-from-left duration-200">
            <SidebarContent
              user={user}
              counts={counts}
              pathname={pathname}
              isDark={isDark}
              onCloseMobile={() => setIsMobileOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </>
  );
}
