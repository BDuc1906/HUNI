"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import { PRODUCTS, CATEGORIES } from "@/shared/data";
import ProductCard from "./ProductCard";
import {
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Search,
  Crown,
  Briefcase,
  Activity,
  GraduationCap,
  PackageCheck
} from "lucide-react";

const iconMap = {
  Briefcase: Briefcase,
  Crown: Crown,
  Activity: Activity,
  GraduationCap: GraduationCap,
  PackageCheck: PackageCheck
};

export default function ProductCatalog() {
  const { activeCategory, setActiveCategory } = useShop();
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");

  // Only real categories (excluding "all")
  const displayCategories = CATEGORIES.filter((c) => c.id !== "all");

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (selectedMaterial !== "all" && item.material !== selectedMaterial) {
        return false;
      }
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchMaterial = item.material.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        if (!matchTitle && !matchMaterial && !matchDesc) return false;
      }
      if (priceRange === "under200" && item.price >= 200000) return false;
      if (priceRange === "200to500" && (item.price < 200000 || item.price > 500000)) return false;
      if (priceRange === "over500" && item.price <= 500000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, selectedMaterial, searchFilter, priceRange, sortBy]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchFilter("");
    setSelectedMaterial("all");
    setSortBy("popular");
    setPriceRange("all");
  };

  const scrollToGrid = () => {
    const el = document.getElementById("product-grid-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =============================================
            Section Header
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            Danh Mục &amp; Sản Phẩm 2026
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#071b34]">
            DANH MỤC SẢN PHẨM ĐỒNG PHỤC HUNI
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            Chọn nhóm sản phẩm bên dưới để xem ngay các mẫu thiết kế, chất liệu và bảng giá sỉ
            tương ứng — tất cả trong một nơi duy nhất.
          </p>
        </div>

        {/* =============================================
            Category Cards — Visual selector
            ============================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-10">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Briefcase;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToGrid();
                }}
                className={`group relative text-left cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border flex flex-col transform hover:-translate-y-1 active:scale-[0.98] ${
                  isActive
                    ? "border-amber-500 ring-2 ring-amber-500/30"
                    : "border-slate-200 hover:border-amber-400"
                }`}
              >
                {/* Category Image — next/image với fill */}
                <div className="relative h-32 sm:h-40 md:h-48 lg:h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Icon Badge */}
                  <div
                    className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md transition-colors ${
                      isActive
                        ? "bg-amber-500 text-white"
                        : "bg-white/90 text-slate-900 group-hover:bg-amber-500 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-[#071b34] group-hover:text-amber-700 transition-colors text-xs sm:text-sm md:text-base line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-amber-700 font-bold">Xem mẫu</span>
                    <span className="text-slate-400 font-medium hidden sm:inline">{cat.count} mẫu</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* =============================================
            Anchor + result count + filter pills
            ============================================= */}
        <div
          id="product-grid-anchor"
          className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pt-2 border-t border-slate-100"
        >
          {/* Category pills — scroll ngang trên mobile */}
          <div className="pt-4 sm:pt-6 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
                  activeCategory === "all"
                    ? "bg-[#071b34] text-amber-300 shadow-md"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Tất cả
              </button>
              {displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
                    activeCategory === cat.id
                      ? "bg-[#071b34] text-amber-300 shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] sm:text-xs text-slate-500 font-medium pt-4 sm:pt-6 shrink-0">
            Hiển thị <strong className="text-[#071b34]">{filteredProducts.length}</strong> / {PRODUCTS.length} mẫu
          </div>
        </div>

        {/* =============================================
            Secondary Filter Bar
            ============================================= */}
        <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 mb-6 sm:mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Quick search */}
          <div className="relative w-full md:flex-1 md:max-w-xs">
            <input
              type="text"
              placeholder="Lọc theo tên hoặc chất liệu..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Price filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs whitespace-nowrap">Giá:</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="flex-1 sm:flex-initial bg-white border border-slate-300 rounded-xl px-2 sm:px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-amber-500 text-[11px] sm:text-xs"
              >
                <option value="all">Tất cả</option>
                <option value="under200">Dưới 200k</option>
                <option value="200to500">200k - 500k</option>
                <option value="over500">Trên 500k</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-initial bg-white border border-slate-300 rounded-xl px-2 sm:px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-amber-500 text-[11px] sm:text-xs"
              >
                <option value="popular">Phổ biến</option>
                <option value="priceAsc">Giá tăng</option>
                <option value="priceDesc">Giá giảm</option>
                <option value="rating">5 sao</option>
              </select>
            </div>

            {/* Reset */}
            {(activeCategory !== "all" ||
              searchFilter ||
              selectedMaterial !== "all" ||
              priceRange !== "all") && (
              <button
                onClick={resetFilters}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium flex items-center gap-1 transition-colors text-[11px] sm:text-xs active:scale-[0.98]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* =============================================
            Product Grid
            ============================================= */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 sm:p-8">
            <SlidersHorizontal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Không có mẫu đồng phục nào khớp với tiêu chí tìm kiếm hiện tại của bạn.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#071b34] text-amber-300 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-slate-800 transition-colors active:scale-[0.98]"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}