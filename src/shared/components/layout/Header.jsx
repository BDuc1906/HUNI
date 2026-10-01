"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  ChevronRight,
  ShieldCheck,
  User,
  LogIn,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Crown,
  Briefcase,
  Activity,
  GraduationCap,
  PackageCheck,
  ArrowRight,
  ArrowLeft,
  Shirt,
  Layers,
  Ruler,
  Newspaper,
  Network,
  Award,
  Zap,
  Building2,
  Users,
  Trophy,
  Scissors,
  Home,
  Info,
  BookOpen,
  Flame,
} from "lucide-react";

// ============================================================
// MENU CHÍNH — 8 MỤC CÂN ĐỐI THEO CÂY ĐẶC TẢ
// ============================================================
const MAIN_NAV = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu", href: "/gioi-thieu" },
  {
    label: "Sản Phẩm & Đồng Phục",
    href: "/dong-phuc-doanh-nghiep",
    isMegaMenu: true,
  },
  { label: "Bảng Vải", href: "/bang-vai" },
  { label: "Quy Trình", href: "/quy-trinh-may" },
  {
    label: "Cẩm Nang / Blog",
    href: "/blog",
    isBlogDropdown: true,
  },
  { label: "Liên Hệ", href: "/lien-he" },
];

const HOVER_CLOSE_DELAY = 200;

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
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Dropdown hover state
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimerRef = useRef(null);

  // Mobile menu accordion states (Mặc định đóng false, không tự động show ra)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);

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

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileBlogOpen(false);
  }, [pathname]);

  // Search logic
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

  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      {/* =============================================
          1. TOP ANNOUNCEMENT BAR (Deep Brand Teal #003843)
          ============================================= */}
      <div className="bg-[#003843] text-slate-200 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-brand-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Perks */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-500/25 text-brand-300 font-bold border border-brand-400/30 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Ưu đãi 2026</span>
            </span>
            <span className="hidden md:inline truncate text-slate-300">
              Miễn phí thiết kế 2D/3D &amp; May áo mẫu thử 0đ trước khi sản xuất hàng loạt
            </span>
            <span className="hidden sm:inline md:hidden truncate text-slate-300">
              May mẫu thử 0đ • Thiết kế 3D free
            </span>
            <span className="hidden lg:inline text-slate-600 mx-1">|</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-300 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Bảo hành 1 đổi 1 trong 30 ngày
            </span>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium shrink-0">
            <Link
              href="/blog/size-ao-so-mi-nam"
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-brand-300 transition-colors"
            >
              <Ruler className="w-3.5 h-3.5 text-brand-400" />
              <span>Bảng size chuẩn</span>
            </Link>
            <span className="hidden lg:inline text-slate-700">|</span>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-brand-300 transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5 text-brand-400" />
              <span>Tra cứu đơn hàng</span>
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="flex items-center gap-1.5 text-brand-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse text-brand-400" />
              <span className="hidden sm:inline">
                Hotline: <strong>{BRAND_INFO.contact.hotline}</strong>
              </span>
              <span className="sm:hidden font-bold">
                {BRAND_INFO.contact.hotline}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* =============================================
          2. MAIN NAVBAR (Crisp Pure White — Tôn Logo Teal)
          ============================================= */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* BRAND LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            title="HDC FASHION - Về trang chủ"
          >
            <div className="relative h-11 sm:h-12 w-36 sm:w-44 flex items-center justify-start transform group-hover:scale-[1.02] transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="HDC FASHION Logo"
                className="h-full w-auto max-h-12 object-contain"
              />
            </div>
            <div className="hidden xl:flex flex-col justify-center border-l border-slate-200 pl-3">
              <span className="text-[11px] font-black tracking-widest text-[#003843] uppercase leading-tight">
                HDC GROUP VN
              </span>
              <span className="text-[9px] text-brand-600 font-semibold tracking-wider uppercase leading-tight">
                Đồng phục doanh nghiệp cao cấp
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sơ mi, polo, vest lãnh đạo, thể thao golf..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-10 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Suggestion Modal */}
            {searchFocused && searchQuery.trim() && (
              <div
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="p-2 text-xs font-bold text-brand-700 border-b border-slate-100 flex items-center justify-between">
                  <span>Gợi ý sản phẩm ({searchResults.length} kết quả)</span>
                  <span className="text-[10px] text-slate-400">Click để xem nhanh</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-brand-50/70 rounded-xl transition-colors"
                      >
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-brand-600 font-extrabold">
                            Từ {item.price.toLocaleString("vi-VN")} đ/{item.unit}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Không tìm thấy mẫu phù hợp. Gọi hotline{" "}
                    <strong className="text-brand-600">0984.959.586</strong> để tư vấn may theo yêu cầu!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              title="Tìm kiếm"
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/tai-khoan?tab=wishlist"
              title="Sản phẩm yêu thích"
              className="hidden sm:flex relative p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-brand-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <span className="hidden lg:inline text-xs font-bold text-slate-700">
                Giỏ hàng
              </span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-brand-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Quick Quote CTA Button */}
            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              style={{ whiteSpace: "nowrap" }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-brand-500/20 transform hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Báo Giá Nhanh</span>
            </button>

            <UserMenu />

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                if (!mobileMenuOpen) {
                  setMobileProductsOpen(false);
                  setMobileBlogOpen(false);
                }
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              aria-label="Menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* =============================================
          3. DESKTOP NAVIGATION BAR (Deep Teal #003843 — Cân đối 8 mục)
          ============================================= */}
      <nav className="hidden lg:block bg-[#003843] border-t border-brand-500/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[13px] font-semibold">
          <div className="flex items-center space-x-1 xl:space-x-2">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href);

              // -------------------------------------------------------------
              // A. MEGA MENU: SẢN PHẨM & ĐỒNG PHỤC (17 danh mục phân cấp)
              // -------------------------------------------------------------
              if (item.isMegaMenu) {
                const isOpen = openDropdown === "products";

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter("products")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3 xl:px-4 py-3 transition-colors ${
                        active || isOpen
                          ? "text-brand-300 border-b-2 border-brand-400 bg-[#004f5e]/40 font-bold"
                          : "text-slate-200 hover:text-brand-300"
                      }`}
                    >
                      <Shirt className="w-3.5 h-3.5 text-brand-400" />
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* MEGA MENU DROPDOWN PANEL */}
                    {isOpen && (
                      <div
                        className="fixed left-1/2 -translate-x-1/2 top-[108px] w-full max-w-7xl px-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={() => handleMouseEnter("products")}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 lg:p-7 grid grid-cols-12 gap-6 text-slate-800">
                          {/* Cột 1 (4.2 cols): Đồng Phục Doanh Nghiệp */}
                          <div className="col-span-12 lg:col-span-4 flex flex-col justify-between pr-3 lg:border-r border-slate-100">
                            <div>
                              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-100">
                                <Link
                                  href="/dong-phuc-doanh-nghiep"
                                  className="group/title flex items-center gap-2.5"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover/title:bg-brand-500 group-hover/title:text-white transition-colors">
                                    <Briefcase className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-sm text-[#003843] group-hover/title:text-brand-600 transition-colors flex items-center gap-1.5">
                                      <span>ĐỒNG PHỤC DOANH NGHIỆP</span>
                                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-brand-600" />
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                      Chuẩn phom dáng Châu Âu • Vải kháng khuẩn
                                    </span>
                                  </div>
                                </Link>
                              </div>

                              <ul className="space-y-2">
                                <li>
                                  <Link
                                    href="/dong-phuc-doanh-nghiep/ao-polo"
                                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Shirt className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                                          Áo Polo Đồng Phục
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 font-bold border border-brand-200">
                                          Bán chạy
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                        Vải Pique mắt chim &amp; Cotton Compact 100%
                                      </p>
                                    </div>
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    href="/dong-phuc-doanh-nghiep/ao-so-mi"
                                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Layers className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                                          Áo Sơ Mi Công Sở
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                          Chống nhăn
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                        Sợi tre Bamboo tự nhiên • Công nghệ Seamless
                                      </p>
                                    </div>
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    href="/dong-phuc-doanh-nghiep/ao-thun"
                                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Users className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors block">
                                        Áo Thun Teambuilding &amp; Sự Kiện
                                      </span>
                                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                        Cotton 4 chiều thoáng mát, in thêu logo sắc nét
                                      </p>
                                    </div>
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    href="/dong-phuc-doanh-nghiep/dong-phuc-cong-so"
                                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Building2 className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors block">
                                        Đồng Phục Công Sở (Quần tây, Chân váy)
                                      </span>
                                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                        Đứng form, sang trọng cho nam &amp; nữ văn phòng
                                      </p>
                                    </div>
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            <Link
                              href="/dong-phuc-doanh-nghiep"
                              className="text-xs font-extrabold text-brand-600 hover:text-brand-800 pt-3 border-t border-slate-100 flex items-center gap-1.5 transition-colors group/all"
                            >
                              <span>Xem tất cả danh mục doanh nghiệp</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" />
                            </Link>
                          </div>

                          {/* Cột 2 (2.8 cols): May Đo Bespoke & Thể Thao Golf */}
                          <div className="col-span-12 lg:col-span-3 space-y-5 pr-3 lg:border-r border-slate-100">
                            {/* May đo */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Crown className="w-4 h-4 text-brand-600" />
                                <Link
                                  href="/dong-phuc-may-do"
                                  className="font-extrabold text-xs uppercase tracking-wider text-slate-900 hover:text-brand-600 transition-colors"
                                >
                                  May Đo &amp; Vest Bespoke
                                </Link>
                              </div>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link
                                    href="/dong-phuc-may-do/vest-doanh-nhan"
                                    className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Scissors className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors block">
                                        Vest Lãnh Đạo &amp; Doanh Nhân
                                      </span>
                                      <span className="text-[11px] text-slate-400 block">
                                        Len Cashmere cao cấp, ve áo đứng form
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/dong-phuc-may-do/dam-cong-so"
                                    className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors block">
                                        Đầm Công Sở Thiết Kế
                                      </span>
                                      <span className="text-[11px] text-slate-400 block">
                                        Tôn dáng, chuẩn phong thái nữ lãnh đạo
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            {/* Thể thao & Golf */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Trophy className="w-4 h-4 text-brand-600" />
                                <Link
                                  href="/dong-phuc-the-thao"
                                  className="font-extrabold text-xs uppercase tracking-wider text-slate-900 hover:text-brand-600 transition-colors"
                                >
                                  Thể Thao &amp; Golf
                                </Link>
                              </div>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link
                                    href="/dong-phuc-the-thao/golf"
                                    className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Activity className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                                          Đồng Phục Golf &amp; Pickleball
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-slate-400 block">
                                        Dry-fit dệt tổ ong, hạ nhiệt 3°C, chống tia UV
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/dong-phuc-the-thao/marathon"
                                    className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                      <Flame className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors block">
                                        Đồng Phục Chạy Bộ Marathon
                                      </span>
                                      <span className="text-[11px] text-slate-400 block">
                                        Chất vải siêu nhẹ, thoát nhiệt tức thì
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Cột 3 (2.5 cols): Trường Học & Phụ Kiện */}
                          <div className="col-span-12 lg:col-span-2 space-y-5 pr-2">
                            {/* Trường học */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <GraduationCap className="w-4 h-4 text-brand-600" />
                                <Link
                                  href="/dong-phuc-truong-hoc"
                                  className="font-extrabold text-xs uppercase tracking-wider text-slate-900 hover:text-brand-600 transition-colors"
                                >
                                  Trường Học
                                </Link>
                              </div>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link
                                    href="/dong-phuc-truong-hoc/hoc-sinh"
                                    className="block p-1.5 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors"
                                  >
                                    <span className="text-xs font-bold text-slate-800 block">
                                      Đồng phục học sinh
                                    </span>
                                    <span className="text-[11px] text-slate-400 block">
                                      Chất liệu thân thiện làn da
                                    </span>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/dong-phuc-truong-hoc/giao-vien"
                                    className="block p-1.5 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors"
                                  >
                                    <span className="text-xs font-bold text-slate-800 block">
                                      Đồng phục giáo viên
                                    </span>
                                    <span className="text-[11px] text-slate-400 block">
                                      Trang nhã, chỉn chu
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            {/* Phụ kiện */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <PackageCheck className="w-4 h-4 text-brand-600" />
                                <Link
                                  href="/phu-kien-doanh-nghiep"
                                  className="font-extrabold text-xs uppercase tracking-wider text-slate-900 hover:text-brand-600 transition-colors"
                                >
                                  Phụ Kiện DN
                                </Link>
                              </div>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link
                                    href="/phu-kien-doanh-nghiep/mu-non"
                                    className="block p-1.5 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors"
                                  >
                                    <span className="text-xs font-bold text-slate-800 block">
                                      Mũ nón thêu 3D
                                    </span>
                                    <span className="text-[11px] text-slate-400 block">
                                      Lưỡi trai, bucket thời trang
                                    </span>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href="/phu-kien-doanh-nghiep/ca-vat"
                                    className="block p-1.5 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors"
                                  >
                                    <span className="text-xs font-bold text-slate-800 block">
                                      Cà vạt, nơ &amp; thắt lưng
                                    </span>
                                    <span className="text-[11px] text-slate-400 block">
                                      Dệt logo độc quyền
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Cột 4 (2.5 cols): Showcase Card Đẳng Cấp Có Ảnh Thật */}
                          <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden relative shadow-lg flex flex-col justify-between p-5 text-white bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#007f96]">
                            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                              <Image
                                src="/images/uniform_polo_corporate.jpg"
                                alt="HDC Uniform Showcase"
                                fill
                                sizes="320px"
                                className="object-cover"
                              />
                            </div>
                            <div className="relative z-10">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-brand-200 text-[10px] font-extrabold uppercase tracking-wider mb-2.5 border border-white/20">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Đặc quyền B2B</span>
                              </span>
                              <h4 className="font-extrabold text-base leading-snug mb-2 text-white">
                                MAY MẪU THỬ 0Đ TẬN VĂN PHÒNG
                              </h4>
                              <p className="text-xs text-slate-200 leading-relaxed">
                                HDC cử chuyên viên mang mẫu áo, bảng vải và thước đo đến tận nơi để duyệt form trước khi may loạt.
                              </p>
                            </div>

                            <div className="relative z-10 space-y-2 pt-4">
                              <button
                                onClick={() => setIsQuickQuoteOpen(true)}
                                className="w-full py-2.5 bg-white hover:bg-slate-100 text-[#004f5e] font-extrabold text-xs rounded-xl shadow-md transition-transform active:scale-95 text-center flex items-center justify-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                                <span>Báo Giá Nhanh 5 Phút</span>
                              </button>
                              <a
                                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                                className="w-full py-2 bg-brand-500/40 hover:bg-brand-500/70 text-white font-bold text-xs rounded-xl border border-brand-300/30 transition-colors text-center block"
                              >
                                Hotline: {BRAND_INFO.contact.hotline}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // -------------------------------------------------------------
              // B. DROPDOWN: CẨM NANG / BLOG
              // -------------------------------------------------------------
              if (item.isBlogDropdown) {
                const isOpen = openDropdown === "blog";

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter("blog")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3 xl:px-4 py-3 transition-colors ${
                        active || isOpen
                          ? "text-brand-300 border-b-2 border-brand-400 bg-[#004f5e]/40 font-bold"
                          : "text-slate-200 hover:text-brand-300"
                      }`}
                    >
                      <Newspaper className="w-3.5 h-3.5 text-brand-400" />
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="absolute left-0 top-full pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={() => handleMouseEnter("blog")}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-3 text-slate-800">
                          <div className="p-2 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-black text-xs uppercase tracking-wider text-brand-700">
                              CẨM NANG &amp; BÁO GIÁ
                            </span>
                            <Link
                              href="/blog"
                              className="text-[11px] font-bold text-brand-600 hover:underline"
                            >
                              Tất cả 10 bài viết →
                            </Link>
                          </div>

                          <div className="py-2 space-y-1">
                            <Link
                              href="/blog/size-ao-so-mi-nam"
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-50 transition-colors text-xs font-bold text-slate-800 hover:text-brand-700"
                            >
                              <div className="flex items-center gap-2">
                                <Ruler className="w-3.5 h-3.5 text-brand-600" />
                                <span>Bảng Size Áo Sơ Mi Nam Chuẩn</span>
                              </div>
                              <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full font-bold">
                                Bảng size
                              </span>
                            </Link>

                            <Link
                              href="/blog/bao-gia-dong-phuc-cong-ty"
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-50 transition-colors text-xs font-bold text-slate-800 hover:text-brand-700"
                            >
                              <div className="flex items-center gap-2">
                                <Award className="w-3.5 h-3.5 text-brand-600" />
                                <span>Báo Giá Đồng Phục Công Ty 2026</span>
                              </div>
                              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                                Mới nhất
                              </span>
                            </Link>

                            <Link
                              href="/blog/xu-huong-dong-phuc-2026"
                              className="flex items-center gap-2 p-2 rounded-xl hover:bg-brand-50 transition-colors text-xs font-semibold text-slate-700 hover:text-brand-700"
                            >
                              <Zap className="w-3.5 h-3.5 text-brand-600" />
                              <span>5 Xu Hướng Đồng Phục Doanh Nghiệp 2026</span>
                            </Link>

                            <Link
                              href="/blog/chat-lieu-vai-dong-phuc-tot-nhat"
                              className="flex items-center gap-2 p-2 rounded-xl hover:bg-brand-50 transition-colors text-xs font-semibold text-slate-700 hover:text-brand-700"
                            >
                              <Layers className="w-3.5 h-3.5 text-brand-600" />
                              <span>Top 7 Chất Liệu Vải Tốt Nhất</span>
                            </Link>

                            <Link
                              href="/blog/cach-thiet-ke-logo-ao-dong-phuc"
                              className="flex items-center gap-2 p-2 rounded-xl hover:bg-brand-50 transition-colors text-xs font-semibold text-slate-700 hover:text-brand-700"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                              <span>Cách Thiết Kế &amp; Thêu Logo Áo</span>
                            </Link>
                          </div>

                          <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
                            <span>HDC Content Hub</span>
                            <Link href="/blog" className="font-bold text-brand-600 hover:underline">
                              Khám phá ngay →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // -------------------------------------------------------------
              // C. STANDARD LINKS (Trang Chủ, Giới Thiệu, Bảng Vải, Quy Trình, Sơ Đồ Website, Liên Hệ)
              // -------------------------------------------------------------
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 xl:px-4 py-3 transition-colors ${
                    active
                      ? "text-brand-300 border-b-2 border-brand-400 bg-[#004f5e]/40 font-bold"
                      : "text-slate-200 hover:text-brand-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Consultation Badge */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-brand-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Xưởng may sẵn sàng nhận đơn 2026</span>
          </div>
        </div>
      </nav>

      {/* =============================================
          4. MOBILE SEARCH OVERLAY
          ============================================= */}
      {mobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#003843] p-4 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Tìm áo sơ mi, polo, vest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-400"
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
                      className="w-full text-left p-3 flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="56px"
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
                  <p className="text-sm text-slate-400">Không tìm thấy mẫu phù hợp</p>
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
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Tìm kiếm phổ biến
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {["Sơ mi nam", "Polo", "Vest doanh nhân", "Golf", "Học sinh", "Mũ nón"].map(
                    (kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className="px-3 py-1.5 rounded-full bg-slate-800 text-brand-300 text-xs font-semibold border border-slate-700"
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
          5. MOBILE DRAWER NAV (Luxury, Chuẩn Mực, Không Lỗ Hổng Trắng)
          ============================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop mờ mượt mà */}
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="absolute top-0 right-0 bottom-0 w-[320px] sm:w-[360px] max-w-[88vw] bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Vùng cuộn nội dung chính */}
            <div className="flex-1 overflow-y-auto">
              {/* 1. Drawer Header sang trọng */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-2xs">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#003843] flex items-center justify-center p-1.5 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/icon.png"
                      alt="HDC FASHION"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-black text-sm text-[#003843] tracking-wider leading-none">
                      HDC FASHION
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-brand-600 font-bold mt-1">
                      Đồng Phục Doanh Nghiệp
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Top Auth Card — Khối tài khoản & Đăng nhập / Đăng ký (Chia 2 cột không bao giờ tràn viền) */}
              <div className="p-3 mx-3.5 mt-3 rounded-2xl bg-gradient-to-b from-[#f0f9fb] to-slate-50 border border-brand-200/70 shadow-2xs">
                {session?.user ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-800 truncate">
                          {session.user.name || "Khách Hàng HDC"}
                        </div>
                        <div className="text-[10px] text-brand-700 font-semibold truncate">
                          {session.user.email || "Đã đăng nhập"}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-extrabold shadow-xs transition-colors shrink-0"
                    >
                      Quản lý
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          Tài Khoản HDC
                        </div>
                        <div className="text-[10px] text-brand-600 font-medium truncate">
                          Ưu đãi may mẫu 0đ &amp; Báo giá nhanh
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-800 text-[11px] font-bold text-center shadow-2xs transition-all flex items-center justify-center gap-1"
                      >
                        <LogIn className="w-3 h-3 text-brand-600 shrink-0" />
                        <span>Đăng nhập</span>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-1.5 px-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold text-center shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Đăng ký</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Quick Utilities Strip — Tra cứu đơn hàng & Bảng size chuẩn */}
              <div className="grid grid-cols-2 gap-2 px-3.5 mt-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsOrderTrackingOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 text-[11px] font-bold text-slate-700 hover:text-brand-700 transition-colors"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">Tra cứu đơn hàng</span>
                </button>
                <Link
                  href="/blog/size-ao-so-mi-nam"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 text-[11px] font-bold text-slate-700 hover:text-brand-700 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">Bảng size chuẩn</span>
                </Link>
              </div>

              {/* 4. Danh sách Navigation Links chính */}
              <div className="p-3.5 space-y-1 text-sm font-semibold text-slate-800">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === "/" ? "bg-brand-50 text-brand-800 font-extrabold" : "hover:bg-slate-100"
                  }`}
                >
                  <Home className="w-4 h-4 text-brand-600" />
                  <span>Trang Chủ</span>
                </Link>

                <Link
                  href="/gioi-thieu"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === "/gioi-thieu" ? "bg-brand-50 text-brand-800 font-extrabold" : "hover:bg-slate-100"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>Giới Thiệu &amp; Năng Lực HDC</span>
                </Link>

                {/* Collapsible: Sản phẩm & Đồng Phục (Mặc định ĐÓNG, chỉ mở khi người dùng ấn vào) */}
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden my-2 shadow-2xs">
                  <button
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-brand-50 to-slate-50 text-brand-900 font-black text-xs uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-brand-600" />
                      <span>SẢN PHẨM &amp; ĐỒNG PHỤC</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform text-brand-600 ${
                        mobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileProductsOpen && (
                    <div className="p-2 space-y-1.5 text-xs divide-y divide-slate-100 bg-white">
                      {/* Doanh nghiệp */}
                      <div className="pt-1">
                        <Link
                          href="/dong-phuc-doanh-nghiep"
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-extrabold text-[#003843] flex items-center justify-between p-1.5 hover:text-brand-600"
                        >
                          <span>Đồng Phục Doanh Nghiệp</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">Hot</span>
                        </Link>
                        <div className="pl-3 space-y-1 text-[11px] text-slate-600 mt-1">
                          <Link href="/dong-phuc-doanh-nghiep/ao-polo" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Áo Polo đồng phục cao cấp
                          </Link>
                          <Link href="/dong-phuc-doanh-nghiep/ao-so-mi" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-bold text-brand-700 hover:text-brand-800">
                            • Áo Sơ Mi công sở (Chống nhăn)
                          </Link>
                          <Link href="/dong-phuc-doanh-nghiep/ao-thun" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Áo thun teambuilding &amp; sự kiện
                          </Link>
                          <Link href="/dong-phuc-doanh-nghiep/dong-phuc-cong-so" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Quần tây &amp; chân váy công sở
                          </Link>
                        </div>
                      </div>

                      {/* May đo */}
                      <div className="pt-2">
                        <Link
                          href="/dong-phuc-may-do"
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-extrabold text-[#003843] flex items-center justify-between p-1.5 hover:text-brand-600"
                        >
                          <span>May Đo Cao Cấp &amp; Vest</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        <div className="pl-3 space-y-1 text-[11px] text-slate-600 mt-1">
                          <Link href="/dong-phuc-may-do/vest-doanh-nhan" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Vest lãnh đạo &amp; doanh nhân
                          </Link>
                          <Link href="/dong-phuc-may-do/dam-cong-so" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Đầm công sở thiết kế
                          </Link>
                        </div>
                      </div>

                      {/* Thể thao */}
                      <div className="pt-2">
                        <Link
                          href="/dong-phuc-the-thao"
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-extrabold text-[#003843] flex items-center justify-between p-1.5 hover:text-brand-600"
                        >
                          <span>Thể Thao &amp; Golf</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-bold">2026</span>
                        </Link>
                        <div className="pl-3 space-y-1 text-[11px] text-slate-600 mt-1">
                          <Link href="/dong-phuc-the-thao/golf" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Đồng phục Golf &amp; Pickleball
                          </Link>
                          <Link href="/dong-phuc-the-thao/marathon" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Đồng phục chạy bộ Marathon
                          </Link>
                        </div>
                      </div>

                      {/* Trường học & Phụ kiện */}
                      <div className="pt-2">
                        <Link
                          href="/dong-phuc-truong-hoc"
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-extrabold text-[#003843] flex items-center justify-between p-1.5 hover:text-brand-600"
                        >
                          <span>Trường Học &amp; Phụ Kiện</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        <div className="pl-3 space-y-1 text-[11px] text-slate-600 mt-1">
                          <Link href="/dong-phuc-truong-hoc/hoc-sinh" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Đồng phục học sinh &amp; sinh viên
                          </Link>
                          <Link href="/phu-kien-doanh-nghiep/mu-non" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-brand-600">
                            • Mũ nón in thêu 3D, cà vạt, nơ
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/bang-vai"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === "/bang-vai" ? "bg-brand-50 text-brand-800 font-extrabold" : "hover:bg-slate-100"
                  }`}
                >
                  <Layers className="w-4 h-4 text-brand-600" />
                  <span>Bảng So Sánh Vải</span>
                </Link>

                <Link
                  href="/quy-trinh-may"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === "/quy-trinh-may" ? "bg-brand-50 text-brand-800 font-extrabold" : "hover:bg-slate-100"
                  }`}
                >
                  <Scissors className="w-4 h-4 text-brand-600" />
                  <span>Quy Trình May 5 Bước</span>
                </Link>

                {/* Collapsible: Blog / Cẩm nang */}
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden my-2 shadow-2xs">
                  <button
                    onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-brand-600" />
                      <span>Cẩm Nang &amp; Báo Giá</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform text-slate-500 ${
                        mobileBlogOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileBlogOpen && (
                    <div className="p-2 space-y-1 text-xs bg-white">
                      <Link
                        href="/blog/size-ao-so-mi-nam"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block p-1.5 font-bold text-brand-600 hover:bg-slate-50 rounded-lg"
                      >
                        • Bảng Size Áo Sơ Mi Chuẩn
                      </Link>
                      <Link
                        href="/blog/bao-gia-dong-phuc-cong-ty"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block p-1.5 font-bold text-brand-600 hover:bg-slate-50 rounded-lg"
                      >
                        • Báo Giá May Đồng Phục 2026
                      </Link>
                      <Link
                        href="/blog/xu-huong-dong-phuc-2026"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block p-1.5 text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        • 5 Xu Hướng Đồng Phục 2026
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/lien-he"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === "/lien-he" ? "bg-brand-50 text-brand-800 font-extrabold" : "hover:bg-slate-100"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>Liên Hệ Trực Tiếp &amp; Bản Đồ</span>
                </Link>
              </div>
            </div>

            {/* 6. Drawer Footer Actions (Cố định ở đáy) */}
            <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/90 space-y-2 shrink-0">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsQuickQuoteOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Đăng Ký Báo Giá Nhanh 2026</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="py-2.5 px-2 bg-white border border-slate-200 hover:border-brand-400 text-brand-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span className="truncate">Gọi Hotline</span>
                </a>

                <a
                  href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-2 bg-white border border-slate-200 hover:border-blue-400 text-blue-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">Chat Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}