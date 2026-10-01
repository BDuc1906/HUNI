"use client";

// ==================================================
// src/features/catalog/components/CategorySubPage.jsx
// Trang danh mục con đa cấp (Level 3 & 4) chuẩn SEO & Link Equity
// ==================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import { PRODUCTS, BRAND_INFO } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import {
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  FileText,
  ArrowRight,
  Tag,
  Package,
} from "lucide-react";

export default function CategorySubPage({ categoryInfo, slugArray }) {
  if (!categoryInfo) return null;

  // Tìm sản phẩm thuộc danh mục này
  const matchedProducts = PRODUCTS.filter((p) => {
    // 1. Phù hợp categoryKey
    const matchesCat = p.category === categoryInfo.categoryKey;
    if (!matchesCat) return false;

    // 2. Lọc theo filterKeyword nếu có
    if (categoryInfo.filterKeyword) {
      const kw = categoryInfo.filterKeyword.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(kw);
      const matMatch = p.material?.toLowerCase().includes(kw);
      const featMatch = p.features?.some((f) => f.toLowerCase().includes(kw));
      return titleMatch || matMatch || featMatch;
    }
    return true;
  });

  // Nếu bộ lọc quá hẹp, lấy thêm các sản phẩm cùng nhóm categoryKey
  const displayProducts =
    matchedProducts.length > 0
      ? matchedProducts
      : PRODUCTS.filter((p) => p.category === categoryInfo.categoryKey).slice(0, 8);

  // Lấy các bài viết blog liên quan để phân bổ Link Juice (SEO Link Equity)
  const relatedBlogs = (categoryInfo.relatedBlogs || [])
    .map((url) => {
      const slug = url.replace("/blog/", "");
      return SITE_HIERARCHY.blogs.find((b) => b.slug === slug);
    })
    .filter(Boolean);

  // Lấy danh mục anh em / danh mục con
  const parentCat = categoryInfo.parent
    ? SITE_HIERARCHY.categories[categoryInfo.parent.replace("/", "")]
    : null;

  const siblingCategories = parentCat
    ? (parentCat.subcategories || [])
        .map((url) => SITE_HIERARCHY.categories[url.replace("/", "")])
        .filter(Boolean)
    : [];

  const subCategoriesList = (categoryInfo.subcategories || [])
    .map((url) => SITE_HIERARCHY.categories[url.replace("/", "")])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* =============================================
          HERO BANNER & BREADCRUMBS
          ============================================= */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-10 sm:py-14 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs chuẩn SEO */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 overflow-x-auto whitespace-nowrap scrollbar-none py-1"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />

            {parentCat && (
              <>
                <Link
                  href={parentCat.url}
                  className="hover:text-white transition-colors"
                >
                  {parentCat.shortTitle || parentCat.title}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              </>
            )}

            <span className="text-white font-bold">
              {categoryInfo.shortTitle || categoryInfo.title}
            </span>
          </nav>

          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30">
              <Tag className="w-3.5 h-3.5" />
              <span>Chuyên Mục Sản Xuất • Chuẩn Form HDC</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {categoryInfo.h1}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
              {categoryInfo.desc}
            </p>

            {/* Badges cam kết */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-brand-200 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>May mẫu thử tận nơi 0đ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Bảo hành 30 ngày lỗi may</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Chiết khấu sỉ lên tới 35%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          SUB-CATEGORIES PILL SWITCHER
          ============================================= */}
      {(subCategoriesList.length > 0 || siblingCategories.length > 0) && (
        <section className="bg-white border-b border-slate-200 py-3 sm:py-4 sticky top-16 z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
                Phân loại liên quan:
              </span>

              {/* Nếu có danh mục con trực tiếp */}
              {subCategoriesList.map((sub) => (
                <Link
                  key={sub.url}
                  href={sub.url}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition-colors"
                >
                  {sub.shortTitle}
                </Link>
              ))}

              {/* Các danh mục anh em */}
              {siblingCategories.map((sib) => {
                const isActive = sib.url === categoryInfo.url;
                return (
                  <Link
                    key={sib.url}
                    href={sib.url}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                      isActive
                        ? "bg-[#004f5e] text-brand-300 border-[#004f5e]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    }`}
                  >
                    {sib.shortTitle}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =============================================
          PRODUCT GRID
          ============================================= */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                Các Mẫu {categoryInfo.shortTitle} Tiêu Biểu ({displayProducts.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Bảng giá sỉ áp dụng trực tiếp tại xưởng HDC theo từng mốc số lượng.
              </p>
            </div>
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Tư vấn đặt may theo yêu cầu</span>
            </a>
          </div>

          {/* Lưới sản phẩm responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6">
            {displayProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          {/* =============================================
              SEO LINK EQUITY & CONTEXTUAL BLOGS
              (Chuyển Link Juice từ Category sang Blog và ngược lại)
              ============================================= */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12 p-5 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Cẩm Nang &amp; Hướng Dẫn Liên Quan Đến {categoryInfo.shortTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {relatedBlogs.map((b) => (
                  <Link
                    key={b.url}
                    href={b.url}
                    className="p-3.5 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                        {b.categoryBadge}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-2">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {b.summary}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-amber-700 font-bold">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Banner B2B Báo giá nhanh */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#003843] to-[#005a6b] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Xưởng May Trực Tiếp HDC 2.500m²
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Cần May {categoryInfo.shortTitle} Cho Doanh Nghiệp?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Nhận phác thảo 3D phối màu nhận diện miễn phí, duyệt mẫu vải tận tay và báo giá chi tiết trong vòng 5 phút.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#071b34] font-extrabold text-xs sm:text-sm text-center shadow-lg transition-all"
              >
                Hotline: {BRAND_INFO.contact.hotline}
              </a>
              <Link
                href="/lien-he"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm text-center border border-white/20 transition-all"
              >
                Tư vấn showroom
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
