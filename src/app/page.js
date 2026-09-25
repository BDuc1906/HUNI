"use client";

import React from "react";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { ShopProvider } from "@/context/ShopContext";

import Header from "@/shared/components/layout/Header";
import HeroBanner from "@/features/home/components/HeroBanner";
import ProductCatalog from "@/features/catalog/components/ProductCatalog";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import ProcessSection from "@/features/home/components/ProcessSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import TestimonialsSection from "@/features/home/components/TestimonialsSection";
import FaqSection from "@/features/home/components/FaqSection";
import Footer from "@/shared/components/layout/Footer";

// Modals & Interactive Drawers
import ProductDetailModal from "@/features/catalog/components/ProductDetailModal";
import LogoCustomizerModal from "@/features/customize/components/LogoCustomizerModal";
import CartDrawer from "@/features/cart/components/CartDrawer";
import CheckoutModal from "@/features/checkout/components/CheckoutModal";
import OrderTrackingModal from "@/features/tracking/components/OrderTrackingModal";
import QuickQuoteModal from "@/features/quote/components/QuickQuoteModal";
import FloatingActions from "@/shared/components/layout/FloatingActions";

export default function Home() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <div className="flex flex-col min-h-screen">
          {/* Navigation & Header */}
          <Header />

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* 1. Hero Showcase */}
            <HeroBanner />

            {/* 2. Danh Mục & Sản Phẩm — merged into a single unified section */}
            <ProductCatalog />

            {/* 3. Letter of Partnership from CEO Nguyen Thi Thuong */}
            <CeoLetterSection />

            {/* 4. Fabric Quality Comparison Table */}
            <FabricGuideSection />

            {/* 5. 5-Step Manufacturing Process */}
            <ProcessSection />

            {/* 6. Quick Cost Estimator Form */}
            <QuickQuoteSection />

            {/* 7. Client Testimonials & Enterprise Trust Logos */}
            <TestimonialsSection />

            {/* 8. Frequently Asked Questions (FAQ) */}
            <FaqSection />
          </main>

          {/* Footer */}
          <Footer />

          {/* Interactive Modals & Drawers */}
          <ProductDetailModal />
          <LogoCustomizerModal />
          <CartDrawer />
          <CheckoutModal />
          <OrderTrackingModal />
          <QuickQuoteModal />
          <FloatingActions />
        </div>
      </ShopProvider>
    </ThemeProvider>
  );
}