"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/shared/providers/ShopProvider";
import { Star, Heart, Eye, ShoppingCart, Sparkles } from "lucide-react";

export default function ProductCard({ product }) {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    setIsCustomizerOpen,
    setCustomizerProduct
  } = useShop();

  const isFavorite = wishlist.includes(product.id);

  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const nextTier =
    product.wholesaleTiers && product.wholesaleTiers.length >= 2
      ? product.wholesaleTiers[1]
      : null;

  const lowestPrice = product.wholesaleTiers?.length
    ? product.wholesaleTiers[product.wholesaleTiers.length - 1].price
    : product.price;

  const handleOpenCustomizer = (e) => {
    e.stopPropagation();
    setCustomizerProduct(product);
    setIsCustomizerOpen(true);
  };

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-400/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      <div className="relative aspect-[4/5] sm:aspect-auto sm:h-60 md:h-64 lg:h-72 w-full overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 items-start max-w-[68%] pointer-events-none z-10">
          {product.badge && (
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#004f5e] text-brand-300 font-bold text-[9px] sm:text-[11px] shadow-md border border-brand-400/40">
              {product.badge}
            </span>
          )}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="px-1.5 py-0.5 rounded-full bg-brand-600/90 text-white font-semibold text-[8px] sm:text-[10px] shadow-sm">
              May mẫu 0đ
            </span>
            {discountPct > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[8px] sm:text-[10px] shadow-sm">
                -{discountPct}%
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorite
              ? "bg-rose-50 text-rose-600 shadow-md"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:text-rose-500 hover:bg-white"
          }`}
          title={isFavorite ? "Đã yêu thích" : "Lưu vào yêu thích"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? "fill-current text-rose-500" : ""}`} />
        </button>

        <div className="hidden md:flex absolute bottom-3 left-3 right-3 items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-md hover:bg-[#004f5e] hover:text-white text-slate-800 text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-brand-500" />
            <span>Xem Chi Tiết</span>
          </button>

          <button
            onClick={handleOpenCustomizer}
            title="Mô phỏng logo"
            className="py-2 px-3 bg-brand-500 hover:bg-brand-400 text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
              {product.sku}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Chính hãng HDC
            </span>
          </div>

          <h3 className="font-bold text-[#004f5e] text-xs sm:text-sm md:text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2 min-h-[2.4em]">
            {product.title}
          </h3>

          <div className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
            <span className="truncate font-medium">{product.material}</span>
          </div>

          {product.colors && (
            <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
              <span className="text-[9px] sm:text-[11px] text-slate-400">Màu:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 5).map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c.code }}
                    title={c.name}
                    className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300 shadow-xs"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-end justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">Giá mẫu lẻ:</div>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-extrabold text-[#004f5e] text-xs sm:text-base md:text-lg">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              {product.originalPrice && (
                <span className="text-[9px] sm:text-xs text-slate-400 line-through">
                  {product.originalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
            <div className="text-[9px] sm:text-[11px] text-brand-700 font-bold mt-0.5 truncate">
              Sỉ: {lowestPrice.toLocaleString("vi-VN")} đ/{product.unit}
            </div>
            {nextTier && (
              <div className="text-[9px] sm:text-[10px] text-emerald-600 font-medium mt-0.5 truncate">
                🏷️ Đặt từ {nextTier.min} chiếc → {nextTier.price.toLocaleString("vi-VN")}đ
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            title="Xem & Đặt hàng"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 hover:bg-brand-500 text-brand-400 hover:text-[#004f5e] flex items-center justify-center shadow-md transition-colors shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Mobile action buttons */}
        <div className="flex md:hidden items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-1.5 px-2 bg-slate-100 active:bg-[#004f5e] active:text-white text-slate-800 text-[11px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3 h-3 text-brand-500 shrink-0" />
            <span className="truncate">Chi tiết</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCustomizer}
            title="Mô phỏng logo"
            className="py-1.5 px-2 bg-brand-500 active:bg-brand-600 text-white text-[11px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span>Logo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
