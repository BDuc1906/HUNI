"use client";

import React from "react";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { ShopProvider } from "@/shared/providers/ShopProvider";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import FloatingActions from "@/shared/components/layout/FloatingActions";

import HeroBanner from "@/features/home/components/HeroBanner";
import TrustBar from "@/features/home/components/TrustBar";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import TestimonialsSection from "@/features/home/components/TestimonialsSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import FaqSection from "@/features/home/components/FaqSection";
import MapSection from "@/features/home/components/MapSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

import ProductDetailModal from "@/features/catalog/components/ProductDetailModal";
import LogoCustomizerModal from "@/features/customize/components/LogoCustomizerModal";
import CartDrawer from "@/features/cart/components/CartDrawer";
import CheckoutModal from "@/features/checkout/components/CheckoutModal";
import OrderTrackingModal from "@/features/tracking/components/OrderTrackingModal";
import QuickQuoteModal from "@/features/quote/components/QuickQuoteModal";

export default function Home() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <div className="flex flex-col min-h-screen">
          <ErrorBoundary name="Header">
            <Header />
          </ErrorBoundary>

          <main className="flex-1">
            <ErrorBoundary name="Hero">
              <HeroBanner />
            </ErrorBoundary>

            <ErrorBoundary name="Trust Bar">
              <TrustBar />
            </ErrorBoundary>

            <ErrorBoundary name="Sản phẩm">
              <ProductCatalog />
            </ErrorBoundary>

            <ErrorBoundary name="Vì sao chọn HUNI">
              <WhyChooseUs />
            </ErrorBoundary>

            <ErrorBoundary name="Bảng vải">
              <FabricGuideSection />
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

            <ErrorBoundary name="Báo giá nhanh">
              <QuickQuoteSection />
            </ErrorBoundary>

            <ErrorBoundary name="FAQ">
              <FaqSection />
            </ErrorBoundary>

            {/* ✨ MỚI: Bản đồ trụ sở */}
            <ErrorBoundary name="Bản đồ">
              <MapSection />
            </ErrorBoundary>

            <ErrorBoundary name="CTA cuối">
              <FinalCtaSection />
            </ErrorBoundary>
          </main>

          <ErrorBoundary name="Footer">
            <Footer />
          </ErrorBoundary>

          <ErrorBoundary name="Modals">
            <ProductDetailModal />
            <LogoCustomizerModal />
            <CartDrawer />
            <CheckoutModal />
            <OrderTrackingModal />
            <QuickQuoteModal />
          </ErrorBoundary>

          <FloatingActions />
        </div>
      </ShopProvider>
    </ThemeProvider>
  );
}