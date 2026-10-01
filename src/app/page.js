"use client";

import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

// ============================================================
// TRANG CHỦ — 11 SECTIONS (ĐÃ BỎ TrustBar & NewArrivals)
//
// Flow logic:
//   1-3   : HOOK → BROWSE → SẢN PHẨM HOT
//   4     : CAPTURE LEAD SỚM
//   5-7   : BUILD CASE (WhyChooseUs → Seamless USP → Process)
//   8-9   : PROOF + OBJECTION (Feedback → FAQ)
//   10-11 : CONTENT + CLOSE (Blog → Final CTA)
// ============================================================

// 1. HOOK
import HeroBanner from "@/features/home/components/HeroBanner";

// 2-3. BROWSE & SẢN PHẨM
import CategoryShowcase from "@/features/home/components/CategoryShowcase";
import FeaturedProductsSection from "@/features/home/components/FeaturedProductsSection";

// 4. CAPTURE LEAD SỚM
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

// 5-7. BUILD CASE
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import ProcessSection from "@/features/home/components/ProcessSection";

// 8. PROOF
import FeedbackSection from "@/features/home/components/FeedbackSection";

// 9. OBJECTION
import FaqSection from "@/features/home/components/FaqSection";

// 10. CONTENT
import NewsSection from "@/features/home/components/NewsSection";

// 11. CLOSE
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <ErrorBoundary name="Hero">
        <HeroBanner />
      </ErrorBoundary>

      {/* 2. DANH MỤC */}
      <ErrorBoundary name="Danh mục">
        <CategoryShowcase />
      </ErrorBoundary>

      {/* 3. SẢN PHẨM NỔI BẬT — 1 hàng · 5 SP đại diện 5 loại */}
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