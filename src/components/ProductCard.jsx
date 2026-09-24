"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { Star, Heart, Eye, ShoppingCart, Sparkles, Check } from "lucide-react";

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

  // Lowest wholesale tier price for teaser
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
      {/* Product Image Area */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-[#071b34] text-amber-300 font-bold text-[11px] shadow-md border border-amber-400/40">
              {product.badge}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white font-semibold text-[10px] shadow-sm">
            May mẫu 0đ
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? "bg-rose-50 text-rose-600 shadow-md"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:text-rose-500 hover:bg-white"
          }`}
          title={isFavorite ? "Đã yêu thích" : "Lưu vào yêu thích"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current text-rose-500" : ""}`} />
        </button>

        {/* Quick actions hover bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
            title="Thử mô phỏng in / thêu logo công ty lên áo"
            className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-[#071b34] text-xs font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mô Phỏng Logo</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Sold count */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
            <span className="text-[11px] text-slate-400">Đã may: {product.soldCount}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#071b34] text-sm sm:text-base leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Material Tag */}
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="truncate font-medium">{product.material}</span>
          </div>

          {/* Available Colors preview */}
          {product.colors && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-slate-400">Màu sắc:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c.code }}
                    title={c.name}
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Cart footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Giá mẫu lẻ:</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-[#071b34] text-base sm:text-lg">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {product.originalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
            <div className="text-[11px] text-amber-700 font-bold">
              Sỉ chỉ từ: {lowestPrice.toLocaleString("vi-VN")} đ/{product.unit}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 10);
            }}
            title="Thêm số lượng tiêu chuẩn (10 áo) vào giỏ hàng"
            className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-amber-500 text-amber-400 hover:text-[#071b34] flex items-center justify-center shadow-md transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
