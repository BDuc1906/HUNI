"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO, PRODUCTS } from "@/shared/data";
import {
  Phone,
  MapPin,
  Search,
  Heart,
  ShoppingBag,
  Sparkles,
  ClipboardList,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LayoutGrid,
  Crown,
  Briefcase,
  Activity,
  GraduationCap,
  PackageCheck
} from "lucide-react";
import { CATEGORIES } from "@/shared/data";

const catIconMap = {
  Briefcase: Briefcase,
  Crown: Crown,
  Activity: Activity,
  GraduationCap: GraduationCap,
  PackageCheck: PackageCheck
};

export default function Header() {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsQuickQuoteOpen,
    setIsOrderTrackingOpen,
    setQuickViewProduct,
    activeCategory,
    setActiveCategory
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const menuCategories = CATEGORIES.filter((c) => c.id !== "all");

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setCategoryMenuOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("product-grid-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (product) => {
    setQuickViewProduct(product);
    setSearchQuery("");
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#071b34] text-white border-b border-amber-400/20 shadow-xl">
      {/* =============================================
          TOP BAR
          ============================================= */}
      <div className="bg-[#040e1c] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-amber-500/10 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 shrink-0">
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
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">
                Hotline/Zalo: <strong>{BRAND_INFO.contact.hotline}</strong>
              </span>
              <span className="sm:hidden font-bold">{BRAND_INFO.contact.hotline}</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hidden md:flex items-center gap-1 hover:text-amber-300 transition-colors"
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
        {/* =============================================
            BRAND LOCKUP — Logo VUÔNG + Divider + Text
            ============================================= */}
        <a href="#" className="flex items-center gap-2 sm:gap-3.5 group shrink-0">
          {/* Logo VUÔNG hiển thị full ảnh — rounded-lg bo góc nhẹ */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 border-amber-400/60 shadow-lg shadow-amber-900/20 bg-[#071b34] flex items-center justify-center transform group-hover:scale-105 transition-transform shrink-0">
            <span className="absolute font-black text-lg text-amber-400 tracking-tighter">
              HN
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="HUNI UNIFORM Logo"
              className="absolute inset-0 w-full h-full object-contain z-10"
            />
          </div>

          {/* Divider vàng dọc */}
          <div className="hidden sm:block w-px h-9 sm:h-10 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent shrink-0" />

          {/* Text block */}
          <div className="flex flex-col justify-center min-w-0">
            {/* Dòng 1: HUNI + UNIFORM badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-black text-xl sm:text-2xl lg:text-[26px] tracking-[0.05em] text-white leading-none">
                HUNI
              </span>
              <span className="hidden sm:inline-flex items-center text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 via-amber-400/30 to-amber-400/20 text-amber-300 border border-amber-400/40 font-bold leading-none">
                UNIFORM
              </span>
            </div>

            {/* Divider ngang vàng nhỏ */}
            <div className="hidden sm:block h-px w-full max-w-[120px] bg-gradient-to-r from-amber-400/60 via-amber-400/30 to-transparent mt-1 sm:mt-1.5" />

            {/* Dòng 2: Subtitle */}
            <span className="hidden sm:block text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-amber-400/85 font-semibold mt-1 sm:mt-1.5 leading-none">
              Đồng Phục Doanh Nghiệp <span className="text-amber-400/50 mx-0.5">•</span> HDC GROUP VN
            </span>
          </div>
        </a>

        {/* =============================================
            Desktop Category Dropdown
            ============================================= */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setCategoryMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setCategoryMenuOpen(false), 150)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 font-bold text-sm transition-colors whitespace-nowrap"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Danh Mục</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                categoryMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {categoryMenuOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
            >
              <button
                onClick={() => handleSelectCategory("all")}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-800 font-semibold text-sm flex items-center gap-2.5"
              >
                <PackageCheck className="w-4 h-4 text-amber-600" />
                Tất Cả Sản Phẩm
              </button>
              <div className="h-px bg-slate-100 my-1" />
              {menuCategories.map((cat) => {
                const Icon = catIconMap[cat.icon] || Briefcase;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm flex items-center gap-2.5 transition-colors ${
                      activeCategory === cat.id
                        ? "text-amber-700 font-bold bg-amber-50"
                        : "text-slate-700 font-medium"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="flex-1">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* =============================================
            Desktop Search
            ============================================= */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm polo, vest doanh nhân, đồng phục golf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
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
              className="absolute left-0 right-0 top-full mt-2 bg-[#0c2444] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="p-2 text-xs font-semibold text-amber-400 border-b border-slate-800">
                Gợi ý tìm kiếm ({searchResults.length} kết quả)
              </div>
              {searchResults.length > 0 ? (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-[#12335e] rounded-xl transition-colors"
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
                        <div className="text-xs text-amber-400 font-bold">
                          Từ {item.price.toLocaleString("vi-VN")} đ/{item.unit}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không tìm thấy mẫu phù hợp. Gọi hotline{" "}
                  <strong className="text-amber-300">0984.959.586</strong> để tư vấn may riêng!
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
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("catalog-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            title="Sản phẩm yêu thích"
            className="hidden sm:block relative p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-full bg-slate-800/80 hover:bg-slate-800 text-amber-400 border border-slate-700 hover:border-amber-400 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden lg:inline text-xs font-bold text-white">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-[#071b34] text-[11px] font-black rounded-full flex items-center justify-center sm:static sm:w-5 sm:h-5">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Báo Giá Nhanh</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* =============================================
          DESKTOP NAV
          ============================================= */}
      <nav className="hidden lg:block bg-[#092242] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-4 py-2.5 text-amber-300 font-semibold border-b-2 border-amber-400"
            >
              Trang Chủ
            </button>
            <button
              onClick={() => handleSelectCategory("all")}
              className="px-4 py-2.5 text-slate-300 hover:text-amber-300 transition-colors"
            >
              Tất Cả Sản Phẩm
            </button>
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-4 py-2.5 transition-colors ${
                  activeCategory === cat.id
                    ? "text-amber-300 border-b-2 border-amber-400"
                    : "text-slate-300 hover:text-amber-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
            <a
              href="#ceo-letter-section"
              className="px-4 py-2.5 text-amber-300 hover:text-amber-200 transition-colors font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Thư Mời Hợp Tác
            </a>
            <a
              href="#fabric-guide-section"
              className="px-4 py-2.5 text-slate-300 hover:text-amber-300 transition-colors"
            >
              Bảng Vải Cao Cấp
            </a>
            <a
              href="#process-section"
              className="px-4 py-2.5 text-slate-300 hover:text-amber-300 transition-colors"
            >
              Quy Trình May
            </a>
            <a
              href="#footer-section"
              className="px-4 py-2.5 text-slate-300 hover:text-amber-300 transition-colors"
            >
              Liên Hệ & Xưởng May
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Hà Nội • Phú Thọ
            </span>
          </div>
        </div>
      </nav>

      {/* =============================================
          MOBILE SEARCH OVERLAY
          ============================================= */}
      {mobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#071b34] p-4 flex flex-col">
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
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
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
                        <div className="text-xs text-amber-400 font-bold mt-1">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#071b34] font-bold text-xs rounded-xl"
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
                  {["Polo", "Sơ mi", "Vest", "Golf", "Học sinh", "Mũ"].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => setSearchQuery(kw)}
                      className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
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

          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#071b34] border-l border-slate-800 overflow-y-auto">
            {/* Drawer header — Logo VUÔNG */}
            <div className="sticky top-0 bg-[#071b34] p-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-amber-400/60 bg-[#071b34] flex items-center justify-center">
                  <span className="absolute font-black text-sm text-amber-400">HN</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.png"
                    alt="HUNI Logo"
                    className="absolute inset-0 w-full h-full object-contain z-10"
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
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#071b34] font-bold text-center rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Nhận Báo Giá Nhanh 3 Phút
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Điều hướng
                </span>
                <a
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-amber-300 font-semibold hover:bg-slate-800 transition-colors"
                >
                  Trang Chủ
                </a>
                <a
                  href="#catalog-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Bộ Sưu Tập Đồng Phục 2026
                </a>
                <a
                  href="#ceo-letter-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-amber-400 font-bold hover:bg-slate-800 transition-colors"
                >
                  ✦ Thư Mời Hợp Tác - CEO
                </a>
                <a
                  href="#fabric-guide-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Bảng So Sánh Chất Liệu Vải
                </a>
                <a
                  href="#process-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Quy Trình May Chuẩn 5 Bước
                </a>
                <a
                  href="#faq-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Câu Hỏi Thường Gặp (FAQ)
                </a>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Danh mục sản phẩm
                </span>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSelectCategory("all")}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2.5 ${
                      activeCategory === "all"
                        ? "bg-amber-500 text-[#071b34]"
                        : "bg-slate-800 text-amber-200 hover:bg-slate-700"
                    }`}
                  >
                    <PackageCheck className="w-4 h-4 shrink-0" />
                    <span>Tất Cả Sản Phẩm</span>
                  </button>
                  {menuCategories.map((cat) => {
                    const Icon = catIconMap[cat.icon] || Briefcase;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2.5 ${
                          activeCategory === cat.id
                            ? "bg-amber-500 text-[#071b34]"
                            : "bg-slate-800 text-amber-200 hover:bg-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="w-full py-3 bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Gọi: {BRAND_INFO.contact.hotline}
                </a>
                <a
                  href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600 text-white font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
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