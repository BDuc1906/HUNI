"use client";

import React from "react";
import Image from "next/image";
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
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      <div className="relative h-52 sm:h-64 md:h-72 w-full overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#071b34] text-amber-300 font-bold text-[10px] sm:text-[11px] shadow-md border border-amber-400/40">
              {product.badge}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-amber-600/90 text-white font-semibold text-[9px] sm:text-[10px] shadow-sm">
            May mẫu 0đ
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
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
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-md hover:bg-[#071b34] hover:text-white text-slate-800 text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Xem Chi Tiết</span>
          </button>

          <button
            onClick={handleOpenCustomizer}
            title="Mô phỏng logo"
            className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-[#071b34] text-xs font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{product.rating}</span>
              <span className="text-slate-400 text-[10px] sm:text-xs">({product.reviewsCount})</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:inline">
              Đã may: {product.soldCount}
            </span>
          </div>

          <h3 className="font-bold text-[#071b34] text-[13px] sm:text-sm md:text-base leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
            {product.title}
          </h3>

          <div className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate font-medium">{product.material}</span>
          </div>

          {product.colors && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] sm:text-[11px] text-slate-400">Màu:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 5).map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c.code }}
                    title={c.name}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300 shadow-xs"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">Giá mẫu lẻ:</div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-extrabold text-[#071b34] text-sm sm:text-base md:text-lg">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {product.originalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-700 font-bold mt-0.5 truncate">
              Sỉ: {lowestPrice.toLocaleString("vi-VN")} đ/{product.unit}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 10);
            }}
            title="Thêm vào giỏ"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 hover:bg-amber-500 text-amber-400 hover:text-[#071b34] flex items-center justify-center shadow-md transition-colors shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}