"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Crown, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucMayDoPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="bespoke_suit" breadcrumb="Đồng Phục May Đo" />

      <ErrorBoundary name="Sản phẩm May Đo">
        <ProductCatalog initialCategory="bespoke_suit" />
      </ErrorBoundary>

      <ErrorBoundary name="Quy trình 5 bước">
        <ProcessSection />
      </ErrorBoundary>

      <ErrorBoundary name="Thư CEO">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
