"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import { Sparkles, ArrowRight, Award, Package } from "lucide-react";

// ============================================================
// FEATURED PRODUCTS — 1 hàng · 5 sản phẩm đại diện 5 loại
//
// 📐 LAYOUT:
//   - 1 HÀNG DUY NHẤT (không chia nhóm theo category)
//   - 5 cột trên desktop: mỗi cột 1 SP đại diện 1 loại
//   - Mobile: 2 SP/hàng, Tablet: 3 SP/hàng
//
// 🎯 LOGIC LẤY SP:
//   - Với mỗi category → lấy 1 SP đầu tiên (hoặc SP bestseller của category)
//   - Tổng cộng 5 SP → xếp vào 1 hàng
// ============================================================

// 5 loại cần hiển thị — mỗi loại lấy 1 SP đại diện
const CATEGORY_IDS = [
  "corporate",      // Đồng phục doanh nghiệp
  "bespoke_suit",   // May đo cao cấp
  "sport_golf",     // Thể thao & Golf
  "school",         // Trường học
  "accessories",    // Phụ kiện doanh nghiệp
];

export default function FeaturedProductsSection() {
  // ============================================================
  // LẤY 1 SP ĐẠI DIỆN CHO MỖI LOẠI
  // Ưu tiên: SP có flag isBestseller > SP có badge > SP đầu tiên
  // ============================================================
  const featuredProducts = CATEGORY_IDS.map((catId) => {
    const productsInCat = PRODUCTS.filter((p) => p.category === catId);
    if (productsInCat.length === 0) return null;

    // Ưu tiên bestseller
    const bestseller = productsInCat.find((p) => p.isBestseller === true);
    if (bestseller) return bestseller;

    // Fallback: SP có badge "Best Seller" hoặc "Bán Chạy"
    const badged = productsInCat.find(
      (p) =>
        p.badge &&
        (p.badge.toLowerCase().includes("best") ||
          p.badge.toLowerCase().includes("bán chạy"))
    );
    if (badged) return badged;

    // Fallback cuối: SP đầu tiên
    return productsInCat[0];
  }).filter(Boolean);

  const hasData = featuredProducts.length > 0;

  return (
    <section
      id="featured-products-section"
      className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            Bán Chạy Nhất
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            SẢN PHẨM NỔI BẬT
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Những mẫu đồng phục được khách hàng doanh nghiệp lựa chọn nhiều
            nhất — đại diện cho 5 dòng sản phẩm chủ lực.
          </p>
        </div>

        {/* ============================================
            GRID 1 HÀNG · 5 SP ĐẠI DIỆN 5 LOẠI
            ============================================ */}
        {hasData ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ============================================
                CTA — Xem tất cả
                ============================================ */}
            <div className="mt-10 sm:mt-12 text-center">
              <Link
                href="/dong-phuc-doanh-nghiep"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transform hover:-translate-y-1 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Xem Tất Cả Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <p className="mt-3 text-xs text-slate-500">
                Hơn 40+ mẫu đồng phục đang chờ bạn khám phá
              </p>
            </div>
          </>
        ) : (
          /* ============================================
              PLACEHOLDER — khi chưa có SP nào
              ============================================ */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#004f5e] mb-2">
              Danh Sách Đang Được Cập Nhật
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-5">
              HDC đang tổng hợp và cập nhật danh sách sản phẩm nổi bật. Vui lòng
              quay lại sau hoặc xem toàn bộ sản phẩm ngay bây giờ.
            </p>

            <Link
              href="/dong-phuc-doanh-nghiep"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Xem Tất Cả Sản Phẩm</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}