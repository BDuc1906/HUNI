import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Award, Users, Factory } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import CulturalHeritageSection from "@/features/home/components/CulturalHeritageSection";
import TestimonialsSection from "@/features/home/components/TestimonialsSection";
import TrustBar from "@/features/home/components/TrustBar";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Giới Thiệu HDC FASHION - Phong Cách Tạo Thành Công",
  description:
    "HDC GROUP VN - Thương hiệu HDC Fashion do CEO Nguyễn Thị Thương sáng lập. Hành trình kiến tạo phong cách đồng phục chuyên nghiệp cho hơn 50.000 doanh nghiệp trên toàn quốc.",
};

export default function GioiThieuPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="about" breadcrumb="Giới Thiệu" />

      <ErrorBoundary name="Thư mời hợp tác">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Họa tiết văn hóa">
        <CulturalHeritageSection />
      </ErrorBoundary>

      <ErrorBoundary name="Đánh giá khách hàng">
        <TestimonialsSection />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
