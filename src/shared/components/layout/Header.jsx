"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO, PRODUCTS } from "@/shared/data";
import UserMenu from "./UserMenu";
import {
  Phone,
  Search,
  Heart,
  ShoppingBag,
  Sparkles,
  ClipboardList,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Crown,
  Briefcase,
  Activity,
  GraduationCap,
  PackageCheck,
  ArrowRight,
  Palette,
} from "lucide-react";
import { CATEGORIES } from "@/shared/data";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";

// ============================================================
// MAP ICON CHO CATEGORY
// ============================================================
const catIconMap = {
  Briefcase: Briefcase,
  Crown: Crown,
  Activity: Activity,
  GraduationCap: GraduationCap,
  PackageCheck: PackageCheck,
  Palette: Palette,
};

// ============================================================
// MENU CHÍNH — Cấu trúc mới cho multi-page
// ============================================================
const MAIN_NAV = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/gioi-thieu" },
  {
    label: "Sản Phẩm",
    href: "/dong-phuc-doanh-nghiep",
    hasDropdown: true,
    children: [
      {
        label: "Đồng Phục Doanh Nghiệp",
        href: "/dong-phuc-doanh-nghiep",
        desc: "Polo cao cấp, sơ mi công sở chuẩn form",
        icon: "Briefcase",
      },
      {
        label: "Đồng Phục May Đo",
        href: "/dong-phuc-may-do",
        desc: "Vest lãnh đạo, bespoke đo ni từng nhân sự",
        icon: "Crown",
      },
      {
        label: "Đồng Phục Thể Thao & Golf",
        href: "/dong-phuc-the-thao",
        desc: "Giải Golf, Pickleball, Marathon, Team building",
        icon: "Activity",
      },
      {
        label: "Đồng Phục Trường Học",
        href: "/dong-phuc-truong-hoc",
        desc: "Học sinh các cấp, sinh viên, giáo viên",
        icon: "GraduationCap",
      },
      {
        label: "Phụ Kiện Doanh Nghiệp",
        href: "/phu-kien-doanh-nghiep",
        desc: "Mũ nón, cặp da, túi quà tặng thương hiệu",
        icon: "PackageCheck",
      },
      {
        label: "Tự Thiết Kế & Gửi Mẫu",
        href: "/thiet-ke-dong-phuc",
        desc: "Studio 2D phối màu, chèn logo & nhận áo mẫu 0đ",
        icon: "Palette",
        badge: "HOT",
      },
    ],
  },
  { label: "Bảng Vải", href: "/bang-vai" },
  { label: "Quy Trình", href: "/quy-trinh-may-dong-phuc-doanh-nghiep" },
  { label: "Liên Hệ", href: "/lien-he" },
];

// Dùng lại danh mục, URL và ảnh hiện có cho phần trình bày mega menu.
const PRODUCT_MENU_COLUMNS = MAIN_NAV.find((item) => item.hasDropdown)
  .children.flatMap((child) => {
    const category = SITE_HIERARCHY.categories[child.href.slice(1)];
    if (!category) return [];

    return [{
      ...child,
      title: category.shortTitle,
      image: CATEGORIES.find((entry) => entry.slug === category.id)?.image,
      links: category.subcategories
        .map((href) => SITE_HIERARCHY.categories[href.slice(1)])
        .filter(Boolean),
    }];
  });

const PRODUCT_MENU_BANNERS = PRODUCT_MENU_COLUMNS.filter(
  (column) => column.icon === "Briefcase" || column.icon === "Activity"
);

// ============================================================
// HOVER DELAY — Chờ 150ms trước khi đóng menu
// để user có thời gian di chuột từ button xuống dropdown
// ============================================================
const HOVER_CLOSE_DELAY = 180;

// Các nội dung thuộc module Quy Trình dùng chung một trạng thái active trong navigation.
const PROCESS_MODULE_PATHS = new Set([
  "/quy-trinh-may-dong-phuc-doanh-nghiep",
  "/bao-gia-dong-phuc-cong-ty",
  "/cach-thiet-ke-logo-ao-dong-phuc",
  "/xu-huong-dong-phuc-2026",
]);

export default function Header() {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsQuickQuoteOpen,
    setIsOrderTrackingOpen,
    setQuickViewProduct,
  } = useShop();

  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // ✅ Dropdown hover state
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimerRef = useRef(null);

  // Mobile menu: category sub-menu mở/đóng
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // ============================================================
  // HOVER HANDLERS
  // ============================================================
  const handleMouseEnter = (menuLabel) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(menuLabel);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, HOVER_CLOSE_DELAY);
  };

  // Cleanup timer khi unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Đóng dropdown khi đổi route
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lắng nghe scroll để áp dụng hiệu ứng nổi cố định cho Header
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelectSearchResult = (product) => {
    setQuickViewProduct(product);
    setSearchQuery("");
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  // ============================================================
  // HELPER: Check link active
  // ============================================================
  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (
      href === "/quy-trinh-may-dong-phuc-doanh-nghiep" &&
      PROCESS_MODULE_PATHS.has(pathname)
    ) {
      return true;
    }
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const isDropdownActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => pathname.startsWith(child.href));
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#004f5e]/95 backdrop-blur-md text-white border-b border-brand-400/20 transition-shadow duration-300 ${
        isScrolled ? "shadow-2xl shadow-slate-950/30" : "shadow-lg"
      }`}
    >
      {/* =============================================
          TOP BAR
          ============================================= */}
      <div className="bg-[#003843] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-brand-500/10 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 shrink-0">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Ưu đãi 2026</span>
              <span className="sm:hidden">Ưu đãi</span>
            </span>
            <span className="hidden md:inline truncate">
              Miễn phí thiết kế 2D/3D & may áo mẫu thử 0đ trước khi sản xuất
            </span>
            <span className="hidden sm:inline md:hidden truncate">
              May mẫu thử 0đ • Thiết kế 3D free
            </span>
            <span className="hidden lg:inline text-slate-600 mx-1">|</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Bảo hành 1 đổi 1 trong 30 ngày
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium shrink-0">
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">
                Hotline/Zalo: <strong>{BRAND_INFO.contact.hotline}</strong>
              </span>
              <span className="sm:hidden font-bold">
                {BRAND_INFO.contact.hotline}
              </span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hidden md:flex items-center gap-1 hover:text-brand-300 transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Tra cứu đơn hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* =============================================
          MAIN NAVBAR
          ============================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* BRAND LOCKUP */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-4 group shrink-0"
        >
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform shrink-0 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon.png"
              alt="HDC FASHION Logo"
              className="w-full h-full object-contain p-1.5"
            />
          </div>

          <div className="hidden sm:block w-px h-10 sm:h-12 bg-gradient-to-b from-transparent via-brand-400/60 to-transparent shrink-0" />

          <div className="flex flex-col justify-center min-w-0 gap-1">
            <div className="flex items-baseline gap-1.5 sm:gap-2 leading-none">
              <span className="font-black text-xl sm:text-2xl lg:text-[26px] tracking-[0.15em] text-white leading-none">
                HDC
              </span>
              <span className="hidden sm:inline text-[10px] sm:text-xs lg:text-[13px] font-semibold text-brand-400/80 tracking-[0.2em] uppercase leading-none">
                Fashion
              </span>
            </div>
            <div className="hidden sm:block h-px w-full max-w-[130px] bg-gradient-to-r from-brand-400/60 via-brand-400/30 to-transparent" />
            <span className="hidden sm:block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-brand-400/85 font-semibold leading-none">
              Đồng phục doanh nghiệp cao cấp
            </span>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm polo, vest doanh nhân, đồng phục golf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {searchFocused && searchQuery.trim() && (
            <div
              className="absolute left-0 right-0 top-full mt-2 bg-[#003843] border border-brand-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="p-2 text-xs font-semibold text-brand-400 border-b border-slate-800">
                Gợi ý tìm kiếm ({searchResults.length} kết quả)
              </div>
              {searchResults.length > 0 ? (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-[#007f96] rounded-xl transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-brand-400 font-bold">
                          Từ {item.price.toLocaleString("vi-VN")} đ/{item.unit}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không tìm thấy mẫu phù hợp. Gọi hotline{" "}
                  <strong className="text-brand-300">0984.959.586</strong> để
                  tư vấn may riêng!
                </div>
              )}
            </div>
          )}
        </div>

        {/* =============================================
            Action icons
            ============================================= */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setMobileSearchOpen(true)}
            title="Tìm kiếm sản phẩm"
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-brand-400 hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/tai-khoan?tab=wishlist"
            title="Sản phẩm yêu thích"
            className="hidden sm:block relative p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-brand-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-full bg-slate-800/80 hover:bg-slate-800 text-brand-400 border border-slate-700 hover:border-brand-400 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden lg:inline text-xs font-bold text-white">
              Giỏ hàng
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-[11px] font-black rounded-full flex items-center justify-center sm:static sm:w-5 sm:h-5">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            style={{ whiteSpace: "nowrap" }}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-brand-500/20 transform hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current shrink-0" />
            <span>Báo Giá Nhanh</span>
          </button>

          <UserMenu />

          {/* Lối tắt vào trang Quản Trị (Admin) */}
          <Link
            href="/admin"
            title="Vào trang Quản Trị Hệ Thống (Admin)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white border border-brand-500/40 text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Quản Trị</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* =============================================
          DESKTOP NAV — DROPDOWN HOVER
          ============================================= */}
      <nav className="relative hidden lg:block bg-[#003843] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-2 xl:px-4 flex items-center text-[13px] font-medium">
          {MAIN_NAV.map((item) => {
            const active = isActive(item.href) || isDropdownActive(item);

            if (item.hasDropdown) {
              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    style={{ whiteSpace: "nowrap" }}
                    className={`flex items-center gap-1.5 px-4 py-3 transition-colors ${
                      active
                        ? "text-brand-300 border-b-2 border-brand-400"
                        : "text-slate-300 hover:text-brand-300"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* DROPDOWN PANEL */}
                  {isOpen && (
                    <div
                      className="absolute inset-x-4 top-full z-50 pt-1 xl:inset-x-6"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-950/10 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="grid grid-cols-[minmax(0,1fr)_240px] items-start gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8 xl:p-8 2xl:grid-cols-[minmax(0,1fr)_360px] 2xl:gap-10 2xl:p-10">
                          <div className="grid min-w-0 grid-cols-3 gap-x-6 gap-y-8 xl:grid-cols-5 xl:gap-x-5 2xl:gap-x-8">
                            {PRODUCT_MENU_COLUMNS.map((column) => (
                              <div key={column.href} className="min-w-0">
                                <Link
                                  href={column.href}
                                  title={column.label}
                                  className={`group mb-3 flex min-h-10 items-start justify-between gap-2 text-[13px] font-extrabold uppercase leading-5 tracking-wide transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${
                                    pathname.startsWith(column.href)
                                      ? "text-brand-700"
                                      : "text-slate-900"
                                  }`}
                                >
                                  <span>{column.title}</span>
                                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                                <ul className="space-y-1 text-[13px] leading-6 xl:text-sm">
                                  <li>
                                    <Link
                                      href={column.href}
                                      aria-current={pathname === column.href ? "page" : undefined}
                                      className={`block py-1 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600 ${pathname === column.href ? "font-semibold text-brand-700" : "text-slate-600"}`}
                                    >
                                      Tất cả
                                    </Link>
                                  </li>
                                  {column.links.map((category) => (
                                    <li key={category.url}>
                                      <Link
                                        href={category.url}
                                        aria-current={pathname === category.url ? "page" : undefined}
                                        className={`block py-1 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600 ${pathname === category.url ? "font-semibold text-brand-700" : "text-slate-600"}`}
                                      >
                                        {category.shortTitle}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="min-w-0 space-y-4 2xl:space-y-5">
                            {PRODUCT_MENU_BANNERS.map((banner) => (
                              <Link
                                key={banner.href}
                                href={banner.href}
                                className="group relative block aspect-[2.5/1] overflow-hidden rounded-xl bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
                              >
                                <Image
                                  src={banner.image}
                                  alt={banner.label}
                                  fill
                                  sizes="(min-width: 1536px) 360px, (min-width: 1280px) 300px, 240px"
                                  quality={85}
                                  className="object-cover object-[center_35%] transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent" />
                                <div className="absolute inset-0 flex items-end justify-between gap-3 p-4 text-white xl:p-5">
                                  <span className="max-w-[80%] text-sm font-extrabold leading-5 xl:text-base">
                                    {banner.label}
                                  </span>
                                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </div>
                              </Link>
                            ))}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <span className="text-slate-500">
                                Cần tư vấn riêng cho doanh nghiệp?
                              </span>
                              <button
                                onClick={() => setIsQuickQuoteOpen(true)}
                                className="flex items-center gap-1 font-bold text-brand-600 transition-colors hover:text-brand-700"
                              >
                                <Sparkles className="h-3 w-3" />
                                Báo giá ngay
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-flow-col auto-cols-fr items-stretch divide-x divide-slate-200 border-t border-slate-200 bg-[#f5f5f5] text-center text-[11px] font-bold uppercase leading-5 tracking-wide xl:text-xs">
                          <span className="flex items-center justify-center px-3 py-4 text-slate-500">
                            Theo nhu cầu
                          </span>
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3 py-4 text-slate-700 transition-colors hover:bg-white hover:text-brand-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
                            >
                              <span>{PRODUCT_MENU_COLUMNS.find((column) => column.href === child.href)?.title || child.label}</span>
                              {child.badge && (
                                <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-black leading-3 text-slate-950">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                style={{ whiteSpace: "nowrap" }}
                className={`px-4 py-3 transition-colors ${
                  active
                    ? "text-brand-300 border-b-2 border-brand-400 font-semibold"
                    : "text-slate-300 hover:text-brand-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =============================================
          MOBILE SEARCH OVERLAY
          ============================================= */}
      {mobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#004f5e] p-4 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-3 flex items-center gap-3 bg-slate-900/60 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white line-clamp-2">
                          {item.title}
                        </div>
                        <div className="text-xs text-brand-400 font-bold mt-1">
                          Từ {item.price.toLocaleString("vi-VN")} đ/{item.unit}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm text-slate-400">
                    Không tìm thấy mẫu phù hợp
                  </p>
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi tư vấn: {BRAND_INFO.contact.hotline}</span>
                  </a>
                </div>
              )
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Tìm kiếm phổ biến
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 px-4">
                  {["Polo", "Sơ mi", "Vest", "Golf", "Học sinh", "Mũ"].map(
                    (kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        {kw}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =============================================
          MOBILE DRAWER NAV
          ============================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className={`absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#004f5e] border-l border-slate-800 overflow-y-auto ${mobileCategoryOpen ? "md:w-[760px]" : ""}`}>
            <div className="sticky top-0 bg-[#004f5e] p-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="relative w-9 h-9 aspect-square overflow-hidden bg-white rounded-lg flex items-center justify-center shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icon.png"
                    alt="HDC Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="font-bold text-white text-sm uppercase tracking-wider">
                  Menu
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsQuickQuoteOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-brand-400 to-brand-600 text-white font-bold text-center rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Nhận Báo Giá Nhanh 3 Phút
              </button>

              {/* Lối tắt quản trị trên Mobile */}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3.5 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-300 font-bold text-xs rounded-xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>Trang Quản Trị (Admin)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* NAV CHÍNH */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Điều hướng
                </span>

                {MAIN_NAV.map((item) => {
                  if (item.hasDropdown) {
                    return (
                      <div key={item.label}>
                        <button
                          onClick={() =>
                            setMobileCategoryOpen(!mobileCategoryOpen)
                          }
                          className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg font-semibold transition-colors ${
                            pathname.startsWith("/dong-phuc") ||
                            pathname.startsWith("/phu-kien") ||
                            pathname.startsWith("/thiet-ke") ||
                            pathname.startsWith("/tu-thiet-ke")
                              ? "text-brand-300 bg-slate-800/50"
                              : "text-slate-200 hover:bg-slate-800"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              mobileCategoryOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {mobileCategoryOpen && (
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-l-2 border-brand-500/40 pl-2 md:pl-3">
                            {item.children.map((child) => {
                              const Icon =
                                catIconMap[child.icon] || Briefcase;
                              const childActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center w-full min-w-0 gap-2 p-2 md:gap-3 md:p-3 rounded-xl text-sm transition-colors ${
                                    childActive
                                      ? "text-brand-300 font-bold bg-slate-800"
                                      : "text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  <div className="w-10 h-10 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0 wrap-break-word">
                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-bold leading-5">
                                      <span>{child.label}</span>
                                      {child.badge && (
                                        <span className="shrink-0 px-1.5 py-0.5 text-[8px] font-black uppercase rounded bg-amber-400 text-slate-950">
                                          {child.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-1 text-xs leading-5 font-normal text-slate-400">
                                      {child.desc}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 ml-auto shrink-0 text-brand-300" />
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 px-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "text-brand-300 font-semibold bg-slate-800/50"
                          : "text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* CALLS */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="w-full py-3 bg-slate-800 text-brand-400 border border-brand-500/40 font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Gọi: {BRAND_INFO.contact.hotline}
                </a>
                <a
                  href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0068FF] text-white font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#0055d4] shadow-md shadow-blue-500/20 transition-all"
                >
                  Chat Zalo ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
