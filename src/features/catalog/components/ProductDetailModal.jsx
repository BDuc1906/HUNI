"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Ruler,
  Palette
} from "lucide-react";

export default function ProductDetailModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    getProductTierPrice,
    setIsCustomizerOpen,
    setCustomizerProduct,
    setIsCartOpen
  } = useShop();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(20);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors?.[0]?.name || "Chuẩn");
      setSelectedSize(quickViewProduct.sizes?.[0] || "L");
      setSelectedImage(quickViewProduct.image);
      setQuantity(20);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentUnitPrice = getProductTierPrice(quickViewProduct, quantity);
  const regularTotalPrice = quickViewProduct.price * quantity;
  const currentTotalPrice = currentUnitPrice * quantity;
  const savings = Math.max(0, regularTotalPrice - currentTotalPrice);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, {
      color: selectedColor,
      size: selectedSize
    });
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleOpenCustomizer = () => {
    setCustomizerProduct(quickViewProduct);
    setIsCustomizerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors active:scale-95"
          aria-label="Đóng"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Left Column — Image Gallery */}
          <div className="md:col-span-6 bg-slate-50 p-3 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              {/* Main Image */}
              <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <Image
                  src={selectedImage || quickViewProduct.image}
                  alt={quickViewProduct.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                  priority
                />
                {quickViewProduct.badge && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#071b34] text-amber-300 font-bold text-[10px] sm:text-xs border border-amber-400/40">
                    {quickViewProduct.badge}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {quickViewProduct.gallery && quickViewProduct.gallery.length > 1 && (
                <div className="flex items-center gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1">
                  {quickViewProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 active:scale-95 ${
                        selectedImage === img
                          ? "border-amber-500 ring-2 ring-amber-500/30"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-600">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>Bảo hành 1 đổi 1 trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>Đo số đo tận nơi</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>May mẫu thử 0đ</span>
              </div>
            </div>
          </div>

          {/* Right Column — Configurator */}
          <div className="md:col-span-6 p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div>
              {/* SKU + Rating */}
              <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs">
                <span className="text-amber-700 font-bold uppercase tracking-wider">
                  SKU: {quickViewProduct.sku}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  <span className="font-bold text-slate-800 text-[11px] sm:text-sm">{quickViewProduct.rating}</span>
                  <span className="text-slate-400 hidden sm:inline">({quickViewProduct.reviewsCount})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#071b34] mt-1.5 sm:mt-2 leading-tight">
                {quickViewProduct.title}
              </h2>

              {/* Material */}
              <div className="mt-2 text-[11px] sm:text-xs text-slate-600 bg-amber-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-200 inline-block font-medium">
                Chất liệu: <strong>{quickViewProduct.material}</strong>
              </div>

              {/* Wholesale Pricing */}
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200">
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Bảng Giá Sỉ Tận Xưởng:</span>
                  <span className="text-[10px] sm:text-[11px] text-amber-700 font-semibold">ĐV: {quickViewProduct.unit}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-center">
                  {quickViewProduct.wholesaleTiers?.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs transition-colors ${
                        quantity >= tier.min && quantity <= tier.max
                          ? "bg-[#071b34] text-amber-300 font-bold shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">{tier.label}</div>
                      <div className="font-extrabold mt-0.5 text-[11px] sm:text-xs">
                        {tier.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color */}
              {quickViewProduct.colors && (
                <div className="mt-3 sm:mt-4">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700 block mb-1.5">
                    Màu: <span className="text-amber-700">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {quickViewProduct.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 border transition-all active:scale-95 ${
                          selectedColor === c.name
                            ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: c.code }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {quickViewProduct.sizes && (
                <div className="mt-3 sm:mt-4">
                  <div className="flex items-center justify-between mb-1.5 text-[11px] sm:text-xs font-bold">
                    <span className="text-slate-700">Size:</span>
                    <button
                      onClick={() => alert("HUNI hỗ trợ gửi bảng size chi tiết hoặc chuyên viên đến tận nơi đo đạc!")}
                      className="text-amber-700 hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span className="hidden sm:inline">Hướng dẫn chọn size</span>
                      <span className="sm:hidden">HDSD</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {quickViewProduct.sizes.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(s)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border active:scale-95 ${
                          selectedSize === s
                            ? "bg-[#071b34] text-amber-300 border-[#071b34]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Calculator */}
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-50/60 rounded-xl sm:rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-slate-800 block">
                      Số lượng đặt may:
                    </label>
                    <span className="text-[10px] sm:text-[11px] text-slate-500">
                      Càng nhiều — giá càng tốt!
                    </span>
                  </div>

                  <div className="flex items-center border border-slate-300 rounded-lg sm:rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(5, q - 5))}
                      className="px-2 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="5"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 sm:w-16 text-center text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 5)}
                      className="px-2 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] sm:text-xs flex-wrap gap-2">
                  <div>
                    <span className="text-slate-600">Đơn giá: </span>
                    <strong className="text-amber-800 text-xs sm:text-sm font-black">
                      {currentUnitPrice.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-600">Tổng: </span>
                    <strong className="text-[#071b34] text-sm sm:text-base font-black">
                      {currentTotalPrice.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="mt-1 text-right text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                    ✓ Tiết kiệm {savings.toLocaleString("vi-VN")} đ!
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 sm:space-y-2.5 pt-2">
              <button
                onClick={handleOpenCustomizer}
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-[11px] sm:text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                <span className="hidden sm:inline">Mô Phỏng In / Thêu Logo Công Ty (Miễn Phí)</span>
                <span className="sm:hidden">Mô phỏng logo (Free)</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm Vào Giỏ ({quantity} {quickViewProduct.unit})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}