"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import { Sparkles, ArrowRight, Award } from "lucide-react";

// ============================================================
// SIGNATURE COLLECTION — Sản phẩm mới nhất trên trang chủ
//
// 🎯 CÁCH HOẠT ĐỘNG:
//   1. Ưu tiên SP có `featured: true` (manual pick)
//   2. Nếu chưa đủ → lấy SP CUỐI mảng products.js (mới thêm)
//   3. Nếu vẫn thiếu → lấy SP có badge (fallback)
//
// 📝 CÁCH THÊM SP MỚI LÊN TRANG CHỦ:
//   → Chỉ cần thêm SP vào CUỐI mảng products.js
//   → Hoặc thêm `featured: true` vào SP muốn show
// ============================================================

const FEATURED_COUNT = 6;

export default function SignatureCollection() {
  // ============================================================
  // LOGIC CHỌN 6 SẢN PHẨM
  // ============================================================
  const getFeaturedProducts = () => {
    // 1. Sản phẩm được đánh dấu featured (manual pick)
    const featured = PRODUCTS.filter((p) => p.featured === true);

    if (featured.length >= FEATURED_COUNT) {
      return featured.slice(0, FEATURED_COUNT);
    }

    // 2. Nếu chưa đủ → lấy SP CUỐI mảng (mới thêm)
    const featuredIds = new Set(featured.map((p) => p.id));
    const remaining = PRODUCTS.filter((p) => !featuredIds.has(p.id))
      .slice()
      .reverse() // Đảo ngược → SP cuối mảng lên đầu
      .slice(0, FEATURED_COUNT - featured.length);

    const combined = [...featured, ...remaining];

    if (combined.length >= FEATURED_COUNT) {
      return combined.slice(0, FEATURED_COUNT);
    }

    // 3. Fallback → lấy SP có badge
    const combinedIds = new Set(combined.map((p) => p.id));
    const withBadge = PRODUCTS.filter(
      (p) => p.badge && !combinedIds.has(p.id)
    ).slice(0, FEATURED_COUNT - combined.length);

    return [...combined, ...withBadge].slice(0, FEATURED_COUNT);
  };

  const featuredProducts = getFeaturedProducts();

  return (
    <section
      id="signature-collection"
      className="py-14 sm:py-20 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            Sản Phẩm Mới Nhất
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            SẢN PHẨM NỔI BẬT NHẤT
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Những mẫu đồng phục mới nhất được khách hàng doanh nghiệp lựa chọn
            nhiều nhất.
          </p>
        </div>

        {/* ============================================
            GRID 6 SẢN PHẨM
            ============================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
      </div>
    </section>
  );
}