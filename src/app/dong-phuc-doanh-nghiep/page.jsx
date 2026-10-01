"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Briefcase, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucDoanhNghiepPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="corporate" breadcrumb="Đồng Phục Doanh Nghiệp" />

      <ErrorBoundary name="Sản phẩm Doanh Nghiệp">
        <ProductCatalog initialCategory="corporate" />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Bảng vải">
        <FabricGuideSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
