"use client";

import React from "react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import HeroBanner from "@/features/home/components/HeroBanner";
import TrustBar from "@/features/home/components/TrustBar";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import CulturalHeritageSection from "@/features/home/components/CulturalHeritageSection";
import KidsSection from "@/features/home/components/KidsSection";
import GolfSection from "@/features/home/components/GolfSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import TestimonialsSection from "@/features/home/components/TestimonialsSection";
import GallerySection from "@/features/home/components/GallerySection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import FaqSection from "@/features/home/components/FaqSection";
import MapSection from "@/features/home/components/MapSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export default function Home() {
  return (
    <>
      <ErrorBoundary name="Hero">
        <HeroBanner />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="Sản phẩm">
        <ProductCatalog isHome={true} />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Bảng vải">
        <FabricGuideSection />
      </ErrorBoundary>

      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      <ErrorBoundary name="Hóa tiết văn hóa">
        <CulturalHeritageSection />
      </ErrorBoundary>

      <ErrorBoundary name="Đồng phục Kids">
        <KidsSection />
      </ErrorBoundary>

      <ErrorBoundary name="Đồng phục Golf">
        <GolfSection />
      </ErrorBoundary>

      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      <ErrorBoundary name="Thư mời hợp tác">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="Đánh giá khách hàng">
        <TestimonialsSection />
      </ErrorBoundary>

      <ErrorBoundary name="Hình ảnh thực tế">
        <GallerySection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>

      <ErrorBoundary name="FAQ">
        <FaqSection />
      </ErrorBoundary>

      <ErrorBoundary name="Bản đồ">
        <MapSection />
      </ErrorBoundary>

      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
