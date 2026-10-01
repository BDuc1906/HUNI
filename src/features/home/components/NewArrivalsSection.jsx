"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import { Sparkles, ArrowRight, Zap, Package } from "lucide-react";

// ============================================================
// NEW ARRIVALS — Sản phẩm MỚI NHẤT
//
// 🎯 CÁCH HOẠT ĐỘNG:
//   - CHỈ hiện SP có flag `isNewArrival: true` trong products.js
//   - KHÔNG fallback lấy SP cuối mảng
//   - Chưa có flag → hiện placeholder "Đang cập nhật"
//
// 📝 CÁCH ĐÁNH DẤU SP MỚI:
//   → Mở src/shared/data/products.js
//   → Thêm vào SP: isNewArrival: true
//
// 📐 LAYOUT: 4 sản phẩm / 1 hàng trên desktop (không xuống dòng)
// ============================================================

const NEW_ARRIVALS_COUNT = 4;

export default function NewArrivalsSection() {
  // ============================================================
  // CHỈ LẤY SP CÓ FLAG isNewArrival: true
  // KHÔNG fallback lấy cuối mảng
  // ============================================================
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival === true).slice(
    0,
    NEW_ARRIVALS_COUNT
  );

  const hasData = newArrivals.length > 0;

  return (
    <section
      id="new-arrivals-section"
      className="py-14 sm:py-20 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* HEADER — LUÔN HIỆN */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
            Sản Phẩm Mới Về
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            SẢN PHẨM MỚI NHẤT
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Những mẫu đồng phục vừa ra mắt — cập nhật xu hướng thiết kế và chất
            liệu mới nhất 2026.
          </p>
        </div>

        {/* NỘI DUNG */}
        {hasData ? (
          <>
            {/* GRID 4 SẢN PHẨM — 1 HÀNG TRÊN DESKTOP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 sm:mt-12 text-center">
              <Link
                href="/dong-phuc-doanh-nghiep"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transform hover:-translate-y-1 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Xem Tất Cả Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </>
        ) : (
          /* PLACEHOLDER — Chưa có flag isNewArrival */
          <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#004f5e] mb-2">
              Danh Sách Đang Được Cập Nhật
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-5">
              HDC đang cập nhật các mẫu đồng phục mới nhất. Vui lòng quay lại
              sau hoặc xem toàn bộ sản phẩm ngay bây giờ.
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