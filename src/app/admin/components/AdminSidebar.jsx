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
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { adminService, authService } from "@/shared/services/apiClient";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "Đơn Hàng",
    icon: ShoppingBag,
    badgeKey: "pendingOrders",
    badgeColor: "bg-amber-500 text-slate-950",
  },
  {
    href: "/admin/quotes",
    label: "Báo Giá",
    icon: FileText,
    badgeKey: "newQuotes",
    badgeColor: "bg-sky-500 text-white",
  },
  {
    href: "/admin/products",
    label: "Sản Phẩm",
    icon: Package,
  },
  {
    href: "/admin/reviews",
    label: "Đánh Giá & Phản Hồi",
    icon: MessageSquare,
  },
  {
    href: "/admin/returns",
    label: "Đổi Trả & Hoàn Tiền",
    icon: RotateCcw,
  },
  {
    href: "/admin/customers",
    label: "Khách Hàng",
    icon: Users,
  },
  {
    href: "/admin/vouchers",
    label: "Voucher",
    icon: Tag,
  },
];

function NavContent({ user, counts, pathname, onCloseMobile, onLogout }) {
  return (
    <div className="flex flex-col h-full bg-[#002B34] text-slate-100 border-r border-[#004F5E]/60 shadow-xl">
      {/* Brand & Logo Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-teal-300 flex items-center justify-center text-slate-950 shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                HDC FASHION
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-400/20 text-brand-300 border border-brand-400/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-teal-200/70">Hệ Thống Quản Trị HUNI</p>
          </div>
        </Link>

        {/* Nút đóng trên mobile */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-teal-300/70 uppercase tracking-wider">
          Menu Điều Hành
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          const badgeCount = item.badgeKey ? counts[item.badgeKey] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/30 font-bold"
                  : "text-teal-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive
                      ? "text-white"
                      : "text-teal-300/80 group-hover:text-brand-300"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {badgeCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black font-mono shadow-sm ${
                      item.badgeColor || "bg-amber-400 text-slate-950 font-bold"
                    }`}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-teal-300/70 uppercase tracking-wider">
          Lối Tắt Ngoài Web
        </div>

        <Link
          href="/"
          target="_blank"
          onClick={onCloseMobile}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-teal-200/80 hover:text-white hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-teal-300/80" />
            <span>Xem Trang Cửa Hàng</span>
          </div>
          <span className="text-[10px] text-teal-300/60">huni.vn</span>
        </Link>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-white/10 bg-[#00222a]">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-teal-300 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 ring-2 ring-brand-400/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || "Quản Trị Viên"}
              </div>
              <div className="text-[10px] text-teal-200/70 truncate">
                {user?.email || "admin@hdc.vn"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Đăng xuất khỏi hệ thống"
            className="p-1.5 rounded-lg text-teal-200/70 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [counts, setCounts] = useState({
    pendingOrders: initialCounts.pendingOrders || 12,
    newQuotes: initialCounts.newQuotes || 9,
  });

  // Cập nhật số lượng badge từ Dashboard API
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
      } catch (err) {
        console.error("Failed to load sidebar badge counts:", err);
      }
    }

    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
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
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#002B34] border-b border-[#004F5E]/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            aria-label="Mở menu admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white text-sm">HDC Admin</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          <span>Trang chủ</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Desktop Sidebar (Cố định toàn diện w-64) */}
      <aside className="hidden lg:block w-64 shrink-0 h-full z-30">
        <NavContent
          user={user}
          counts={counts}
          pathname={pathname}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer (Slide-in) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85%] h-full z-10 animate-in slide-in-from-left duration-200">
            <NavContent
              user={user}
              counts={counts}
              pathname={pathname}
              onCloseMobile={() => setIsMobileOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </>
  );
}
