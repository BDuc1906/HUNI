"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import KidsSection from "@/features/home/components/KidsSection";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import TrustBar from "@/features/home/components/TrustBar";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucTruongHocPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="school" breadcrumb="Đồng Phục Trường Học" />

      <ErrorBoundary name="Bộ sưu tập Kids">
        <KidsSection />
      </ErrorBoundary>

      <ErrorBoundary name="Sản phẩm Trường Học">
        <ProductCatalog initialCategory="school" />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
