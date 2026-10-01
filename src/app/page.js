"use client";

import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

// ============================================================
// TRANG CHỦ — 12 SECTIONS (ĐÃ BỎ NewArrivalsSection)
// ============================================================

// 1. HOOK
import HeroBanner from "@/features/home/components/HeroBanner";

// 2. TRUST
import TrustBar from "@/features/home/components/TrustBar";

// 3-4. BROWSE & SẢN PHẨM
import CategoryShowcase from "@/features/home/components/CategoryShowcase";
import FeaturedProductsSection from "@/features/home/components/FeaturedProductsSection";

// 5. CAPTURE LEAD SỚM
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

// 6-8. BUILD CASE
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import ProcessSection from "@/features/home/components/ProcessSection";

// 9. PROOF
import FeedbackSection from "@/features/home/components/FeedbackSection";

// 10. OBJECTION
import FaqSection from "@/features/home/components/FaqSection";

// 11. CONTENT
import NewsSection from "@/features/home/components/NewsSection";

// 12. CLOSE
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <ErrorBoundary name="Hero">
        <HeroBanner />
      </ErrorBoundary>

      {/* 2. ĐỐI TÁC & KHÁCH HÀNG */}
      <ErrorBoundary name="Đối tác">
        <TrustBar />
      </ErrorBoundary>

      {/* 3. DANH MỤC */}
      <ErrorBoundary name="Danh mục">
        <CategoryShowcase />
      </ErrorBoundary>

      {/* 4. SẢN PHẨM NỔI BẬT — 5 hàng, mỗi hàng 5 SP theo loại */}
      <ErrorBoundary name="Sản phẩm nổi bật">
        <FeaturedProductsSection />
      </ErrorBoundary>

      {/* 5. BÁO GIÁ NHANH */}
      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>

      {/* 6. VÌ SAO CHỌN HDC */}
      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      {/* 7. CÔNG NGHỆ SEAMLESS */}
      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      {/* 8. QUY TRÌNH */}
      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      {/* 9. FEEDBACK */}
      <ErrorBoundary name="Feedback khách hàng">
        <FeedbackSection />
      </ErrorBoundary>

      {/* 10. FAQ */}
      <ErrorBoundary name="FAQ">
        <FaqSection />
      </ErrorBoundary>

      {/* 11. BLOG */}
      <ErrorBoundary name="Tin tức">
        <NewsSection />
      </ErrorBoundary>

      {/* 12. CTA CUỐI */}
      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}