"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
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
  ArrowRight,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const menuCategories = CATEGORIES.filter((c) => c.id !== "all");

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setCategoryMenuOpen(false);
    setMobileMenuOpen(false);
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Filtered search results
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
  };

  return (
    <header className="sticky top-0 z-40 bg-[#071b34] text-white border-b border-cyan-400/20 shadow-xl">
      {/* Top Banner Bar */}
      <div className="bg-[#040e1c] text-xs py-2 px-4 border-b border-cyan-500/10 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left notice */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              Ưu đãi 2026
            </span>
            <span>Miễn phí thiết kế 2D/3D & may áo mẫu thử 0đ trước khi sản xuất</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Bảo hành 1 đổi 1 trong 30 ngày
            </span>
          </div>

          {/* Right contacts */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>Hotline/Zalo: <strong>{BRAND_INFO.contact.hotline}</strong></span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="flex items-center gap-1 hover:text-cyan-300 transition-colors text-slate-300"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Tra cứu đơn hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo matching images */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-300/40 transform group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-xl text-[#071b34] tracking-tighter">HN</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-wider text-white">HUNI</span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-bold">
                UNIFORM
              </span>
            </div>
            <span className="text-[10.5px] uppercase tracking-wider text-cyan-400/90 font-medium">
              Đồng Phục Doanh Nghiệp • HDC GROUP VN
            </span>
          </div>
        </a>

        {/* Category Dropdown Button */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setCategoryMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setCategoryMenuOpen(false), 150)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 font-bold text-sm transition-colors whitespace-nowrap"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Danh Mục</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />
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
                <PackageCheck className="w-4 h-4 text-cyan-600" />
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
                      activeCategory === cat.id ? "text-cyan-700 font-bold bg-cyan-50" : "text-slate-700 font-medium"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span className="flex-1">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search Bar with live autocomplete */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm polo, vest doanh nhân, đồng phục golf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
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

          {/* Autocomplete Dropdown */}
          {searchFocused && searchQuery.trim() && (
            <div
              className="absolute left-0 right-0 top-full mt-2 bg-[#0c2444] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="p-2 text-xs font-semibold text-cyan-400 border-b border-slate-800">
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
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-cyan-400 font-bold">
                          Từ {item.price.toLocaleString("vi-VN")} đ/{item.unit}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không tìm thấy mẫu phù hợp. Hãy gọi hotline{" "}
                  <strong className="text-cyan-300">0984.959.586</strong> để được tư vấn may riêng!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist button */}
          <button
            onClick={() => {
              const el = document.getElementById("catalog-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            title="Sản phẩm yêu thích"
            className="relative p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-400 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold text-white">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-cyan-500 text-[#071b34] text-xs font-black rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Instant Quote Button */}
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-[#071b34] font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Báo Giá Nhanh</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Menu Bar */}
      <nav className="hidden lg:block bg-[#092242] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-1">
            <a
              href="#"
              className="px-4 py-2.5 text-cyan-300 font-semibold border-b-2 border-cyan-400 flex items-center gap-1.5"
            >
              Trang Chủ
            </a>
            <a
              href="#catalog-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              Danh Mục Sản Phẩm
            </a>
            <a
              href="#catalog-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Đồng Phục Doanh Nghiệp
            </a>
            <a
              href="#catalog-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Vest & May Đo Lãnh Đạo
            </a>
            <a
              href="#catalog-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Thể Thao & Golf
            </a>
            <a
              href="#catalog-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Trường Học
            </a>
            <a
              href="#ceo-letter-section"
              className="px-4 py-2.5 text-cyan-300 hover:text-cyan-200 transition-colors font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Thư Mời Hợp Tác
            </a>
            <a
              href="#fabric-guide-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Bảng Vải Cao Cấp
            </a>
            <a
              href="#process-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Quy Trình May
            </a>
            <a
              href="#footer-section"
              className="px-4 py-2.5 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Liên Hệ & Xưởng May
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Hà Nội • Phú Thọ
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071b34] border-t border-slate-800 p-4 space-y-4 shadow-2xl">
          {/* Mobile search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm mẫu đồng phục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-col divide-y divide-slate-800 text-sm">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-cyan-300 font-semibold"
            >
              Trang Chủ
            </a>
            <a
              href="#catalog-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-slate-200"
            >
              Bộ Sưu Tập Đồng Phục 2026
            </a>
          </div>

          {/* Mobile category quick-select */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleSelectCategory("all")}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left ${
                activeCategory === "all" ? "bg-cyan-500 text-[#071b34]" : "bg-slate-800 text-cyan-200"
              }`}
            >
              Tất Cả Sản Phẩm
            </button>
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left line-clamp-1 ${
                  activeCategory === cat.id ? "bg-cyan-500 text-[#071b34]" : "bg-slate-800 text-cyan-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col divide-y divide-slate-800 text-sm">
            {/* keep remaining links below in original flow */}
            <a
              href="#ceo-letter-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-cyan-400 font-bold"
            >
              Thư Mời Hợp Tác - CEO Nguyễn Thị Thương
            </a>
            <a
              href="#fabric-guide-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-slate-200"
            >
              Bảng So Sánh Chất Liệu Vải
            </a>
            <a
              href="#process-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-slate-200"
            >
              Quy Trình May Chuẩn 5 Bước
            </a>
            <a
              href="#faq-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-slate-200"
            >
              Câu Hỏi Thường Gặp (FAQ)
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsQuickQuoteOpen(true);
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#071b34] font-bold text-center rounded-xl text-sm"
            >
              Nhận Báo Giá Nhanh 3 Phút
            </button>
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="w-full py-3 bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Gọi Hotline: {BRAND_INFO.contact.hotline}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}