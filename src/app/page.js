"use client";

import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

// ============================================================
// TRANG CHỦ — 13 SECTIONS (THỨ TỰ TỐI ƯU CHO B2B CONVERSION)
//
// Flow logic:
//   1-5   : HOOK → TRUST → BROWSE → SẢN PHẨM HOT/MỚI
//   6     : CAPTURE LEAD SỚM (QuickQuote sau khi khách thấy SP)
//   7-9   : BUILD CASE (WhyChooseUs → Seamless USP → Process)
//   10-11 : PROOF + OBJECTION (Feedback → FAQ)
//   12-13 : CONTENT + CLOSE (Blog → Final CTA)
// ============================================================

// 1. HOOK
import HeroBanner from "@/features/home/components/HeroBanner";

// 2. TRUST
import TrustBar from "@/features/home/components/TrustBar";

// 3-5. BROWSE & SẢN PHẨM
import CategoryShowcase from "@/features/home/components/CategoryShowcase";
import FeaturedProductsSection from "@/features/home/components/FeaturedProductsSection";
import NewArrivalsSection from "@/features/home/components/NewArrivalsSection";

// 6. CAPTURE LEAD SỚM
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

// 7-9. BUILD CASE
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import ProcessSection from "@/features/home/components/ProcessSection";

// 10. PROOF (tự ẩn khi rỗng)
import FeedbackSection from "@/features/home/components/FeedbackSection";

// 11. OBJECTION HANDLING
import FaqSection from "@/features/home/components/FaqSection";

// 12. CONTENT HUB
import NewsSection from "@/features/home/components/NewsSection";

// 13. CLOSE
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export default function Home() {
  return (
    <>
      {/* ─────────────────────────────────────────────
          CỤM 1: HOOK → TRUST → BROWSE
          ───────────────────────────────────────────── */}

      {/* 1. HERO — Hook ban đầu + CTA chính */}
      <ErrorBoundary name="Hero">
        <HeroBanner />
      </ErrorBoundary>

      {/* 2. ĐỐI TÁC & KHÁCH HÀNG — Uy tín ngay lập tức */}
      <ErrorBoundary name="Đối tác">
        <TrustBar />
      </ErrorBoundary>

      {/* 3. DANH MỤC — Định hướng vào luồng sản phẩm */}
      <ErrorBoundary name="Danh mục">
        <CategoryShowcase />
      </ErrorBoundary>

      {/* ─────────────────────────────────────────────
          CỤM 2: SẢN PHẨM HOT/MỚI → CAPTURE LEAD
          ───────────────────────────────────────────── */}

      {/* 4. SẢN PHẨM BÁN CHẠY */}
      <ErrorBoundary name="Sản phẩm nổi bật">
        <FeaturedProductsSection />
      </ErrorBoundary>

      {/* 5. SẢN PHẨM MỚI NHẤT */}
      <ErrorBoundary name="Sản phẩm mới">
        <NewArrivalsSection />
      </ErrorBoundary>

      {/* 6. BÁO GIÁ NHANH — Hứng tệp "mua nhanh" + B2B */}
      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>

      {/* ─────────────────────────────────────────────
          CỤM 3: BUILD CASE — NĂNG LỰC & USP
          ───────────────────────────────────────────── */}

      {/* 7. VÌ SAO CHỌN HDC — Năng lực & cam kết */}
      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      {/* 8. CÔNG NGHỆ SEAMLESS — USP chứng minh năng lực */}
      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      {/* 9. QUY TRÌNH 5 BƯỚC — Bảo chứng chuyên nghiệp */}
      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      {/* ─────────────────────────────────────────────
          CỤM 4: PROOF + OBJECTION
          ───────────────────────────────────────────── */}

      {/* 10. FEEDBACK — Tự ẩn khi chưa có data */}
      <ErrorBoundary name="Feedback khách hàng">
        <FeedbackSection />
      </ErrorBoundary>

      {/* 11. FAQ — Giải đáp thắc mắc mua hàng nhanh */}
      <ErrorBoundary name="FAQ">
        <FaqSection />
      </ErrorBoundary>

      {/* ─────────────────────────────────────────────
          CỤM 5: CONTENT + CLOSE
          ───────────────────────────────────────────── */}

      {/* 12. BLOG — Giá trị cộng thêm, tốt cho SEO */}
      <ErrorBoundary name="Tin tức">
        <NewsSection />
      </ErrorBoundary>

      {/* 13. CTA CUỐI — Chốt hạ */}
      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}