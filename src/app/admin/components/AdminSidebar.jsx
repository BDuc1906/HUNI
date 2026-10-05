"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
<<<<<<< HEAD
  LayoutDashboard, ShoppingBag, FileText, Package, Users, Tag,
  ExternalLink, LogOut, ChevronRight, Menu, X, MessageSquare,
  RotateCcw,
=======
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
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { authService } from "@/shared/services/apiClient";

<<<<<<< HEAD
const NAV_SECTIONS = [
  {
    label: "Main Menu",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/orders", label: "Đơn Hàng", icon: ShoppingBag, badgeKey: "pendingOrders" },
      { href: "/admin/quotes", label: "Báo Giá", icon: FileText, badgeKey: "newQuotes" },
      { href: "/admin/products", label: "Sản Phẩm", icon: Package },
      { href: "/admin/reviews", label: "Đánh Giá", icon: MessageSquare },
      { href: "/admin/returns", label: "Đổi Trả", icon: RotateCcw },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/admin/customers", label: "Khách Hàng", icon: Users },
      { href: "/admin/vouchers", label: "Voucher", icon: Tag },
=======
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
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
    ],
  },
];

<<<<<<< HEAD
function NavItem({ item, pathname, counts, onCloseMobile }) {
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;
  const badgeCount = item.badgeKey ? counts[item.badgeKey] : 0;

  return (
    <Link
      href={item.href}
      onClick={onCloseMobile}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all group relative ${
        isActive
          ? "bg-[#0097B2] text-white shadow-lg shadow-[#0097B2]/25 font-semibold"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/90" />
      )}
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-[#0097B2]"}`} />
        <span>{item.label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {badgeCount > 0 && (
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            isActive ? "bg-white text-[#0097B2]" : "bg-[#0097B2] text-white"
          }`}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
      </div>
    </Link>
  );
}

function NavContent({ user, counts, pathname, onCloseMobile, onLogout }) {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 shadow-2xl border-r border-slate-800">
      <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" onClick={onCloseMobile} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 aspect-square rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon.png" alt="HDC" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight leading-none">HDC</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#0097B2]/20 text-[#0097B2] border border-[#0097B2]/40">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-none">Đồng Phục Doanh Nghiệp</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  counts={counts}
                  onCloseMobile={onCloseMobile}
                />
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Management
          </div>
=======
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
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
          <Link
            href="/"
            target="_blank"
            onClick={onCloseMobile}
<<<<<<< HEAD
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>Xem Cửa Hàng</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">hdcfashion.vn</span>
=======
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
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
          </Link>
        </div>
      </div>

<<<<<<< HEAD
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <div className="p-3 rounded-xl bg-white/5 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0097B2] to-[#66c5d8] flex items-center justify-center text-white font-black text-xs shrink-0 ring-2 ring-[#0097B2]/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-white truncate leading-tight">
                {user?.name || "Quản Trị Viên"}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
=======
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
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
                {user?.email || "admin@hdcfashion.vn"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
<<<<<<< HEAD
            title="Đăng xuất"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors shrink-0"
=======
            title="Đăng xuất khỏi hệ thống"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
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
  const counts = {
    pendingOrders: initialCounts.pendingOrders || 12,
    newQuotes: initialCounts.newQuotes || 9,
<<<<<<< HEAD
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchCounts() {
      try {
        const res = await adminService.getDashboard();
        if (isMounted && res?.success && res?.data?.statusCounts) {
          setCounts({
            pendingOrders: res.data.statusCounts.orders?.pending || 12,
            newQuotes: res.data.statusCounts.quotes?.new || 9,
          });
        }
      } catch {}
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
=======
  };
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      authService.logout();
      window.location.href = "/login";
    }
  };

  return (
    <>
<<<<<<< HEAD
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
=======
      {/* Mobile Bar */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between border-b shadow-xs ${
          isDark
            ? "bg-[#0F172A] border-[#1E293B] text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
<<<<<<< HEAD
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/15"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 aspect-square rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon.png" alt="HDC" className="w-full h-full object-contain p-0.5" />
            </div>
            <span className="font-black text-white text-sm tracking-tight">HDC Admin</span>
          </div>
        </div>
        <Link href="/" target="_blank" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <span>Trang chủ</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <aside className="hidden lg:block w-64 shrink-0 h-full z-30">
        <NavContent user={user} counts={counts} pathname={pathname} onCloseMobile={() => {}} onLogout={handleLogout} />
      </aside>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-72 max-w-[85%] h-full z-10 animate-in slide-in-from-left duration-200">
            <NavContent user={user} counts={counts} pathname={pathname} onCloseMobile={() => setIsMobileOpen(false)} onLogout={handleLogout} />
=======
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
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
          </div>
        </div>
      )}
    </>
  );
}