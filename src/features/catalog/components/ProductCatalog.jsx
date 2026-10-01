"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
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
  PackageCheck,
  Flame,
  ArrowRight
} from "lucide-react";

const iconMap = {
  Briefcase: Briefcase,
  Crown: Crown,
  Activity: Activity,
  GraduationCap: GraduationCap,
  PackageCheck: PackageCheck
};

// Inline SkeletonCard component for transition loading
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col animate-pulse">
      <div className="h-52 sm:h-64 md:h-72 w-full bg-slate-200" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-12 bg-slate-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-3 w-16 bg-slate-200 rounded" />
          </div>
          <div className="h-9 w-9 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog({ initialCategory, isHome = false }) {
  const { activeCategory, setActiveCategory, setIsQuickQuoteOpen } = useShop();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, setActiveCategory]);

  const [searchFilter, setSearchFilter] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);

  // Materials unique list
  const materialOptions = useMemo(
    () => [...new Set(PRODUCTS.map((p) => p.material))].sort(),
    []
  );

  // Dedicated filter handlers that reset visibleCount without useEffect cascades
  const updateCategory = (catId) => {
    setVisibleCount(9);
    startTransition(() => {
      setActiveCategory(catId);
    });
  };

  const updateSearch = (val) => {
    setVisibleCount(9);
    startTransition(() => {
      setSearchFilter(val);
    });
  };

  const updateMaterial = (val) => {
    setVisibleCount(9);
    startTransition(() => {
      setSelectedMaterial(val);
    });
  };

  const updatePriceRange = (val) => {
    setVisibleCount(9);
    startTransition(() => {
      setPriceRange(val);
    });
  };

  const updateSortBy = (val) => {
    setVisibleCount(9);
    startTransition(() => {
      setSortBy(val);
    });
  };

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
      if (sortBy === "discount") {
        const discA =
          a.originalPrice && a.originalPrice > a.price
            ? (a.originalPrice - a.price) / a.originalPrice
            : 0;
        const discB =
          b.originalPrice && b.originalPrice > b.price
            ? (b.originalPrice - b.price) / b.originalPrice
            : 0;
        return discB - discA;
      }
      return 0;
    });
  }, [activeCategory, selectedMaterial, searchFilter, priceRange, sortBy]);

  // Lọc 4 sản phẩm hot nhất cho trang chủ
  const homeProducts = useMemo(() => {
    if (!isHome) return filteredProducts;

    // Khi ở trang chủ và chưa chọn bộ lọc riêng, lấy chính xác 4 sản phẩm flagship hot nhất:
    // 1. Áo Polo Doanh Nghiệp HDC Classic Gold (Bán Chạy Nhất)
    // 2. Sơ Mi Ngắn Tay HDC Classic Xanh Đậm (Best Seller Sơ Mi)
    // 3. Vest Công Sở HDC Classic Đen (Best Seller May Đo)
    // 4. Set Đồng Phục Golf & Pickleball HDC AeroCool Pro (Xu Hướng 2026)
    if (
      activeCategory === "all" &&
      !searchFilter.trim() &&
      selectedMaterial === "all" &&
      priceRange === "all" &&
      sortBy === "popular"
    ) {
      const flagshipIds = [
        "huni-polo-pro",
        "hdc-shirt-short-1",
        "hdc-vest-classic",
        "huni-golf-dryfit",
      ];
      const flagships = flagshipIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean);
      if (flagships.length === 4) return flagships;
    }

    // Nếu người dùng lọc danh mục/tìm kiếm ở trang chủ, ưu tiên sản phẩm Best Seller/Hot và lấy đúng 4 sản phẩm
    const sorted = [...filteredProducts].sort((a, b) => {
      const aIsHot =
        a.badge === "Best Seller" ||
        a.badge === "Bán Chạy Nhất" ||
        a.badge?.includes("Bán Chạy");
      const bIsHot =
        b.badge === "Best Seller" ||
        b.badge === "Bán Chạy Nhất" ||
        b.badge?.includes("Bán Chạy");
      if (aIsHot && !bIsHot) return -1;
      if (!aIsHot && bIsHot) return 1;
      return 0;
    });
    return sorted.slice(0, 4);
  }, [
    isHome,
    filteredProducts,
    activeCategory,
    searchFilter,
    selectedMaterial,
    priceRange,
    sortBy,
  ]);

  const displayedProducts = isHome
    ? homeProducts
    : filteredProducts.slice(0, visibleCount);

  const activeFiltersCount = [
    activeCategory !== "all",
    searchFilter.trim() !== "",
    selectedMaterial !== "all",
    priceRange !== "all",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setVisibleCount(9);
    startTransition(() => {
      setActiveCategory("all");
      setSearchFilter("");
      setSelectedMaterial("all");
      setSortBy("popular");
      setPriceRange("all");
    });
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
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
              isHome
                ? "bg-rose-50 border border-rose-200 text-rose-700"
                : "bg-brand-50 border border-brand-200 text-brand-700"
            }`}
          >
            {isHome ? (
              <>
                <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>Top 4 Sản Phẩm Bán Chạy Nhất 2026</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
                <span>Danh Mục &amp; Sản Phẩm 2026</span>
              </>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#004f5e]">
            {isHome
              ? "TOP 4 SẢN PHẨM ĐỒNG PHỤC HOT NHẤT"
              : "DANH MỤC SẢN PHẨM ĐỒNG PHỤC HDC"}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            {isHome
              ? "Những thiết kế chủ lực được hơn 50.000+ tập đoàn, doanh nghiệp tin chọn đặt may nhiều nhất — chuẩn form tôn dáng, bền bỉ và tối ưu ngân sách."
              : "Chọn nhóm sản phẩm bên dưới để xem ngay các mẫu thiết kế, chất liệu và bảng giá sỉ tương ứng — tất cả trong một nơi duy nhất."}
          </p>
        </div>

        {/* =============================================
            Category Cards — Visual selector
            ============================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5 mb-8 sm:mb-10">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Briefcase;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  updateCategory(cat.id);
                  scrollToGrid();
                }}
                className={`group relative text-left cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border flex flex-col transform hover:-translate-y-1 active:scale-[0.98] ${
                  isActive
                    ? "border-brand-500 ring-2 ring-brand-500/30"
                    : "border-slate-200 hover:border-brand-400"
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
                        ? "bg-brand-500 text-white"
                        : "bg-white/90 text-slate-900 group-hover:bg-brand-500 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-[#004f5e] group-hover:text-brand-700 transition-colors text-xs sm:text-sm md:text-base line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-brand-700 font-bold">Xem mẫu</span>
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
                type="button"
                onClick={() => updateCategory("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
                  activeCategory === "all"
                    ? "bg-[#004f5e] text-brand-300 shadow-md"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Tất Cả ({PRODUCTS.length})
              </button>
              {displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.98] ${
                    activeCategory === cat.id
                      ? "bg-[#004f5e] text-brand-300 shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] sm:text-xs text-slate-500 font-medium pt-4 sm:pt-6 shrink-0">
            {isHome ? (
              <span>
                Hiển thị <strong className="text-[#004f5e]">{displayedProducts.length}</strong> sản phẩm hot nhất
              </span>
            ) : (
              <span>
                Hiển thị <strong className="text-[#004f5e]">{Math.min(visibleCount, filteredProducts.length)}</strong> / {filteredProducts.length} mẫu
              </span>
            )}
          </div>
        </div>

        {/* =============================================
            Secondary Filter Bar
            ============================================= */}
        <div className="bg-slate-50 p-2.5 sm:p-4 rounded-2xl border border-slate-200 mb-6 sm:mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          {/* Quick search */}
          <div className="relative w-full lg:max-w-xs shrink-0">
            <input
              type="text"
              placeholder="Lọc theo tên hoặc chất liệu..."
              value={searchFilter}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 text-xs sm:text-sm"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            {/* Material filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs whitespace-nowrap hidden xs:inline">Chất liệu:</span>
              <select
                value={selectedMaterial}
                onChange={(e) => updateMaterial(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-300 rounded-xl px-2 sm:px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-[11px] sm:text-xs max-w-full sm:max-w-[150px] truncate"
              >
                <option value="all">Tất cả chất liệu</option>
                {materialOptions.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs whitespace-nowrap hidden xs:inline">Giá:</span>
              <select
                value={priceRange}
                onChange={(e) => updatePriceRange(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-300 rounded-xl px-2 sm:px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-[11px] sm:text-xs"
              >
                <option value="all">Tất cả giá</option>
                <option value="under200">Dưới 200k</option>
                <option value="200to500">200k - 500k</option>
                <option value="over500">Trên 500k</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs whitespace-nowrap hidden xs:inline">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => updateSortBy(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-300 rounded-xl px-2 sm:px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-brand-500 text-[11px] sm:text-xs"
              >
                <option value="popular">Phổ biến</option>
                <option value="discount">Giảm giá nhiều nhất</option>
                <option value="priceAsc">Giá tăng</option>
                <option value="priceDesc">Giá giảm</option>
              </select>
            </div>

            {/* Reset */}
            {(activeFiltersCount > 0 || sortBy !== "popular") && (
              <button
                type="button"
                onClick={resetFilters}
                className="w-full sm:w-auto justify-center px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs active:scale-[0.98]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Đặt lại</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* =============================================
            Product Grid / Skeleton Loading
            ============================================= */}
        {isPending ? (
          <div
            className={
              isHome
                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6"
            }
          >
            {Array.from({ length: isHome ? 4 : 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div
              className={
                isHome
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                  : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6"
              }
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Bottom Actions: Homepage CTA vs Category Pagination */}
            {isHome ? (
              <div className="mt-8 sm:mt-12 text-center space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/dong-phuc-doanh-nghiep"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-brand-500/25 active:scale-95 transition-all group"
                  >
                    <span>Xem Toàn Bộ 40+ Mẫu Đồng Phục</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsQuickQuoteOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#004f5e] font-bold text-xs sm:text-sm rounded-2xl border-2 border-[#004f5e]/20 active:scale-95 transition-all shadow-sm"
                  >
                    <span>Yêu Cầu Báo Giá Sỉ &amp; Mẫu Thử 0đ</span>
                  </button>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Hiển thị 4 sản phẩm tiêu biểu • Hỗ trợ may đo mẫu thử 0đ và gửi tập vải mẫu tận văn phòng
                </p>
              </div>
            ) : (
              /* Load-more Pattern for Category pages */
              <div className="mt-8 sm:mt-12 text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Đang xem {Math.min(visibleCount, filteredProducts.length)} / {filteredProducts.length} sản phẩm
                </p>
                {visibleCount < filteredProducts.length && (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + 9, filteredProducts.length)
                      )
                    }
                    className="px-6 py-3 bg-[#004f5e] hover:bg-[#003843] text-brand-300 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    Xem thêm {Math.min(9, filteredProducts.length - visibleCount)} sản phẩm
                  </button>
                )}
              </div>
            )}
          </>
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
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#004f5e] text-brand-300 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-slate-800 transition-colors active:scale-[0.98]"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
