"use client";

// ==================================================
// src/features/catalog/components/ProductDetailOrderCTA.jsx
// Nút hành động đặt hàng & tương tác cho trang sản phẩm riêng
// ==================================================

import React from "react";
import { useShop } from "@/shared/providers/ShopProvider";
import { ShoppingBag, Sparkles, MessageSquareShare, Palette } from "lucide-react";

export default function ProductDetailOrderCTA({ product }) {
  const {
    setQuickViewProduct,
    setIsCustomizerOpen,
    setCustomizerProduct,
    setIsQuoteOpen,
    setIsQuickQuoteOpen,
  } = useShop();

  const handleOpenOrder = () => {
    if (setQuickViewProduct) {
      setQuickViewProduct(product);
    }
  };

  const handleOpenQuote = () => {
    if (setIsQuoteOpen) {
      setIsQuoteOpen(true);
    } else if (setIsQuickQuoteOpen) {
      setIsQuickQuoteOpen(true);
    }
  };

  const handleOpenCustomizer = () => {
    if (setCustomizerProduct && setIsCustomizerOpen) {
      setCustomizerProduct(product);
      setIsCustomizerOpen(true);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Nút Đặt hàng ngay (Mở QuickView với pre-selected product) */}
        <button
          onClick={handleOpenOrder}
          type="button"
          className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Đặt hàng & Xem giá sỉ</span>
        </button>

        {/* Nút Báo giá B2B */}
        <button
          onClick={handleOpenQuote}
          type="button"
          className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-[#071b34] hover:bg-[#0c2a50] text-amber-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 border border-amber-400/20 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageSquareShare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
          <span>Yêu cầu báo giá B2B</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 pt-1 text-xs text-slate-500">
        <button
          onClick={handleOpenCustomizer}
          type="button"
          className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-semibold hover:underline"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tùy biến thêu logo 3D lên áo</span>
        </button>
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Miễn phí thiết kế mẫu 3D
        </span>
      </div>
    </div>
  );
}
