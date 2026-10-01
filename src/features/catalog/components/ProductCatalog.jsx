"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/shared/providers/ShopProvider";
import { PRODUCTS, CATEGORIES, BRAND_INFO } from "@/shared/data";
import ProductCard from "./ProductCard";
import CatalogSidebarFilter from "./CatalogSidebarFilter";
import {
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Search,
  Crown,
  Briefcase,
  Activity,
  GraduationCap,
  PackageCheck,
  X,
  LayoutGrid,
  Grid3X3,
  Phone,
  FileText,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2,
  Scissors
} from "lucide-react";

export default function ProductCatalog({ initialCategory }) {
  const { activeCategory, setActiveCategory, setIsQuickQuoteOpen } = useShop();

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, setActiveCategory]);

  // Filter states
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [gridCols, setGridCols] = useState(3); // 2 or 3 columns on desktop
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Real categories
  const displayCategories = CATEGORIES.filter((c) => c.id !== "all");

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // 1. Category
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }

      // 2. Subtype
      if (selectedSubtype !== "all") {
        const titleLower = item.title.toLowerCase();
        const matLower = item.material.toLowerCase();
        const catLower = item.category.toLowerCase();

        if (selectedSubtype === "so-mi") {
          if (!titleLower.includes("sơ mi") && !titleLower.includes("shirt")) return false;
        } else if (selectedSubtype === "so-mi-tay-ngan") {
          if (!titleLower.includes("ngắn tay") && !titleLower.includes("tay ngắn")) return false;
        } else if (selectedSubtype === "so-mi-tay-dai") {
          if (!titleLower.includes("dài tay") && !titleLower.includes("tay dài")) return false;
        } else if (selectedSubtype === "so-mi-seamless") {
          if (!titleLower.includes("seamless") && !matLower.includes("seamless")) return false;
        } else if (selectedSubtype === "polo") {
          if (!titleLower.includes("polo")) return false;
        } else if (selectedSubtype === "ao-thun") {
          if (!titleLower.includes("thun") && !titleLower.includes("t-shirt")) return false;
        } else if (selectedSubtype === "vest") {
          if (!titleLower.includes("vest") && !titleLower.includes("suit")) return false;
        } else if (selectedSubtype === "dam") {
          if (!titleLower.includes("đầm") && !titleLower.includes("váy")) return false;
        } else if (selectedSubtype === "golf") {
          if (catLower !== "sport_golf" && !titleLower.includes("golf")) return false;
        } else if (selectedSubtype === "school") {
          if (catLower !== "school" && !titleLower.includes("học sinh") && !titleLower.includes("trường")) return false;
        } else if (selectedSubtype === "accessories") {
          if (catLower !== "accessories" && !titleLower.includes("nón") && !titleLower.includes("cà vạt") && !titleLower.includes("cặp")) return false;
        }
      }

      // 3. Material
      if (selectedMaterial !== "all") {
        const matLower = item.material.toLowerCase();
        if (selectedMaterial === "cotton" && !matLower.includes("cotton")) return false;
        if (selectedMaterial === "bamboo" && !matLower.includes("bamboo") && !matLower.includes("tre")) return false;
        if (selectedMaterial === "kate" && !matLower.includes("kate")) return false;
        if (selectedMaterial === "pique" && !matLower.includes("cá sấu") && !matLower.includes("pique") && !matLower.includes("cvc")) return false;
        if (selectedMaterial === "seamless" && !matLower.includes("seamless") && !item.title.toLowerCase().includes("seamless")) return false;
        if (selectedMaterial === "wool_kaki" && !matLower.includes("kaki") && !matLower.includes("wool") && !matLower.includes("tuyết")) return false;
        if (selectedMaterial === "spandex" && !matLower.includes("spandex") && !matLower.includes("dry") && !matLower.includes("thể thao")) return false;
      }

      // 4. Price range
      if (priceRange === "under200" && item.price >= 200000) return false;
      if (priceRange === "200to350" && (item.price < 200000 || item.price > 350000)) return false;
      if (priceRange === "350to600" && (item.price < 350000 || item.price > 600000)) return false;
      if (priceRange === "over600" && item.price <= 600000) return false;

      // 5. Badge & Stars
      if (selectedBadge === "bestSeller" && !item.badge?.toLowerCase().includes("best")) return false;
      if (selectedBadge === "fiveStars" && item.rating < 4.9) return false;

      // 6. Search
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchMaterial = item.material.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchSku = item.sku?.toLowerCase().includes(query);
        if (!matchTitle && !matchMaterial && !matchDesc && !matchSku) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0;
    });
  }, [activeCategory, selectedSubtype, selectedMaterial, priceRange, selectedBadge, searchFilter, sortBy]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "all") count++;
    if (selectedSubtype !== "all") count++;
    if (selectedMaterial !== "all") count++;
    if (priceRange !== "all") count++;
    if (selectedBadge !== "all") count++;
    if (searchFilter.trim()) count++;
    return count;
  }, [activeCategory, selectedSubtype, selectedMaterial, priceRange, selectedBadge, searchFilter]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSelectedSubtype("all");
    setSelectedMaterial("all");
    setPriceRange("all");
    setSelectedBadge("all");
    setSearchFilter("");
    setSortBy("popular");
  };

  const scrollToGrid = () => {
    const el = document.getElementById("product-grid-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Human-readable labels for active pills
  const getSubtypeLabel = (st) => {
    switch (st) {
      case "so-mi": return "Áo sơ mi nam (★ Hot)";
      case "so-mi-tay-ngan": return "Sơ mi tay ngắn";
      case "so-mi-tay-dai": return "Sơ mi tay dài";
      case "so-mi-seamless": return "Sơ mi Seamless";
      case "polo": return "Áo polo đồng phục";
      case "ao-thun": return "Áo thun đồng phục";
      case "vest": return "Vest lãnh đạo";
      case "dam": return "Đầm công sở";
      case "golf": return "Đồng phục Golf & Thể thao";
      case "school": return "Đồng phục trường học";
      case "accessories": return "Phụ kiện";
      default: return st;
    }
  };

  const getMaterialLabel = (m) => {
    switch (m) {
      case "cotton": return "Cotton Compact";
      case "bamboo": return "Sợi Tre Bamboo";
      case "kate": return "Kate Ý / Kate Mỹ";
      case "pique": return "Cá Sấu Pique CVC";
      case "seamless": return "Seamless Ép Nhiệt";
      case "wool_kaki": return "Kaki & Wool";
      case "spandex": return "Spandex Dry-fit";
      default: return m;
    }
  };

  const getPriceLabel = (p) => {
    switch (p) {
      case "under200": return "< 200.000đ";
      case "200to350": return "200k - 350k";
      case "350to600": return "350k - 600k";
      case "over600": return "> 600.000đ";
      default: return p;
    }
  };

  return (
    <section id="catalog-section" className="py-10 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =============================================
            1. SECTION HEADER KHOA HỌC & CHUYÊN NGHIỆP
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2 sm:space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            HỆ THỐNG DANH MỤC ĐỒNG PHỤC DOANH NGHIỆP 2026
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#004f5e] tracking-tight">
            BỘ SƯU TẬP ĐỒNG PHỤC CAO CẤP HDC
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Phân loại khoa học theo ngành nghề và tính năng dệt may: Chống nhăn tự nhiên, sợi kháng khuẩn,
            co giãn 4 chiều, may đo theo bộ nhận diện thương hiệu độc quyền.
          </p>
        </div>

        {/* =============================================
            2. BẢNG CAM KẾT TIÊU CHUẨN DỆT MAY B2B
            ============================================= */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">Vải Kháng Khuẩn</div>
              <div className="text-[10px] text-slate-500 truncate">Sợi tre Bamboo &amp; Compact</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">May Mẫu Thử 0đ</div>
              <div className="text-[10px] text-slate-500 truncate">Duyệt form trước khi may loạt</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">Xưởng May 2.500m²</div>
              <div className="text-[10px] text-slate-500 truncate">50.000 sản phẩm / tháng</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">Bảo Hành 1 Đổi 1</div>
              <div className="text-[10px] text-slate-500 truncate">Đổi mới trong 30 ngày</div>
            </div>
          </div>
        </div>

        {/* =============================================
            3. THANH ĐIỀU HƯỚNG NHANH CÁC NHÓM ĐỒNG PHỤC (TABS CHUYÊN NGHIỆP)
            ============================================= */}
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-1 -mx-3 sm:mx-0 px-3 sm:px-0">
          <div className="flex items-center gap-2 min-w-max bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setActiveCategory("all");
                setSelectedSubtype("all");
                scrollToGrid();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === "all" && selectedSubtype === "all"
                  ? "bg-[#004f5e] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <span>Tất cả</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeCategory === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {PRODUCTS.length}
              </span>
            </button>

            {displayCategories.map((cat) => {
              const isActive = activeCategory === cat.id && selectedSubtype === "all";
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedSubtype("all");
                    scrollToGrid();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#004f5e] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Anchor point */}
        <div id="product-grid-anchor" className="pt-1" />

        {/* =============================================
            4. MAIN 2-COLUMN LAYOUT: BỘ LỌC BÊN TRÁI + SẢN PHẨM
            ============================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ===========================================
              LEFT SIDEBAR: BỘ LỌC BÊN TRÁI (DESKTOP)
              =========================================== */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 self-start">
            <CatalogSidebarFilter
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedSubtype={selectedSubtype}
              setSelectedSubtype={setSelectedSubtype}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedBadge={selectedBadge}
              setSelectedBadge={setSelectedBadge}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              resetFilters={resetFilters}
              activeFiltersCount={activeFiltersCount}
              totalResultsCount={filteredProducts.length}
              totalProductsCount={PRODUCTS.length}
            />
          </div>

          {/* ===========================================
              RIGHT MAIN: TOOLBAR + ACTIVE TAGS + GRID
              =========================================== */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">

            {/* Top Toolbar */}
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Left: Mobile Filter Button + Result Count */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-2 bg-[#004f5e] text-brand-300 text-xs font-bold rounded-xl shadow-sm active:scale-95 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Bộ lọc {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
                </button>

                <div className="text-xs text-slate-600">
                  Hiển thị <strong className="text-[#004f5e] font-extrabold">{filteredProducts.length}</strong> / {PRODUCTS.length} mẫu thiết kế
                </div>
              </div>

              {/* Right: Sort By + Grid Layout Toggle */}
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium text-xs hidden sm:inline">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-brand-500 text-xs"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá 5.0 ★</option>
                    <option value="priceAsc">Giá sỉ tăng dần</option>
                    <option value="priceDesc">Giá sỉ giảm dần</option>
                    <option value="newest">Mẫu mới nhất</option>
                  </select>
                </div>

                {/* Grid toggle (Desktop) */}
                <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setGridCols(2)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      gridCols === 2 ? "bg-[#004f5e] text-white shadow-xs" : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="2 cột"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      gridCols === 3 ? "bg-[#004f5e] text-white shadow-xs" : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="3 cột"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Tags / Pills Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-xs font-bold text-slate-500">Đang lọc:</span>

                {/* Category tag */}
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-300 text-brand-700 text-xs font-semibold">
                    <span>
                      Nhóm: {displayCategories.find((c) => c.id === activeCategory)?.name || activeCategory}
                    </span>
                    <button
                      onClick={() => setActiveCategory("all")}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Subtype tag */}
                {selectedSubtype !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-300 text-brand-700 text-xs font-semibold">
                    <span>Mẫu: {getSubtypeLabel(selectedSubtype)}</span>
                    <button
                      onClick={() => setSelectedSubtype("all")}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Material tag */}
                {selectedMaterial !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-300 text-brand-700 text-xs font-semibold">
                    <span>Vải: {getMaterialLabel(selectedMaterial)}</span>
                    <button
                      onClick={() => setSelectedMaterial("all")}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Price tag */}
                {priceRange !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-300 text-brand-700 text-xs font-semibold">
                    <span>Giá: {getPriceLabel(priceRange)}</span>
                    <button
                      onClick={() => setPriceRange("all")}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Badge tag */}
                {selectedBadge !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-300 text-brand-700 text-xs font-semibold">
                    <span>{selectedBadge === "bestSeller" ? "Best Seller" : "Đánh giá 5.0 ★"}</span>
                    <button
                      onClick={() => setSelectedBadge("all")}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Search tag */}
                {searchFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-300 text-brand-700 text-xs font-semibold">
                    <span>Từ khóa: &quot;{searchFilter}&quot;</span>
                    <button
                      onClick={() => setSearchFilter("")}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Clear all */}
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:underline font-bold ml-1"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* =========================================
                PRODUCT GRID
                ========================================= */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 ${
                  gridCols === 2 ? "lg:grid-cols-2 xl:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-3"
                } gap-3 sm:gap-4 lg:gap-5`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-6 sm:p-8">
                <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Không tìm thấy mẫu phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  Không có mẫu đồng phục nào khớp với bộ lọc hiện tại. Quý khách vui lòng thử chọn chất liệu hoặc khoảng giá khác.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-bold text-xs sm:text-sm rounded-xl shadow active:scale-95 transition-all"
                  >
                    Xóa toàn bộ lọc
                  </button>
                  <button
                    onClick={() => setIsQuickQuoteOpen(true)}
                    className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow active:scale-95 transition-all"
                  >
                    Yêu cầu may mẫu riêng
                  </button>
                </div>
              </div>
            )}

            {/* =========================================
                BOTTOM CTA FOR ENTERPRISES
                ========================================= */}
            <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-50 via-brand-50/50 to-slate-50 border border-brand-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-xs font-extrabold uppercase tracking-wider text-brand-700 flex items-center justify-center md:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dịch vụ may đo &amp; thiết kế riêng cho doanh nghiệp
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#004f5e]">
                  Cần thiết kế 2D/3D theo nhận diện thương hiệu hoặc may mẫu thử miễn phí?
                </h4>
                <p className="text-xs text-slate-600 max-w-xl">
                  HDC hỗ trợ phác thảo mẫu áo 3D với logo công ty trong 2 giờ và gửi áo mẫu thử tận nơi miễn phí trước khi sản xuất hàng loạt.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsQuickQuoteOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Báo Giá Nhanh</span>
                </button>
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="px-4 py-2.5 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-bold text-xs sm:text-sm rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>0984.959.586</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* =============================================
            MOBILE SLIDE-OVER FILTER DRAWER
            ============================================= */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
              {/* Drawer Top Header */}
              <div className="p-4 bg-[#003843] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                  <span className="font-extrabold text-sm uppercase tracking-wider">
                    Bộ Lọc Sản Phẩm
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4">
                <CatalogSidebarFilter
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  selectedSubtype={selectedSubtype}
                  setSelectedSubtype={setSelectedSubtype}
                  selectedMaterial={selectedMaterial}
                  setSelectedMaterial={setSelectedMaterial}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedBadge={selectedBadge}
                  setSelectedBadge={setSelectedBadge}
                  searchFilter={searchFilter}
                  setSearchFilter={setSearchFilter}
                  resetFilters={resetFilters}
                  activeFiltersCount={activeFiltersCount}
                  totalResultsCount={filteredProducts.length}
                  totalProductsCount={PRODUCTS.length}
                  onApplyMobile={() => setIsMobileFilterOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
