"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import GolfSection from "@/features/home/components/GolfSection";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucTheThaoPage() {
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
            <span className="text-white font-semibold">Đồng Phục Thể Thao &amp; Golf</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Activity className="w-3.5 h-3.5" />
              Công nghệ làm mát AeroCool &amp; Chống UV UPF 50+
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              ĐỒNG PHỤC THỂ THAO, <br />
              <span className="text-brand-300">GOLF &amp; PICKLEBALL CAO CẤP</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Thiết kế chuyên biệt cho các giải đấu Golf danh giá, câu lạc bộ Pickleball, giải chạy Marathon và hoạt động Team building năng động của tập đoàn.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Hạ nhiệt cơ thể 3°C với sợi làm mát</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Co giãn 4 chiều cho swing chuẩn xác</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>In chuyển nhiệt 3D không bong tróc</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Bộ sưu tập Golf">
        <GolfSection />
      </ErrorBoundary>

      <ErrorBoundary name="Sản phẩm Thể Thao">
        <ProductCatalog initialCategory="sport_golf" />
      </ErrorBoundary>

      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
