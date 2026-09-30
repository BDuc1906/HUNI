"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Crown, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucMayDoPage() {
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
            <span className="text-white font-semibold">Đồng Phục May Đo</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Crown className="w-3.5 h-3.5" />
              Đẳng cấp may đo Bespoke &amp; Vest lãnh đạo
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              ĐỒNG PHỤC MAY ĐO &amp; <br />
              <span className="text-brand-300">VEST DOANH NHÂN CAO CẤP</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Được cắt may thủ công tỉ mỉ theo số đo riêng của từng nhân sự. Phom dáng chuẩn Ý, ve áo sắc sảo và chất vải len wool nhập khẩu cao cấp.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Đo ni tận nơi bởi thợ may 15 năm kinh nghiệm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Chỉnh sửa form dáng đến khi vừa vặn 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Bảo hành đường may trọn đời</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Sản phẩm May Đo">
        <ProductCatalog initialCategory="bespoke_suit" />
      </ErrorBoundary>

      <ErrorBoundary name="Quy trình 5 bước">
        <ProcessSection />
      </ErrorBoundary>

      <ErrorBoundary name="Thư CEO">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
