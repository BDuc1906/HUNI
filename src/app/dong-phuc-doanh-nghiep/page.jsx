"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Briefcase, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucDoanhNghiepPage() {
  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Briefcase className="w-3.5 h-3.5" />
              Bộ sưu tập công sở &amp; polo cao cấp 2026
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              ĐỒNG PHỤC DOANH NGHIỆP <br />
              <span className="text-brand-300">CHUẨN FORM CHÂU ÂU</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Áo Polo cổ dệt bo dệt vi tính, sơ mi chống nhăn công sở, quần tây và váy chân chữ A. Nâng tầm hình ảnh chuyên nghiệp và gắn kết đội ngũ doanh nghiệp của bạn.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Thiết kế 3D nhận diện thương hiệu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Thêu logo Tajima sắc nét</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>May áo mẫu thử tận nơi 0đ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Sản phẩm Doanh Nghiệp">
        <ProductCatalog initialCategory="corporate" />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Bảng vải">
        <FabricGuideSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
