"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  BarChart2,
  MessageSquare,
  Users2,
  Megaphone,
  UserCheck,
  Radio,
  FileCheck2,
  ShieldAlert,
  CreditCard,
  Blocks,
  Settings,
  Headphones,
  HelpCircle,
  ChevronsUpDown,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

const SIDEBAR_SECTIONS = [
  {
    heading: "Main Menu",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/admin/products",
        label: "Products",
        icon: Package,
      },
      {
        href: "/admin/orders",
        label: "Transactions",
        icon: ArrowLeftRight,
        badgeKey: "pendingOrders",
      },
      {
        href: "/admin/analytics",
        label: "Reports & Analytics",
        icon: BarChart2,
      },
      {
        href: "/admin/quotes",
        label: "Messages",
        icon: MessageSquare,
        badgeKey: "newQuotes",
      },
      {
        href: "/admin/team",
        label: "Team Performance",
        icon: Users2,
      },
      {
        href: "/admin/vouchers",
        label: "Campaigns",
        icon: Megaphone,
      },
    ],
  },
  {
    heading: "Customers",
    items: [
      {
        href: "/admin/customers",
        label: "Customer List",
        icon: UserCheck,
      },
      {
        href: "/admin/channels",
        label: "Channels",
        icon: Radio,
      },
      {
        href: "/admin/orders",
        label: "Order Management",
        icon: FileCheck2,
      },
    ],
  },
  {
    heading: "Management",
    items: [
      {
        href: "/admin/roles",
        label: "Roles & Permissions",
        icon: ShieldAlert,
      },
      {
        href: "/admin/billing",
        label: "Billing & Subscription",
        icon: CreditCard,
      },
      {
        href: "/admin/integrations",
        label: "Integrations",
        icon: Blocks,
      },
    ],
  },
];

const FOOTER_ITEMS = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/support", label: "Customer Support", icon: Headphones },
  { href: "/admin/help", label: "Help Center", icon: HelpCircle },
];

function SidebarContent({ user, counts, pathname, isDark, currentAccent, onCloseMobile }) {
  return (
    <div
      className={`flex flex-col h-full select-none border-r transition-colors duration-200 ${
        isDark
          ? "bg-[#0F1420] border-[#1E293B] text-slate-300"
          : "bg-[#FAFAFA] border-slate-200/80 text-slate-600"
      }`}
    >
      {/* 1. TOP AGENCY / WORKSPACE SELECTOR */}
      <div
        className={`p-4 border-b border-dashed ${
          isDark ? "border-[#1E293B]" : "border-slate-200/80"
        }`}
      >
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
            isDark
              ? "bg-[#141C2E] border-[#22314E] hover:border-[#31456E]"
              : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo Squircle with Gradient matching Accent */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs text-white bg-gradient-to-tr ${currentAccent.gradient}`}
            >
              <span className="font-mono text-base drop-shadow-xs">H</span>
            </div>

            <div className="min-w-0 text-left">
              <span
                className={`block text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Atelier Brand
              </span>
              <span
                className={`block text-xs font-bold truncate ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                HDC Fashion Studio
              </span>
            </div>
          </div>

          <ChevronsUpDown
            className={`w-4 h-4 shrink-0 ${
              isDark ? "text-slate-400" : "text-slate-400"
            }`}
          />
        </div>
      </div>

      {/* 2. GROUPED NAVIGATION MENUS */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.heading} className="space-y-1">
            <div
              className={`px-3 pb-1.5 text-[11px] font-bold tracking-tight uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-400"
              }`}
            >
              {section.heading}
            </div>

            {section.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              const badge = item.badgeKey ? counts[item.badgeKey] : null;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? isDark
                        ? "bg-[#182236] text-white shadow-xs border border-[#253450]"
                        : "bg-white text-slate-950 shadow-xs border border-slate-200/80"
                      : isDark
                      ? "text-slate-400 hover:text-white hover:bg-[#141C2E]"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? isDark
                            ? currentAccent.activeTextDark
                            : currentAccent.activeTextLight
                          : isDark
                          ? "text-slate-400 group-hover:text-slate-200"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        isDark
                          ? currentAccent.bgActiveDark
                          : currentAccent.bgActiveLight
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. FOOTER ITEMS */}
      <div
        className={`p-3 border-t border-dashed space-y-0.5 ${
          isDark ? "border-[#1E293B]" : "border-slate-200/80"
        }`}
      >
        {FOOTER_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-[#141C2E]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminSidebar({ user, initialCounts = {} }) {
  const pathname = usePathname();
  const { theme, currentAccent } = useTheme();
  const isDark = theme === "dark";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const counts = {
    pendingOrders: initialCounts.pendingOrders || 12,
    newQuotes: initialCounts.newQuotes || 9,
  };

  return (
    <>
      {/* Mobile Bar */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between border-b ${
          isDark
            ? "bg-[#0F1420] border-[#1E293B] text-white"
            : "bg-[#FAFAFA] border-slate-200 text-slate-900"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-extrabold text-sm tracking-tight">
          HDC Fashion Admin
        </span>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Desktop Sidebar (w-60) */}
      <aside className="hidden lg:block w-60 shrink-0 h-full z-30">
        <SidebarContent
          user={user}
          counts={counts}
          pathname={pathname}
          isDark={isDark}
          currentAccent={currentAccent}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] h-full z-10 animate-in slide-in-from-left duration-200">
            <SidebarContent
              user={user}
              counts={counts}
              pathname={pathname}
              isDark={isDark}
              currentAccent={currentAccent}
              onCloseMobile={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
