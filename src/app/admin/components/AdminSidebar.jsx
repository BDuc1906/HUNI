"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
import { adminService } from "@/shared/services/apiClient";

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
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand & Logo Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                HDC FASHION
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Hệ Thống Quản Trị HUNI</p>
          </div>
        </Link>

        {/* Nút đóng trên mobile */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-blue-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {badgeCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black font-mono shadow-sm ${
                      item.badgeColor || "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                )}
              </div>
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Lối Tắt Ngoài Web
        </div>

        <Link
          href="/"
          target="_blank"
          onClick={onCloseMobile}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Xem Trang Cửa Hàng</span>
          </div>
          <span className="text-[10px] text-slate-400">huni.vn</span>
        </Link>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 ring-2 ring-blue-400/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || "Quản Trị Viên"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.email || "admin@hdc.vn"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Đăng xuất khỏi hệ thống"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
    pendingOrders: initialCounts.pendingOrders || 0,
    newQuotes: initialCounts.newQuotes || 0,
  });

  // Cập nhật số lượng badge từ Dashboard API
  useEffect(() => {
    let isMounted = true;
    async function fetchCounts() {
      try {
        const res = await adminService.getDashboard();
        if (isMounted && res?.success && res?.data?.statusCounts) {
          setCounts({
            pendingOrders: res.data.statusCounts.orders?.pending || 0,
            newQuotes: res.data.statusCounts.quotes?.new || 0,
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
      await signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
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

      {/* Desktop Sidebar (Fixed w-64) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
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
