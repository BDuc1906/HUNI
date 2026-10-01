import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, CheckCircle2, ShieldCheck, Clock, Scissors } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import ProcessSection from "@/features/home/components/ProcessSection";
import TrustBar from "@/features/home/components/TrustBar";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Quy Trình May Đồng Phục Chuẩn 5 Bước | HDC FASHION",
  description:
    "Tìm hiểu quy trình đặt may đồng phục chuyên nghiệp tại HDC Fashion: Tiếp nhận tư vấn, thiết kế 3D miễn phí, may mẫu thử 0đ, sản xuất công nghiệp và bảo hành 1 đổi 1 trong 30 ngày.",
};

export default function QuyTrinhMayPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="process" breadcrumb="Quy Trình May" />

      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="Thư mời hợp tác">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
