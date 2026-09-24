"use client";

import React, { useState } from "react";
import { ShopProvider } from "@/context/ShopContext";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryShowcase from "@/components/CategoryShowcase";
import ProductCatalog from "@/components/ProductCatalog";
import CeoLetterSection from "@/components/CeoLetterSection";
import FabricGuideSection from "@/components/FabricGuideSection";
import ProcessSection from "@/components/ProcessSection";
import QuickQuoteSection from "@/components/QuickQuoteSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

// Modals & Interactive Drawers
import ProductDetailModal from "@/components/ProductDetailModal";
import LogoCustomizerModal from "@/components/LogoCustomizerModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import OrderTrackingModal from "@/components/OrderTrackingModal";
import QuickQuoteModal from "@/components/QuickQuoteModal";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <ShopProvider>
      <div className="flex flex-col min-h-screen">
        {/* Navigation & Header */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 1. Hero Showcase */}
          <HeroBanner />

          {/* 2. 5 Main Categories Showcase */}
          <CategoryShowcase onSelectCategory={(catId) => setActiveCategory(catId)} />

          {/* 3. Product Catalog with Wholesale Pricing & Filters */}
          <ProductCatalog
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* 4. Letter of Partnership from CEO Nguyen Thi Thuong (Image 1 & 3) */}
          <CeoLetterSection />

          {/* 5. Fabric Quality Comparison Table */}
          <FabricGuideSection />

          {/* 6. 5-Step Manufacturing Process */}
          <ProcessSection />

          {/* 7. Quick Cost Estimator Form */}
          <QuickQuoteSection />

          {/* 8. Client Testimonials & Enterprise Trust Logos */}
          <TestimonialsSection />

          {/* 9. Frequently Asked Questions (FAQ) */}
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
  );
}
