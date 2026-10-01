"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import FloatingActions from "@/shared/components/layout/FloatingActions";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import ProductDetailModal from "@/features/catalog/components/ProductDetailModal";
import LogoCustomizerModal from "@/features/customize/components/LogoCustomizerModal";
import CartDrawer from "@/features/cart/components/CartDrawer";
import CheckoutModal from "@/features/checkout/components/CheckoutModal";
import OrderTrackingModal from "@/features/tracking/components/OrderTrackingModal";
import QuickQuoteModal from "@/features/quote/components/QuickQuoteModal";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAdminPage) {
    return <>{children}</>;
  }

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ErrorBoundary name="Header">
        <Header />
      </ErrorBoundary>

      <main className="flex-1 pb-16 md:pb-0">{children}</main>

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
  );
}
