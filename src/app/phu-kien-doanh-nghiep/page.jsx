"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, PackageCheck, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function PhuKienDoanhNghiepPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="accessories" breadcrumb="Phụ Kiện Doanh Nghiệp" />

      <ErrorBoundary name="Sản phẩm Phụ Kiện">
        <ProductCatalog initialCategory="accessories" />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
