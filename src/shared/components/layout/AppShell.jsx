"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import FloatingActions from "@/shared/components/layout/FloatingActions";
import TopProgressBar from "@/shared/components/layout/TopProgressBar";
import PageTransition from "@/shared/components/layout/PageTransition";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import ProductDetailModal from "@/features/catalog/components/ProductDetailModal";
import LogoCustomizerModal from "@/features/customize/components/LogoCustomizerModal";
import CartDrawer from "@/features/cart/components/CartDrawer";
import CheckoutModal from "@/features/checkout/components/CheckoutModal";
import OrderTrackingModal from "@/features/tracking/components/OrderTrackingModal";
import QuickQuoteModal from "@/features/quote/components/QuickQuoteModal";
import HomePromoModal from "@/features/home/components/HomePromoModal";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // ============================================================
  // ADMIN SHELL — Bọc riêng với class .admin-shell
  // để scope dark-mode override (xem globals.css)
  // ============================================================
  if (isAdminPage) {
    return (
      <div className="admin-shell flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <TopProgressBar />
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopProgressBar />

      {!isAuthPage && (
        <ErrorBoundary name="Header">
          <Header />
        </ErrorBoundary>
      )}

      <main className={isAuthPage ? "min-h-screen flex-1" : "flex-1 pb-16 md:pb-0"}>
        <PageTransition>{children}</PageTransition>
      </main>

      {!isAuthPage && (
        <>
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
            <HomePromoModal />
          </ErrorBoundary>

          <FloatingActions />
        </>
      )}
    </div>
  );
}