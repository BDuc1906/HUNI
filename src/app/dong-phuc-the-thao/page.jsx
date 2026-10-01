"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import PageHeroSlider from "@/shared/components/PageHeroSlider";
import GolfSection from "@/features/home/components/GolfSection";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";

export default function DongPhucTheThaoPage() {
  return (
    <>
      {/* Top Image Slider — Giống slidebar trang chủ */}
      <PageHeroSlider category="sport_golf" breadcrumb="Đồng Phục Thể Thao & Golf" />

      <ErrorBoundary name="Bộ sưu tập Golf">
        <GolfSection />
      </ErrorBoundary>

      <ErrorBoundary name="Sản phẩm Thể Thao">
        <ProductCatalog initialCategory="sport_golf" />
      </ErrorBoundary>

      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>
    </>
  );
}
