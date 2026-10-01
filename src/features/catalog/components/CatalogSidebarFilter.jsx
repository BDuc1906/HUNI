"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Phone,
  FileText,
  Star,
  Check,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight
} from "lucide-react";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO } from "@/shared/data";

export default function CatalogSidebarFilter({
  activeCategory,
  setActiveCategory,
  selectedSubtype,
  setSelectedSubtype,
  selectedMaterial,
  setSelectedMaterial,
  priceRange,
  setPriceRange,
  selectedBadge,
  setSelectedBadge,
  searchFilter,
  setSearchFilter,
  resetFilters,
  activeFiltersCount,
  totalResultsCount,
  totalProductsCount,
  onApplyMobile,
}) {
  const { setIsQuickQuoteOpen } = useShop();

  // Accordion state
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    material: true,
    badge: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Materials list
  const materials = [
    { id: "all", label: "Tất cả chất liệu" },
    { id: "cotton", label: "Cotton Compact 100%", tag: "Mềm mịn" },
    { id: "bamboo", label: "Sợi Tre Bamboo", tag: "Kháng khuẩn" },
    { id: "kate", label: "Kate Ý / Kate Mỹ", tag: "Chống nhăn" },
    { id: "pique", label: "Cá Sấu Pique CVC", tag: "Co giãn 4C" },
    { id: "seamless", label: "Seamless Ép Nhiệt", tag: "Không đường may" },
    { id: "wool_kaki", label: "Kaki & Wool Cao Cấp", tag: "Đứng form" },
    { id: "spandex", label: "Spandex Dry-Fit", tag: "Thoáng khí" },
  ];

  // Price ranges
  const priceRanges = [
    { id: "all", label: "Tất cả mức giá" },
    { id: "under200", label: "Dưới 200.000đ", sub: "Áo thun, sự kiện" },
    { id: "200to350", label: "200.000đ - 350.000đ", sub: "Polo, Sơ mi Kate" },
    { id: "350to600", label: "350.000đ - 600.000đ", sub: "Sơ mi Seamless, Bamboo" },
    { id: "over600", label: "Trên 600.000đ", sub: "Vest bespoke, đầm cao cấp" },
  ];

  return (
    <aside className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-5">
      {/* ====================================================
          HEADER BỘ LỌC
          ==================================================== */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#004f5e] uppercase tracking-wider">
              Bộ Lọc Tìm Kiếm
            </h3>
            <span className="text-[11px] text-slate-400">
              {totalResultsCount} / {totalProductsCount} mẫu
            </span>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors active:scale-95"
            title="Xóa toàn bộ tiêu chí đang chọn"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Xóa lọc ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* ====================================================
          1. TÌM KIẾM NHANH THEO TỪ KHÓA
          ==================================================== */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
          <span>Tìm kiếm</span>
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="text-slate-400 hover:text-slate-600 text-[10px]"
            >
              Xóa
            </button>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Tên áo, mã SKU, chất liệu..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ====================================================
          2. CÂY DANH MỤC & NHÓM ĐỒNG PHỤC (THEO 37 URL)
          ==================================================== */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-[#004f5e]"
        >
          <span>Danh Mục Sản Phẩm</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              openSections.category ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-1 text-xs">
            {/* Tất cả */}
            <button
              onClick={() => {
                setActiveCategory("all");
                setSelectedSubtype("all");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
                activeCategory === "all" && selectedSubtype === "all"
                  ? "bg-brand-500 text-white font-bold shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>Tất cả sản phẩm</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeCategory === "all" && selectedSubtype === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200/70 text-slate-600"
              }`}>
                {totalProductsCount}
              </span>
            </button>

            {/* 1. Hub Đồng phục doanh nghiệp */}
            <div className="pt-1">
              <div
                onClick={() => {
                  setActiveCategory("corporate");
                  setSelectedSubtype("all");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeCategory === "corporate" && selectedSubtype === "all"
                    ? "bg-brand-50 text-brand-700 font-extrabold border border-brand-300"
                    : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>👔</span>
                  <span className="truncate">Đồng Phục Doanh Nghiệp</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              {/* Sub-items của Doanh nghiệp */}
              <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-brand-100 ml-3 mt-1">
                {/* Áo sơ mi - KEYWORD CHÍNH */}
                <button
                  onClick={() => {
                    setActiveCategory("corporate");
                    setSelectedSubtype("so-mi");
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    selectedSubtype === "so-mi"
                      ? "bg-[#004f5e] text-brand-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="truncate font-medium flex items-center gap-1">
                    <span className="text-brand-500 font-bold">★</span> Áo sơ mi nam
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-bold shrink-0">
                    Hot
                  </span>
                </button>

                {/* Sơ mi con */}
                <div className="pl-3 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveCategory("corporate");
                      setSelectedSubtype("so-mi-tay-ngan");
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                      selectedSubtype === "so-mi-tay-ngan"
                        ? "text-brand-600 font-bold bg-brand-50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    • Sơ mi tay ngắn
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory("corporate");
                      setSelectedSubtype("so-mi-tay-dai");
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                      selectedSubtype === "so-mi-tay-dai"
                        ? "text-brand-600 font-bold bg-brand-50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    • Sơ mi tay dài
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory("corporate");
                      setSelectedSubtype("so-mi-seamless");
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                      selectedSubtype === "so-mi-seamless"
                        ? "text-brand-600 font-bold bg-brand-50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    • Sơ mi Seamless
                  </button>
                </div>

                {/* Polo */}
                <button
                  onClick={() => {
                    setActiveCategory("corporate");
                    setSelectedSubtype("polo");
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    selectedSubtype === "polo"
                      ? "bg-[#004f5e] text-brand-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Áo polo đồng phục</span>
                </button>

                {/* Áo thun */}
                <button
                  onClick={() => {
                    setActiveCategory("corporate");
                    setSelectedSubtype("ao-thun");
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    selectedSubtype === "ao-thun"
                      ? "bg-[#004f5e] text-brand-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Áo thun đồng phục</span>
                </button>
              </div>
            </div>

            {/* 2. May đo & Vest lãnh đạo */}
            <div className="pt-1">
              <div
                onClick={() => {
                  setActiveCategory("bespoke_suit");
                  setSelectedSubtype("all");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeCategory === "bespoke_suit" && selectedSubtype === "all"
                    ? "bg-brand-50 text-brand-700 font-extrabold border border-brand-300"
                    : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>🎩</span>
                  <span className="truncate">May Đo Cao Cấp &amp; Vest</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-brand-100 ml-3 mt-1">
                <button
                  onClick={() => {
                    setActiveCategory("bespoke_suit");
                    setSelectedSubtype("vest");
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedSubtype === "vest"
                      ? "bg-[#004f5e] text-brand-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Vest lãnh đạo doanh nhân</span>
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("bespoke_suit");
                    setSelectedSubtype("dam");
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedSubtype === "dam"
                      ? "bg-[#004f5e] text-brand-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Đầm công sở thanh lịch</span>
                </button>
              </div>
            </div>

            {/* 3. Thể Thao & Golf */}
            <div className="pt-1">
              <div
                onClick={() => {
                  setActiveCategory("sport_golf");
                  setSelectedSubtype("all");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeCategory === "sport_golf" && selectedSubtype === "all"
                    ? "bg-brand-50 text-brand-700 font-extrabold border border-brand-300"
                    : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>⛳</span>
                  <span className="truncate">Đồng Phục Thể Thao &amp; Golf</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>

              <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-brand-100 ml-3 mt-1">
                <button
                  onClick={() => {
                    setActiveCategory("sport_golf");
                    setSelectedSubtype("golf");
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedSubtype === "golf"
                      ? "bg-[#004f5e] text-brand-300 font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Áo Golf &amp; Pickleball &amp; Marathon</span>
                </button>
              </div>
            </div>

            {/* 4. Trường học */}
            <div className="pt-1">
              <div
                onClick={() => {
                  setActiveCategory("school");
                  setSelectedSubtype("all");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeCategory === "school" && selectedSubtype === "all"
                    ? "bg-brand-50 text-brand-700 font-extrabold border border-brand-300"
                    : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>🎓</span>
                  <span className="truncate">Đồng Phục Trường Học</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* 5. Phụ kiện */}
            <div className="pt-1">
              <div
                onClick={() => {
                  setActiveCategory("accessories");
                  setSelectedSubtype("all");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeCategory === "accessories" && selectedSubtype === "all"
                    ? "bg-brand-50 text-brand-700 font-extrabold border border-brand-300"
                    : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>🎁</span>
                  <span className="truncate">Phụ Kiện Doanh Nghiệp</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================
          3. KHOẢNG GIÁ SỈ
          ==================================================== */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-[#004f5e]"
        >
          <span>Khoảng Giá Sỉ (VNĐ)</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.price && (
          <div className="space-y-1.5 pt-1">
            {priceRanges.map((range) => {
              const isSelected = priceRange === range.id;
              return (
                <button
                  key={range.id}
                  onClick={() => setPriceRange(range.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/70 text-[#004f5e] font-bold shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{range.label}</div>
                    {range.sub && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{range.sub}</div>
                    )}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ====================================================
          4. CHẤT LIỆU VẢI
          ==================================================== */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => toggleSection("material")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-[#004f5e]"
        >
          <span>Chất Liệu Vải HDC</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              openSections.material ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.material && (
          <div className="space-y-1.5 pt-1">
            {materials.map((mat) => {
              const isSelected = selectedMaterial === mat.id;
              return (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-[#004f5e] text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="truncate">{mat.label}</span>
                  {mat.tag && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected
                          ? "bg-white/20 text-brand-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {mat.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ====================================================
          5. TIÊU CHÍ NỔI BẬT
          ==================================================== */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => toggleSection("badge")}
          className="w-full flex items-center justify-between py-1 text-left font-bold text-xs uppercase tracking-wider text-[#004f5e]"
        >
          <span>Đặc Tính &amp; Đánh Giá</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              openSections.badge ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.badge && (
          <div className="space-y-1.5 pt-1 text-xs">
            <button
              onClick={() => setSelectedBadge(selectedBadge === "bestSeller" ? "all" : "bestSeller")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                selectedBadge === "bestSeller"
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-bold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Dòng Bán Chạy (Best Seller)</span>
              </div>
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  selectedBadge === "bestSeller"
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedBadge === "bestSeller" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>

            <button
              onClick={() => setSelectedBadge(selectedBadge === "fiveStars" ? "all" : "fiveStars")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                selectedBadge === "fiveStars"
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-bold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Đánh giá 5.0 ★ cao nhất</span>
              </div>
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  selectedBadge === "fiveStars"
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedBadge === "fiveStars" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ====================================================
          6. BANNER TƯ VẤN DOANH NGHIỆP TRONG SIDEBAR
          ==================================================== */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white space-y-3 mt-1 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-brand-200 uppercase tracking-wider">
            May mẫu 0đ tận nơi
          </span>
        </div>

        <p className="text-[11px] text-slate-200 leading-relaxed">
          Quý doanh nghiệp cần xem chất vải và thử form áo thực tế? HDC cử chuyên viên mang mẫu đến tận văn phòng.
        </p>

        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="w-full py-2 bg-gradient-to-r from-brand-400 to-brand-500 hover:from-brand-300 hover:to-brand-400 text-white font-extrabold text-xs rounded-xl shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Nhận Báo Giá Nhanh</span>
          </button>

          <a
            href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/15"
          >
            <Phone className="w-3.5 h-3.5 text-brand-300" />
            <span>Hotline: {BRAND_INFO.contact.hotline}</span>
          </a>
        </div>
      </div>

      {/* Mobile Apply Button */}
      {onApplyMobile && (
        <div className="pt-2 sticky bottom-0 bg-white pb-2 border-t border-slate-100 flex gap-2">
          <button
            onClick={resetFilters}
            className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
          >
            Đặt lại
          </button>
          <button
            onClick={onApplyMobile}
            className="flex-2 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-extrabold shadow-md"
          >
            Xem {totalResultsCount} sản phẩm
          </button>
        </div>
      )}
    </aside>
  );
}
