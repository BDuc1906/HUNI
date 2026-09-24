"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "./ProductCard";
import { Filter, SlidersHorizontal, Sparkles, RefreshCw, Search } from "lucide-react";

export default function ProductCatalog({ activeCategory, setActiveCategory }) {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");

  // Unique materials list for filter
  const materialsList = useMemo(() => {
    const list = ["all"];
    PRODUCTS.forEach((p) => {
      if (p.material && !list.includes(p.material)) {
        list.push(p.material);
      }
    });
    return list;
  }, []);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== "all" && item.material !== selectedMaterial) {
        return false;
      }
      // Search query
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchMaterial = item.material.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        if (!matchTitle && !matchMaterial && !matchDesc) return false;
      }
      // Price range
      if (priceRange === "under200" && item.price >= 200000) return false;
      if (priceRange === "200to500" && (item.price < 200000 || item.price > 500000)) return false;
      if (priceRange === "over500" && item.price <= 500000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // Default popular
    });
  }, [activeCategory, selectedMaterial, searchFilter, priceRange, sortBy]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchFilter("");
    setSelectedMaterial("all");
    setSortBy("popular");
    setPriceRange("all");
  };

  return (
    <section id="catalog-section" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Bộ Sưu Tập Đồng Phục 2026
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071b34]">
              DANH MỤC SẢN PHẨM & MAY ĐO HUNI
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Khám phá các dòng sản phẩm đồng phục chất lượng cao, tính giá sỉ tự động theo số lượng.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <strong className="text-slate-900">{filteredProducts.length}</strong> / {PRODUCTS.length} mẫu thiết kế
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-slate-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-[#071b34] text-amber-300 shadow-md shadow-slate-900/20"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Quick search input */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Lọc theo tên hoặc chất liệu..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Price filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Mức giá:</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="under200">Dưới 200.000 đ</option>
                <option value="200to500">200.000 đ - 500.000 đ</option>
                <option value="over500">Trên 500.000 đ (Vest/May đo)</option>
              </select>
            </div>

            {/* Sort filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="popular">Phổ biến & Đặt nhiều</option>
                <option value="priceAsc">Giá sỉ tăng dần</option>
                <option value="priceDesc">Giá sỉ giảm dần</option>
                <option value="rating">Đánh giá 5 sao cao nhất</option>
              </select>
            </div>

            {/* Reset button */}
            {(activeCategory !== "all" ||
              searchFilter ||
              selectedMaterial !== "all" ||
              priceRange !== "all") && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Đặt lại lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8">
            <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Không có mẫu đồng phục nào khớp với tiêu chí tìm kiếm hiện tại của bạn.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#071b34] text-amber-300 font-bold text-xs rounded-xl shadow hover:bg-slate-800 transition-colors"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
