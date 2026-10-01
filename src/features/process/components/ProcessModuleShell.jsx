"use client";

import ErrorBoundary from "@/shared/components/ErrorBoundary";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import FloatingActions from "@/shared/components/layout/FloatingActions";
import ProductDetailModal from "@/features/catalog/components/ProductDetailModal";
import LogoCustomizerModal from "@/features/customize/components/LogoCustomizerModal";
import CartDrawer from "@/features/cart/components/CartDrawer";
import CheckoutModal from "@/features/checkout/components/CheckoutModal";
import OrderTrackingModal from "@/features/tracking/components/OrderTrackingModal";
import QuickQuoteModal from "@/features/quote/components/QuickQuoteModal";

/** Shared page chrome for the four process-module routes. */
export default function ProcessModuleShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8ff]">
      <ErrorBoundary name="Header">
        <Header />
      </ErrorBoundary>

      <main className="flex-1">{children}</main>

      <ErrorBoundary name="Footer">
        <Footer />
      </ErrorBoundary>

      <ErrorBoundary name="Module interactions">
        <ProductDetailModal />
        <LogoCustomizerModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
        <QuickQuoteModal />
      </ErrorBoundary>

      <FloatingActions />
    </div>
  );
}
