"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import {
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Ruler,
  PhoneCall,
  ChevronRight,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              {/* Main Preview Image */}
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={selectedImage || quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover object-top"
                />
                {quickViewProduct.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#071b34] text-amber-300 font-bold text-xs border border-amber-400/40">
                    {quickViewProduct.badge}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {quickViewProduct.gallery && quickViewProduct.gallery.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                  {quickViewProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? "border-amber-500 ring-2 ring-amber-500/30"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guarantees Box */}
            <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo hành 1 đổi 1 trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hỗ trợ đo số đo tận nơi</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>May áo mẫu thử 0 đồng</span>
              </div>
            </div>
          </div>

          {/* Right Column: Configurator & Order Options */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-amber-700 font-bold uppercase tracking-wider">
                  Mã SKU: {quickViewProduct.sku}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-slate-800">{quickViewProduct.rating}</span>
                  <span className="text-slate-400">({quickViewProduct.reviewsCount} đánh giá)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-[#071b34] mt-2">
                {quickViewProduct.title}
              </h2>

              {/* Material */}
              <div className="mt-2 text-xs text-slate-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block font-medium">
                Chất liệu: <strong>{quickViewProduct.material}</strong>
              </div>

              {/* Wholesale Pricing Table */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Bảng Giá Sỉ Tận Xưởng:</span>
                  <span className="text-[11px] text-amber-700 font-semibold">Đơn vị: {quickViewProduct.unit}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                  {quickViewProduct.wholesaleTiers?.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-xs transition-colors ${
                        quantity >= tier.min && quantity <= tier.max
                          ? "bg-[#071b34] text-amber-300 font-bold shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 truncate">{tier.label}</div>
                      <div className="font-extrabold mt-0.5">
                        {tier.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              {quickViewProduct.colors && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Màu sắc đã chọn: <span className="text-amber-700">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                          selectedColor === c.name
                            ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: c.code }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {quickViewProduct.sizes && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5 text-xs font-bold">
                    <span className="text-slate-700">Kích thước (Size):</span>
                    <button
                      onClick={() => alert("HUNI hỗ trợ gửi bảng size chi tiết hoặc chuyên viên đến tận nơi đo đạc!")}
                      className="text-amber-700 hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Hướng dẫn chọn size</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
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

              {/* Quantity input & Real-time Calculator */}
              <div className="mt-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Số lượng đặt may dự kiến:
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Càng may nhiều - giá sỉ càng tốt!
                    </span>
                  </div>

                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(5, q - 5))}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="5"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center text-sm font-extrabold text-slate-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 5)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Live Calculated Subtotal */}
                <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600">Đơn giá áp dụng: </span>
                    <strong className="text-amber-800 text-sm font-black">
                      {currentUnitPrice.toLocaleString("vi-VN")} đ
                    </strong>
                    <span className="text-slate-500">/{quickViewProduct.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Tổng tạm tính: </span>
                    <strong className="text-[#071b34] text-base font-black">
                      {currentTotalPrice.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="mt-1 text-right text-[11px] text-emerald-700 font-semibold">
                    ✓ Tiết kiệm {savings.toLocaleString("vi-VN")} đ so với giá lẻ!
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleOpenCustomizer}
                className="w-full py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Palette className="w-4 h-4 text-amber-700" />
                <span>Mô Phỏng In / Thêu Logo Công Ty Lên Áo (Miễn Phí)</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#071b34] hover:bg-slate-800 text-amber-300 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng ({quantity} {quickViewProduct.unit})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
