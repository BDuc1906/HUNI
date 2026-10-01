import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Layers, ShieldCheck, Flame, Droplets } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import TrustBar from "@/features/home/components/TrustBar";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Bảng So Sánh Chất Liệu Vải May Đồng Phục Cao Cấp | HDC FASHION",
  description:
    "Khám phá các chất liệu vải may đồng phục cao cấp tại HDC Fashion: Cotton Compact, CVC 65/35, Dry-fit thể thao, Bamboo kháng khuẩn, công nghệ ép seam không đường may.",
};

export default function BangVaiPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="fabrics" breadcrumb="Bảng Vải" />

      <ErrorBoundary name="Bảng vải">
        <FabricGuideSection />
      </ErrorBoundary>

      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
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
