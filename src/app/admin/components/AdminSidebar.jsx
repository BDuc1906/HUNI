"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, FileText, Package, Users, Tag,
  ExternalLink, LogOut, ChevronRight, Menu, X, MessageSquare,
  RotateCcw,
} from "lucide-react";
import { adminService, authService } from "@/shared/services/apiClient";

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
    ],
  },
];

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
          <Link
            href="/"
            target="_blank"
            onClick={onCloseMobile}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>Xem Cửa Hàng</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">hdcfashion.vn</span>
          </Link>
        </div>
      </div>

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
                {user?.email || "admin@hdcfashion.vn"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Đăng xuất"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors shrink-0"
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

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      authService.logout();
      window.location.href = "/login";
    }
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
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
          </div>
        </div>
      )}
    </>
  );
}