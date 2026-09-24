"use client";

import React, { useState } from "react";
import { useShop } from "@/hooks/useShop";
import { BRAND_INFO, PRODUCTS } from "@/data/products";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Phone,
  Search,
  Heart,
  ShoppingBag,
  ClipboardList,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Header() {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsQuickQuoteOpen,
    setIsOrderTrackingOpen,
    setQuickViewProduct
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Top Notice Bar */}
      <div className="bg-neutral-100 dark:bg-neutral-950 text-xs py-2 px-4 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              HDC GROUP VN • HUNI UNIFORM
            </span>
            <span className="hidden md:inline text-neutral-400 dark:text-neutral-600">•</span>
            <span>Miễn phí thiết kế 2D/3D & may áo mẫu thử 0đ</span>
            <span className="hidden md:inline text-neutral-400 dark:text-neutral-600">•</span>
            <span className="hidden md:inline">Bảo hành 1 đổi 1 trong 30 ngày</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline: {BRAND_INFO.contact.hotline}</span>
            </a>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Tra cứu đơn hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-lg tracking-tight">
            HN
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white">
                HUNI
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold border border-neutral-300 dark:border-neutral-700">
                UNIFORM
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
              Đồng Phục Doanh Nghiệp • HDC GROUP VN
            </span>
          </div>
        </a>

        {/* Live Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm mẫu đồng phục, polo, vest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchFocused && searchQuery.trim() && (
            <div
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="p-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                Kết quả tìm kiếm ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
                          Từ {item.price.toLocaleString("vi-VN")} đ
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-neutral-500">
                  Không tìm thấy mẫu phù hợp. Hãy gọi hotline {BRAND_INFO.contact.hotline} để được tư vấn may riêng.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Wishlist */}
          <button
            onClick={() => {
              const el = document.getElementById("catalog-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            title="Danh sách yêu thích"
            className="relative p-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:px-3 sm:py-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Quote CTA Button */}
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Báo Giá Nhanh</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="hidden lg:block border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1">
            <a
              href="#"
              className="py-2.5 px-3 text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white"
            >
              Trang Chủ
            </a>
            <a
              href="#category-showcase"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Danh Mục Sản Phẩm
            </a>
            <a
              href="#catalog-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Đồng Phục Doanh Nghiệp
            </a>
            <a
              href="#catalog-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Vest & May Đo Lãnh Đạo
            </a>
            <a
              href="#catalog-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Thể Thao & Golf
            </a>
            <a
              href="#catalog-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Trường Học
            </a>
            <a
              href="#ceo-letter-section"
              className="py-2.5 px-3 text-neutral-900 dark:text-white font-bold hover:underline transition-colors"
            >
              Thư Mời Hợp Tác
            </a>
            <a
              href="#fabric-guide-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Bảng Vải Cao Cấp
            </a>
            <a
              href="#process-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Quy Trình May
            </a>
            <a
              href="#footer-section"
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Liên Hệ Xưởng May
            </a>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Hà Nội • Phú Thọ
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
          <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 font-bold text-neutral-900 dark:text-white"
            >
              Trang Chủ
            </a>
            <a
              href="#category-showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-neutral-700 dark:text-neutral-300"
            >
              Danh Mục Sản Phẩm
            </a>
            <a
              href="#catalog-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-neutral-700 dark:text-neutral-300"
            >
              Bộ Sưu Tập Đồng Phục 2026
            </a>
            <a
              href="#ceo-letter-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 font-bold text-neutral-900 dark:text-white"
            >
              Thư Mời Hợp Tác - CEO Nguyễn Thị Thương
            </a>
            <a
              href="#fabric-guide-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-neutral-700 dark:text-neutral-300"
            >
              Bảng Vải Cao Cấp
            </a>
            <a
              href="#process-section"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-neutral-700 dark:text-neutral-300"
            >
              Quy Trình 5 Bước
            </a>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsQuickQuoteOpen(true);
            }}
            className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl text-sm"
          >
            Nhận Báo Giá Nhanh 3 Phút
          </button>
        </div>
      )}
    </header>
  );
}
