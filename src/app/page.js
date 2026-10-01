"use client";

import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

// ============================================================
// TRANG CHỦ — KHÔNG CÓ TrustBar (đã bỏ)
// TrustBar vẫn dùng ở các trang khác:
//   - /gioi-thieu
//   - /dong-phuc-truong-hoc
//   - /bang-vai
//   - /quy-trinh-may
// ============================================================

import HeroBanner from "@/features/home/components/HeroBanner";
import CategoryShowcase from "@/features/home/components/CategoryShowcase";
import FeaturedProductsSection from "@/features/home/components/FeaturedProductsSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import FeedbackSection from "@/features/home/components/FeedbackSection";
import FaqSection from "@/features/home/components/FaqSection";
import NewsSection from "@/features/home/components/NewsSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

// ❌ KHÔNG import TrustBar nữa

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <ErrorBoundary name="Hero">
        <HeroBanner />
      </ErrorBoundary>

      {/* ❌ TrustBar — ĐÃ BỎ KHỎI TRANG CHỦ */}

      {/* 2. DANH MỤC */}
      <ErrorBoundary name="Danh mục">
        <CategoryShowcase />
      </ErrorBoundary>

      {/* 3. SẢN PHẨM NỔI BẬT */}
      <ErrorBoundary name="Sản phẩm nổi bật">
        <FeaturedProductsSection />
      </ErrorBoundary>

      {/* 4. BÁO GIÁ NHANH */}
      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>

      {/* 5. VÌ SAO CHỌN HDC */}
      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      {/* 6. CÔNG NGHỆ SEAMLESS */}
      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      {/* 7. QUY TRÌNH */}
      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      {/* 8. FEEDBACK */}
      <ErrorBoundary name="Feedback khách hàng">
        <FeedbackSection />
      </ErrorBoundary>

      {/* 9. FAQ */}
      <ErrorBoundary name="FAQ">
        <FaqSection />
      </ErrorBoundary>

      {/* 10. BLOG */}
      <ErrorBoundary name="Tin tức">
        <NewsSection />
      </ErrorBoundary>

      {/* 11. CTA CUỐI */}
      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}