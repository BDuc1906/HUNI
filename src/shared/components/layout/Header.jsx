"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  ChevronRight,
  Home,
  Info,
  ShieldCheck,
  Crown,
  Briefcase,
  Activity,
  GraduationCap,
  PackageCheck,
  ArrowRight,
  Palette,
  Zap,
  Globe,
} from "lucide-react";
import ZaloIcon from "@/shared/components/icons/ZaloIcon";
import { useLanguage } from "@/shared/providers/LanguageProvider";
import { CATEGORIES } from "@/shared/data";
import { searchProductsMultilingual } from "@/shared/utils/multilingualSearch";

// ============================================================
// MAP ICON CHO CATEGORY & NAV
// ============================================================
const catIconMap = {
  Briefcase: Briefcase,
  Crown: Crown,
  Activity: Activity,
  GraduationCap: GraduationCap,
  PackageCheck: PackageCheck,
  Palette: Palette,
};

const navIconMap = {
  "/": Home,
  "/gioi-thieu": Info,
  "/dong-phuc-doanh-nghiep": Briefcase,
  "/bang-vai": Palette,
  "/quy-trinh-may-dong-phuc-doanh-nghiep": ClipboardList,
  "/lien-he": Phone,
};

// ============================================================
// HÀM TẠO MENU CHÍNH THEO NGÔN NGỮ HIỆN TẠI (I18N)
// ============================================================
const getMainNav = (t) => [
  { label: t("nav.home", "Trang Chủ"), href: "/" },
  { label: t("nav.about", "Giới Thiệu"), href: "/gioi-thieu" },
  {
    label: t("nav.products", "Sản Phẩm"),
    href: "/dong-phuc-doanh-nghiep",
    hasDropdown: true,
    hasLightning: true,
    children: [
      {
        label: t("cat.corporate", "Đồng Phục Doanh Nghiệp"),
        href: "/dong-phuc-doanh-nghiep",
        desc: t("cat.corporateDesc", "Polo cao cấp, sơ mi công sở chuẩn form"),
        icon: "Briefcase",
      },
      {
        label: t("cat.bespoke", "Đồng Phục May Đo"),
        href: "/dong-phuc-may-do",
        desc: t("cat.bespokeDesc", "Vest lãnh đạo, bespoke đo ni từng nhân sự"),
        icon: "Crown",
      },
      {
        label: t("cat.sport", "Đồng Phục Thể Thao & Golf"),
        href: "/dong-phuc-the-thao",
        desc: t("cat.sportDesc", "Giải Golf, Pickleball, Marathon, Team building"),
        icon: "Activity",
      },
      {
        label: t("cat.school", "Đồng Phục Trường Học"),
        href: "/dong-phuc-truong-hoc",
        desc: t("cat.schoolDesc", "Học sinh các cấp, sinh viên, giáo viên"),
        icon: "GraduationCap",
      },
      {
        label: t("cat.accessories", "Phụ Kiện Doanh Nghiệp"),
        href: "/phu-kien-doanh-nghiep",
        desc: t("cat.accessoriesDesc", "Mũ nón, cặp da, túi quà tặng thương hiệu"),
        icon: "PackageCheck",
      },
      {
        label: t("cat.designStudio", "Tự Thiết Kế & Gửi Mẫu"),
        href: "/thiet-ke-dong-phuc",
        desc: t("cat.designStudioDesc", "Studio 2D phối màu, chèn logo & nhận áo mẫu 0đ"),
        icon: "Palette",
        badge: "HOT",
      },
    ],
  },
  { label: t("nav.fabrics", "Bảng Vải"), href: "/bang-vai" },
  { label: t("nav.process", "Quy Trình"), href: "/quy-trinh-may-dong-phuc-doanh-nghiep" },
  { label: t("nav.contact", "Liên Hệ"), href: "/lien-he" },
];

// ============================================================
// HOVER DELAY — Chờ 180ms trước khi đóng menu
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

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Đánh dấu client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Khóa cuộn trang khi mở menu hoặc tìm kiếm trên mobile
  useEffect(() => {
    if (mobileMenuOpen || mobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

  // ✅ Dropdown hover state
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimerRef = useRef(null);

  // Mobile menu: category sub-menu mở/đóng
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // ✅ Trạng thái cuộn trang
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Đa ngôn ngữ từ LanguageProvider
  const {
    language,
    setLanguage,
    t,
    currentLang,
    supportedLanguages,
  } = useLanguage();

  const CurrentFlag = currentLang.Flag;

  // State dropdown & tìm kiếm ngôn ngữ (Desktop + Mobile modal)
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const langRef = useRef(null);

  // Menu điều hướng dịch theo ngôn ngữ hiện tại
  const mainNav = getMainNav(t);

  // Lọc ngôn ngữ theo từ khóa tìm kiếm (dùng chung cho cả Desktop dropdown và Mobile modal)
  const filteredLanguages = supportedLanguages.filter((item) => {
    if (!langSearch.trim()) return true;
    const q = langSearch.trim().toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.nativeLabel.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q) ||
      item.short.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.some((kw) => kw.includes(q)))
    );
  });

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // ============================================================
  // SEARCH
  // ============================================================
  const searchResults = searchQuery.trim()
    ? searchProductsMultilingual(PRODUCTS, searchQuery, 8)
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
    if (!pathname) return false;
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
    if (!item.children || !pathname) return false;
    return item.children.some((child) => pathname.startsWith(child.href));
  };

  const TOP_BANNER_ITEMS = [
    {
      icon: Sparkles,
      badge: t("banner.badgeWelcome", "CHÀO MỪNG"),
      badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/35 shadow-xs",
      text: t(
        "banner.welcome1",
        "Chào mừng Quý khách đến với HDC FASHION — Xưởng may đồng phục doanh nghiệp & học đường cao cấp toàn quốc!"
      ),
      action: () => setIsQuickQuoteOpen(true),
      actionText: t("action.quoteNow", "Nhận mẫu thử 0đ"),
    },
    {
      icon: Crown,
      badge: t("banner.badgeSpecial", "ĐẶC QUYỀN"),
      badgeColor: "bg-cyan-400/20 text-cyan-300 border-cyan-400/35 shadow-xs",
      text: t(
        "banner.welcome2",
        "Chào mừng Quý khách! Trải nghiệm may áo mẫu thử 0đ tận văn phòng & miễn phí thiết kế 2D/3D nhận diện thương hiệu"
      ),
      action: () => setIsQuickQuoteOpen(true),
      actionText: t("action.designFree", "Đăng ký ngay"),
    },
    {
      icon: Zap,
      badge: t("banner.badgeOffer", "ƯU ĐÃI 2026"),
      badgeColor: "bg-rose-400/20 text-rose-300 border-rose-400/35 shadow-xs",
      text: t(
        "banner.welcome3",
        "Chào mừng Quý khách ghé thăm! Tặng ngay chiết khấu lên đến 35% & miễn phí thêu in logo vi tính cho đơn hàng doanh nghiệp"
      ),
      action: () => setIsQuickQuoteOpen(true),
      actionText: t("action.viewOffer", "Xem báo giá sỉ"),
    },
    {
      icon: ShieldCheck,
      badge: t("banner.badgeWarranty", "BẢO HÀNH VÀNG"),
      badgeColor: "bg-emerald-400/20 text-emerald-300 border-emerald-400/35 shadow-xs",
      text: t(
        "banner.welcome4",
        "Chào mừng Quý khách! HDC FASHION cam kết bảo hành 1 đổi 1 trong 30 ngày — Chuẩn phom dáng, bền màu sau 100 lần giặt"
      ),
    },
    {
      icon: Briefcase,
      badge: t("banner.badgeFactory", "NHÀ MÁY ISO"),
      badgeColor: "bg-sky-400/20 text-sky-300 border-sky-400/35 shadow-xs",
      text: t(
        "banner.welcome5",
        "Chào mừng Quý khách ghé thăm xưởng sản xuất 2.500m² đạt chuẩn ISO 9001:2015 — Năng lực may 50.000 sp/tháng đáp ứng mọi tiến độ"
      ),
    },
    {
      icon: PackageCheck,
      badge: t("banner.badgeShipping", "MIỄN PHÍ SHIP"),
      badgeColor: "bg-teal-400/20 text-teal-300 border-teal-400/35 shadow-xs",
      text: t(
        "banner.welcome6",
        "Chào mừng Quý khách! Miễn phí giao hàng hỏa tốc 63 tỉnh thành — Chuyên viên mang mẫu vải tư vấn trực tiếp tại văn phòng Quý khách"
      ),
      href: `tel:${BRAND_INFO.contact.hotlineRaw}`,
      actionText: `${t("action.hotline", "Hotline")}: ${BRAND_INFO.contact.hotline}`,
    },
    {
      icon: ClipboardList,
      badge: t("banner.badgeTrack", "TRA CỨU 24/7"),
      badgeColor: "bg-purple-400/20 text-purple-300 border-purple-400/35 shadow-xs",
      text: t(
        "banner.welcome7",
        "Chào mừng Quý khách! Dễ dàng theo dõi tiến độ sản xuất & giao nhận đơn hàng trực tuyến minh bạch 24/7 chỉ với số điện thoại"
      ),
      action: () => setIsOrderTrackingOpen(true),
      actionText: t("action.trackOrder", "Tra cứu đơn"),
    },
  ];

  return (
    <>
      {/* =============================================
          TOP BAR — MARQUEE RUNNING BANNER
          Nằm trên cùng, cuộn tự nhiên theo trang mượt mà
          ============================================= */}
      <div className="relative w-full bg-[#00262e] border-b border-brand-500/15 overflow-hidden select-none group text-white py-1.5 z-40">
        {/* Subtle Edge Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#00262e] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#00262e] to-transparent z-10" />

        {/* Marquee Track */}
        <div
          className="animate-marquee-slow flex items-center whitespace-nowrap hover:[animation-play-state:paused]"
          style={{ animationDuration: "75s" }}
        >
          {[...TOP_BANNER_ITEMS, ...TOP_BANNER_ITEMS].map((item, index) => {
            const Icon = item.icon;
            const content = (
              <span className="inline-flex items-center gap-2 px-6 text-xs text-slate-200 transition-colors">
                {item.badge && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${item.badgeColor}`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{item.badge}</span>
                  </span>
                )}
                <span className="font-medium tracking-wide">{item.text}</span>
                {item.actionText && (
                  <span className="text-[11px] font-bold text-brand-300 underline underline-offset-2 hover:text-white shrink-0 ml-1">
                    {item.actionText} →
                  </span>
                )}
                <span className="text-brand-400/40 ml-4 font-black text-[10px]">✦</span>
              </span>
            );

            if (item.href) {
              return (
                <a
                  key={`banner-link-${index}`}
                  href={item.href}
                  className="hover:text-white cursor-pointer inline-flex items-center shrink-0"
                >
                  {content}
                </a>
              );
            }

            if (item.action) {
              return (
                <button
                  key={`banner-btn-${index}`}
                  onClick={item.action}
                  type="button"
                  className="hover:text-white cursor-pointer text-left inline-flex items-center shrink-0"
                >
                  {content}
                </button>
              );
            }

            return (
              <span
                key={`banner-item-${index}`}
                className="inline-flex items-center shrink-0"
              >
                {content}
              </span>
            );
          })}
        </div>
      </div>

      {/* =============================================
          MAIN NAVBAR — LOGO + MENU + ACTIONS
          Ghim cố định đỉnh màn hình cực kỳ mượt mà 100%
          ============================================= */}
      <header
        className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b transition-[box-shadow,border-color] duration-200 py-2 sm:py-2.5 ${
          isScrolled
            ? "border-slate-200/90 shadow-md"
            : "border-slate-200/80 shadow-xs"
        }`}
      >
        <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* BÊN TRÁI: LOGO + DESKTOP MENU */}
          <div className="flex items-center gap-3 xl:gap-6 shrink-0">
            {/* BRAND LOGO — Nổi bật trên nền trắng theo ảnh tham khảo */}
            <Link
              href="/"
              className="flex items-center group shrink-0 mr-1 sm:mr-3"
              title="HDC FASHION - Đồng Phục Cao Cấp"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="HDC FASHION Logo"
                style={{ height: "46px", width: "auto" }}
                className="w-auto max-h-12 max-w-[150px] object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* DANH SÁCH MENU ĐIỀU HƯỚNG TRÊN DESKTOP */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2.5 text-[13px] xl:text-[14px] shrink-0 font-medium">
              {mainNav.map((item) => {
                const active = isActive(item.href) || isDropdownActive(item);

                if (item.hasDropdown) {
                  const isOpen = openDropdown === item.label;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        style={{ whiteSpace: "nowrap" }}
                        className={`group relative flex items-center gap-1.5 px-3 py-2 transition-colors ${
                          active
                            ? "text-[#0097b2] font-bold"
                            : "text-slate-800 hover:text-[#0097b2] font-semibold"
                        }`}
                      >
                        {item.hasLightning && (
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 inline-block -mt-0.5" />
                        )}
                        <span className="relative">
                          {item.label}
                          {/* Hiệu ứng gạch chân mượt khi di chuột */}
                          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#0097b2] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#0097b2]" : active ? "text-[#0097b2]" : "text-slate-400"
                          }`}
                        />
                      </button>

                      {/* DROPDOWN PANEL */}
                      {isOpen && (
                        <div
                          className="absolute left-0 top-full pt-1.5 z-50"
                          onMouseEnter={() => handleMouseEnter(item.label)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-2 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
                            {item.children.map((child) => {
                              const Icon = catIconMap[child.icon] || Briefcase;
                              const childActive = pathname === child.href;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                                    childActive
                                      ? "bg-brand-50 ring-1 ring-brand-300"
                                      : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                      childActive
                                        ? "bg-brand-500 text-white"
                                        : "bg-brand-100 text-brand-700"
                                    }`}
                                  >
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className={`font-bold text-sm flex items-center gap-1.5 ${
                                        childActive
                                          ? "text-brand-800"
                                          : "text-slate-800"
                                      }`}
                                    >
                                      <span>{child.label}</span>
                                      {child.badge && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950 tracking-wider">
                                          {child.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                      {child.desc}
                                    </div>
                                  </div>
                                  <ArrowRight
                                    className={`w-4 h-4 mt-1.5 shrink-0 ${
                                      childActive
                                        ? "text-brand-600"
                                        : "text-slate-300"
                                    }`}
                                  />
                                </Link>
                              );
                            })}

                            {/* Footer của dropdown */}
                            <div className="mt-1 pt-2 border-t border-slate-100 px-3 pb-1 flex items-center justify-between">
                              <span className="text-[11px] text-slate-500">
                                {t("action.needAdvice", "Cần tư vấn riêng cho doanh nghiệp?")}
                              </span>
                              <button
                                onClick={() => setIsQuickQuoteOpen(true)}
                                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                {t("action.quoteNow", "Báo giá ngay")}
                              </button>
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
                    className={`group relative px-3 py-2 transition-colors ${
                      active
                        ? "text-[#0097b2] font-bold"
                        : "text-slate-800 hover:text-[#0097b2] font-semibold"
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      {/* Hiệu ứng gạch chân mượt khi di chuột */}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#0097b2] rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* BÊN PHẢI: DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Ô Tìm Kiếm Desktop */}
            <div className="relative w-36 xl:w-48 focus-within:w-44 xl:focus-within:w-56 transition-all">
              <input
                type="text"
                placeholder={t("action.searchPlaceholder", "Tìm mẫu, vải...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-100 hover:bg-slate-100/90 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0097b2] focus:ring-2 focus:ring-[#0097b2]/20 transition-all shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}

              {/* Gợi ý tìm kiếm */}
              {searchFocused && searchQuery.trim() && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 xl:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 text-slate-800"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="p-2 text-xs font-semibold text-brand-700 border-b border-slate-100">
                    Gợi ý tìm kiếm ({searchResults.length} kết quả)
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectSearchResult(item)}
                          className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-brand-600 font-bold">
                              Từ {item.price.toLocaleString("vi-VN")} đ/{item.unit}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500">
                      Không tìm thấy mẫu phù hợp. Gọi hotline{" "}
                      <strong className="text-brand-600">0984.959.586</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chuyển đổi ngôn ngữ (Icon cờ nước + Tên viết tắt + Tìm kiếm ngôn ngữ) */}
            <div className="relative notranslate" ref={langRef}>
              <button
                onClick={() => {
                  setLangOpen((v) => !v);
                  if (!langOpen) setLangSearch("");
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-[#0097b2] transition-colors text-xs font-bold border border-slate-200/90 shadow-2xs shrink-0"
                title={`Đang chọn: ${currentLang.label} (${currentLang.short}) - Nhấn để đổi & tìm kiếm`}
                aria-label="Chuyển đổi ngôn ngữ"
              >
                <CurrentFlag className="w-4.5 h-4.5" />
                <span className="font-extrabold text-[11px] tracking-wide text-slate-800">
                  {currentLang.short}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    langOpen ? "rotate-180 text-[#0097b2]" : ""
                  }`}
                />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
                  {/* Header popup */}
                  <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Globe className="w-3.5 h-3.5 text-[#0097b2]" />
                      <span>{t("lang.title", "Ngôn ngữ / Language")}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-full">
                      {filteredLanguages.length}
                    </span>
                  </div>

                  {/* Mục tìm kiếm ngôn ngữ */}
                  <div className="p-2 border-b border-slate-100 bg-white">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder={t("lang.searchPlaceholder", "Tìm kiếm ngôn ngữ, nước...")}
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0097b2] focus:ring-1 focus:ring-[#0097b2] transition-all"
                        autoFocus
                      />
                      {langSearch && (
                        <button
                          onClick={() => setLangSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Danh sách cờ các nước & viết tắt */}
                  <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((item) => {
                        const ItemFlag = item.Flag;
                        const isSelected = language === item.code;
                        return (
                          <button
                            key={item.code}
                            onClick={() => {
                              setLanguage(item.code);
                              setLangOpen(false);
                              setLangSearch("");
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              isSelected
                                ? "text-[#0097b2] bg-teal-50 font-bold shadow-2xs"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <ItemFlag className="w-5 h-5 shrink-0" />
                              <div className="text-left truncate">
                                <div className="truncate font-bold leading-tight">{item.label}</div>
                                <div className="text-[10px] text-slate-400 font-normal truncate">
                                  {item.country} • {item.nativeLabel}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                                isSelected
                                  ? "bg-[#0097b2] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.short}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {t("lang.noResults", "Không tìm thấy ngôn ngữ phù hợp")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sản phẩm yêu thích (Wishlist) */}
            <Link
              href="/tai-khoan?tab=wishlist"
              title="Sản phẩm yêu thích"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-rose-500 transition-colors shrink-0"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Vạch phân cách nhẹ */}
            <div className="w-px h-5 bg-slate-200" />

            {/* Giỏ Hàng — Chỉ icon tròn, không cần chữ */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-[#0097b2] hover:bg-[#008199] text-white shadow-xs transition-all hover:scale-105 flex items-center justify-center shrink-0"
              title="Xem giỏ hàng"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Đăng nhập / Đăng ký */}
            <div className="shrink-0">
              <UserMenu />
            </div>
          </div>

          {/* BÊN PHẢI: MOBILE CONTROLS (< lg) */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-2">
            {/* Nút chọn ngôn ngữ trên Mobile: mở modal chọn trực quan */}
            <button
              onClick={() => {
                setMobileLangOpen(true);
                setLangSearch("");
              }}
              className="px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 border border-slate-200/90 shadow-2xs shrink-0 notranslate"
              title={`Đang chọn: ${currentLang.label} (${currentLang.short}) - Nhấn để đổi ngôn ngữ`}
              aria-label="Chọn ngôn ngữ"
            >
              <CurrentFlag className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-black">{currentLang.short}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setMobileSearchOpen(true)}
              title="Tìm kiếm sản phẩm"
              className="p-2 rounded-lg text-slate-700 hover:text-[#0097b2] hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-[#0097b2] text-white hover:bg-[#008199] shadow-xs transition-all flex items-center"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <UserMenu />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#0097b2] hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* =============================================
          MOBILE SEARCH OVERLAY
          ============================================= */}
      {mounted && mobileSearchOpen && typeof document !== "undefined" && createPortal(
        <div className="lg:hidden fixed inset-0 z-[9999] bg-[#004f5e] p-4 flex flex-col">
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
        </div>,
        document.body
      )}

      {/* =============================================
          MOBILE LANGUAGE SELECTOR MODAL
          ============================================= */}
      {mounted && mobileLangOpen && typeof document !== "undefined" && createPortal(
        <div className="lg:hidden fixed inset-0 z-[9999] flex flex-col justify-start items-center pt-20 px-4">
          {/* Backdrop mờ nền đen phủ kín toàn bộ màn hình */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => setMobileLangOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 notranslate text-slate-800">
            {/* Header popup */}
            <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Globe className="w-4 h-4 text-[#0097b2]" />
                <span>{t("lang.title", "Chọn ngôn ngữ / Language")}</span>
              </div>
              <button
                onClick={() => setMobileLangOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tìm kiếm ngôn ngữ */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder={t("lang.searchPlaceholder", "Tìm kiếm ngôn ngữ, nước...")}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0097b2] focus:ring-1 focus:ring-[#0097b2] transition-all"
                  autoFocus
                />
                {langSearch && (
                  <button
                    onClick={() => setLangSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    title="Xóa"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Danh sách cờ các nước & viết tắt */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((item) => {
                  const ItemFlag = item.Flag;
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setMobileLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "text-[#0097b2] bg-teal-50/80 font-bold border border-teal-200/80 shadow-2xs"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ItemFlag className="w-5 h-5 shrink-0" />
                        <div className="text-left truncate">
                          <div className="truncate font-bold leading-tight text-slate-900">{item.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate">
                            {item.country} • {item.nativeLabel}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ml-2 ${
                          isSelected
                            ? "bg-[#0097b2] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.short}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  {t("lang.noResults", "Không tìm thấy ngôn ngữ phù hợp")}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =============================================
          MOBILE DRAWER NAV
          ============================================= */}
      {mounted && mobileMenuOpen && typeof document !== "undefined" && createPortal(
        <div className="lg:hidden fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop mờ nền đen phủ kín toàn bộ màn hình */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer trượt từ bên phải sang chiếm trọn chiều cao màn hình */}
          <div className="relative z-10 w-[330px] max-w-[86vw] h-full bg-white border-l border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
            {/* Header của Drawer */}
            <div className="shrink-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 p-1 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icon.png"
                    alt="HDC Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm uppercase tracking-wide leading-tight">
                    HDC UNIFORM
                  </div>
                  <div className="text-[10px] text-[#0097b2] font-bold uppercase tracking-wider leading-tight">
                    Đồng Phục Cao Cấp
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
                aria-label="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nội dung menu cuộn trọn vẹn */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
              {/* VIP Quick Quote Card */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsQuickQuoteOpen(true);
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-[#0097b2] via-[#008ba3] to-[#005c6d] text-white shadow-lg shadow-[#0097b2]/20 hover:shadow-xl hover:shadow-[#0097b2]/30 active:scale-[0.99] transition-all relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    {t("action.quickQuote", "Báo Giá Nhanh 3 Phút")}
                  </span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    0Đ May Mẫu
                  </span>
                </div>
                <p className="text-[11px] text-teal-50 font-normal leading-tight">
                  Tư vấn chất liệu, bảng size & thiết kế 3D hoàn toàn miễn phí
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Nhận báo giá ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* NAV CHÍNH */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-2">
                  {t("action.menu", "Danh mục điều hướng")}
                </span>

                {mainNav.map((item) => {
                  const ItemIcon = navIconMap[item.href] || Briefcase;

                  if (item.hasDropdown) {
                    const isDropdownCurrent = isDropdownActive(item);
                    return (
                      <div key={item.label} className="space-y-1">
                        <button
                          onClick={() =>
                            setMobileCategoryOpen(!mobileCategoryOpen)
                          }
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all group ${
                            isDropdownCurrent
                              ? "bg-[#0097b2]/10 text-[#0097b2] font-bold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isDropdownCurrent
                                  ? "bg-[#0097b2] text-white shadow-2xs"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-[#0097b2]/10 group-hover:text-[#0097b2]"
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <span className="truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0097b2] border border-teal-200/60">
                              {item.children?.length || 6} mục
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                mobileCategoryOpen
                                  ? "rotate-180 text-[#0097b2]"
                                  : "group-hover:text-slate-600"
                              }`}
                            />
                          </div>
                        </button>

                        {mobileCategoryOpen && (
                          <div className="ml-4 mt-1.5 space-y-1 pl-3.5 border-l-2 border-[#0097b2]/25 py-1 animate-in fade-in-50 duration-200">
                            {item.children.map((child) => {
                              const ChildIcon =
                                catIconMap[child.icon] || Briefcase;
                              const childActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all group/sub ${
                                    childActive
                                      ? "bg-[#0097b2]/10 text-[#0097b2] font-bold border border-[#0097b2]/20 shadow-2xs"
                                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  <div
                                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                                      childActive
                                        ? "bg-[#0097b2] text-white"
                                        : "bg-slate-100 text-[#0097b2] group-hover/sub:bg-[#0097b2]/15"
                                    }`}
                                  >
                                    <ChildIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={`truncate leading-snug font-bold ${
                                        childActive
                                          ? "text-[#0097b2]"
                                          : "text-slate-800"
                                      }`}
                                    >
                                      {child.label}
                                    </div>
                                    {child.desc && (
                                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1 leading-tight mt-0.5">
                                        {child.desc}
                                      </div>
                                    )}
                                  </div>
                                  {child.badge && (
                                    <span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded bg-amber-400 text-slate-950 ml-auto shrink-0 shadow-2xs self-center">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const itemActive = isActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all group ${
                        itemActive
                          ? "bg-[#0097b2]/10 text-[#0097b2] font-bold border border-[#0097b2]/20 shadow-2xs"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            itemActive
                              ? "bg-[#0097b2] text-white shadow-2xs"
                              : "bg-slate-100 text-slate-500 group-hover:bg-[#0097b2]/10 group-hover:text-[#0097b2]"
                          }`}
                        >
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0097b2] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>

              {/* Tra cứu đơn hàng */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsOrderTrackingOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-dashed border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0097b2] flex items-center justify-center shrink-0">
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <span>{t("nav.orderTracking", "Tra cứu tiến độ đơn may")}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* CALLS & CONTACT PINNED FOOTER */}
            <div className="shrink-0 bg-white border-t border-slate-100 px-4 py-3 space-y-2 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="flex-1 py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0097b2]/10 text-[#0097b2] flex items-center justify-center shrink-0">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span className="truncate">{BRAND_INFO.contact.hotline}</span>
                </a>
                <a
                  href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-2 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#0068FF]/25 active:scale-95 transition-all"
                >
                  <ZaloIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t("action.zaloChat", "Chat Zalo")}</span>
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0097b2] shrink-0" />
                <span className="truncate">Xưởng may HDC • May mẫu 0Đ • Đúng hẹn</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  </>
);
}
