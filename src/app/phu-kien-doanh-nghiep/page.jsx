"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, PackageCheck, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function PhuKienDoanhNghiepPage() {
  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-semibold">Phụ Kiện Doanh Nghiệp</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <PackageCheck className="w-3.5 h-3.5" />
              Bộ nhận diện phụ kiện &amp; quà tặng thương hiệu
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              PHỤ KIỆN DOANH NGHIỆP{" "}
              <span className="text-brand-300">&amp; QUÀ TẶNG CAO CẤP</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Mũ lưỡi trai thêu logo 3D, nón bucket sự kiện, cặp da công sở, túi canvas quà tặng và cà vạt dệt jacquard cao cấp tạo nên sự đồng bộ hoàn hảo cho thương hiệu.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Thêu 3D nổi và in nổi công nghệ cao</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Thiết kế theo chuẩn Brand Guideline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Nhận đơn hàng số lượng linh hoạt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Sản phẩm Phụ Kiện">
        <ProductCatalog initialCategory="accessories" />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
