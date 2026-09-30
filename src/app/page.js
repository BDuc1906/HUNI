"use client";

import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

// ============================================================
// TRANG CHỦ
// - Bỏ GallerySection (đã gộp vào TrustBar)
// ============================================================

import HeroBanner from "@/features/home/components/HeroBanner";
import TrustBar from "@/features/home/components/TrustBar";
import CategoryShowcase from "@/features/home/components/CategoryShowcase";
import SignatureCollection from "@/features/home/components/SignatureCollection";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import FeedbackSection from "@/features/home/components/FeedbackSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import NewsSection from "@/features/home/components/NewsSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import FaqSection from "@/features/home/components/FaqSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <ErrorBoundary name="Hero">
        <HeroBanner />
      </ErrorBoundary>

      {/* 2. TRUST BAR — Đối tác & Khách hàng (gộp Gallery vào) */}
      <ErrorBoundary name="Đối tác">
        <TrustBar />
      </ErrorBoundary>

      {/* 3. CATEGORY SHOWCASE */}
      <ErrorBoundary name="Danh mục">
        <CategoryShowcase />
      </ErrorBoundary>

      {/* 4. SIGNATURE COLLECTION */}
      <ErrorBoundary name="Sản phẩm nổi bật">
        <SignatureCollection />
      </ErrorBoundary>

      {/* 5. WHY CHOOSE US */}
      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      {/* 6. SEAMLESS TECH */}
      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      {/* 7. FEEDBACK KHÁCH HÀNG — ẩn khi chưa có data */}
      <ErrorBoundary name="Feedback khách hàng">
        <FeedbackSection />
      </ErrorBoundary>

      {/* 8. PROCESS */}
      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      {/* 9. TIN TỨC / BLOG */}
      <ErrorBoundary name="Tin tức">
        <NewsSection />
      </ErrorBoundary>

      {/* 10. QUICK QUOTE */}
      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>

      {/* 11. FAQ */}
      <ErrorBoundary name="FAQ">
        <FaqSection />
      </ErrorBoundary>

      {/* 12. FINAL CTA */}
      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}