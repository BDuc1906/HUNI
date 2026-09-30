"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import KidsSection from "@/features/home/components/KidsSection";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import TrustBar from "@/features/home/components/TrustBar";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucTruongHocPage() {
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
            <span className="text-white font-semibold">Đồng Phục Trường Học</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              Tiêu chuẩn học đường quốc tế &amp; thân thiện làn da
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              ĐỒNG PHỤC HỌC SINH, <br />
              <span className="text-brand-300">SINH VIÊN &amp; GIÁO VIÊN</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Chuẩn phom dáng thanh lịch, trang nhã. Chất liệu vải mềm mại, thấm hút mồ hôi tối đa, giúp các em học sinh tự tin học tập và vui chơi suốt cả ngày dài.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Vải đạt chứng nhận Oeko-Tex an toàn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Váy có quần bảo hộ an toàn tiện lợi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Huy hiệu thêu Tajima sắc nét</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Bộ sưu tập Kids">
        <KidsSection />
      </ErrorBoundary>

      <ErrorBoundary name="Sản phẩm Trường Học">
        <ProductCatalog initialCategory="school" />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
