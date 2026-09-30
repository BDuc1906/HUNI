"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO, CATEGORIES } from "@/shared/data";
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Ruler,
  Palette,
  Phone,
  Zap,
  CheckCircle2,
  TrendingUp,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Share2
} from "lucide-react";

const ReviewSection = lazy(() => import("./ReviewSection"));

export default function ProductDetailModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    getProductTierPrice,
    setIsCustomizerOpen,
    setCustomizerProduct,
    setIsCartOpen,
    showToast,
    triggerConfetti,
    setActiveCategory,
    setIsQuoteOpen,
    setIsQuickQuoteOpen
  } = useShop();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(20);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [openTab, setOpenTab] = useState(null);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors?.[0]?.name || "Chuẩn");
      setSelectedSize(quickViewProduct.sizes?.[0] || "L");
      setSelectedImage(quickViewProduct.image);
      setImageIndex(0);
      setQuantity(20);
      setOpenTab(null);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const currentUnitPrice = getProductTierPrice(product, quantity);
  const regularTotalPrice = product.price * quantity;
  const currentTotalPrice = currentUnitPrice * quantity;
  const savings = Math.max(0, regularTotalPrice - currentTotalPrice);

  const nextTier = product.wholesaleTiers?.find(
    (tier) => quantity < tier.min
  );

  const catName =
    CATEGORIES.find((c) => c.id === product.category)?.name ||
    product.category;

  const shortMaterial = (() => {
    const m = product.material || "";
    return m.length > 55 ? m.slice(0, 55) + "..." : m;
  })();

  // ==================================================
  // Handlers
  // ==================================================
  const handleBuyNow = () => {
    addToCart(product, quantity, {
      color: selectedColor,
      size: selectedSize,
    });
    setQuickViewProduct(null);
    setIsCartOpen(true);
    triggerConfetti();
  };

  const handleOpenCustomizer = () => {
    setCustomizerProduct(product);
    setIsCustomizerOpen(true);
  };

  const handlePrevImage = () => {
    const newIdx = imageIndex === 0 ? gallery.length - 1 : imageIndex - 1;
    setImageIndex(newIdx);
    setSelectedImage(gallery[newIdx]);
  };

  const handleNextImage = () => {
    const newIdx = imageIndex === gallery.length - 1 ? 0 : imageIndex + 1;
    setImageIndex(newIdx);
    setSelectedImage(gallery[newIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* ============================================================
          Modal container
          ============================================================ */}
      <div className="relative w-full sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border border-slate-200 max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* ============================================================
            NÚT X ĐÓNG — chỉ icon, không nền, nằm trong khung
            ============================================================ */}

        {/* Desktop — chỉ icon X, hover hồng */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Đóng"
          className="hidden sm:flex absolute top-3 right-3 z-30 w-8 h-8 items-center justify-center text-slate-400 hover:text-rose-500 active:scale-95 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Mobile — X có nền mờ (vì nằm trên ảnh) */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Đóng"
          className="sm:hidden absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center text-white hover:text-rose-300 bg-black/40 backdrop-blur-md rounded-full transition-colors active:scale-95"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* ============================================================
            BODY
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* =========================================================
              CỘT TRÁI — Gallery
              ========================================================= */}
          <div className="md:col-span-5 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
            <div className="p-3 sm:p-5 flex-1 flex flex-col">
              {/* Ảnh chính — giới hạn chiều cao, không stretch */}
              <div className="relative w-full aspect-square sm:aspect-[4/5] max-h-[280px] sm:max-h-[420px] rounded-2xl overflow-hidden bg-white shadow-inner border border-slate-200 mx-auto">
                <Image
                  src={selectedImage || product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  quality={90}
                  className="object-contain object-center"
                  priority
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#071b34] text-amber-300 font-bold text-[10px] sm:text-[11px] border border-amber-400/40 shadow-lg">
                    {product.badge}
                  </div>
                )}

                {/* Nav ảnh */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      aria-label="Ảnh trước"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#071b34] flex items-center justify-center shadow-lg active:scale-95 transition-all border border-slate-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      aria-label="Ảnh sau"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#071b34] flex items-center justify-center shadow-lg active:scale-95 transition-all border border-slate-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {imageIndex + 1} / {gallery.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 shrink-0 justify-center">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(img);
                        setImageIndex(idx);
                      }}
                      aria-label={`Xem ảnh ${idx + 1}`}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 active:scale-95 ${
                        selectedImage === img
                          ? "border-amber-500 ring-2 ring-amber-500/30"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="56px"
                        quality={80}
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges — 2x2 grid gọn */}
              <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px] sm:text-[11px]">
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-slate-700 font-semibold leading-tight">
                    Bảo hành 30 ngày
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-slate-200">
                  <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-slate-700 font-semibold leading-tight">
                    Giao toàn quốc
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-slate-200">
                  <Ruler className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-slate-700 font-semibold leading-tight">
                    Đo tận nơi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-slate-700 font-semibold leading-tight">
                    May mẫu 0đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              CỘT PHẢI — Info + Config
              ========================================================= */}
          <div className="md:col-span-7 flex flex-col bg-white">
            {/* Padding-top lớn để chừa chỗ cho nút X */}
            <div className="pt-12 sm:pt-14 px-4 sm:px-5 pb-4 sm:pb-5 flex-1 overflow-y-auto space-y-3.5 sm:space-y-4">
              {/* Mini Breadcrumb */}
              <nav className="text-[10px] text-slate-400 flex items-center gap-1 flex-wrap mb-1">
                <span>Sản phẩm</span>
                <span>›</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(product.category);
                    setQuickViewProduct(null);
                  }}
                  className="hover:text-brand-600 transition-colors font-medium"
                >
                  {catName}
                </button>
                <span>›</span>
                <span className="text-slate-600 line-clamp-1">{product.title}</span>
              </nav>

              {/* Row 1: SKU + Brand authenticity */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
                <span className="text-amber-700 font-bold uppercase tracking-wider">
                  SKU: {product.sku}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chính hãng HDC • May đo chuẩn phom</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg md:text-xl font-black text-[#071b34] leading-tight">
                {product.title}
              </h2>

              {/* Chất liệu */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600 bg-amber-50/70 px-3 py-2 rounded-xl border border-amber-200">
                <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-medium truncate">
                  <span className="text-slate-500">Chất liệu:</span>{" "}
                  <strong className="text-[#071b34]">{shortMaterial}</strong>
                </span>
              </div>

              {/* Bảng giá sỉ */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-700">
                    Bảng Giá Sỉ Tận Xưởng:
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold whitespace-nowrap">
                    ĐV: {product.unit}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                  {product.wholesaleTiers?.map((tier, idx) => {
                    const active =
                      quantity >= tier.min && quantity <= tier.max;
                    const shortLabel =
                      tier.max >= 9999
                        ? `${tier.min}+`
                        : `${tier.min}-${tier.max}`;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-[10px] transition-all ${
                          active
                            ? "bg-[#071b34] text-amber-300 font-bold shadow-md ring-2 ring-amber-400/40"
                            : "bg-white border border-slate-200 text-slate-600"
                        }`}
                      >
                        <div
                          className={`text-[9px] ${
                            active ? "text-amber-200/70" : "text-slate-400"
                          }`}
                        >
                          {shortLabel}
                        </div>
                        <div className="font-black mt-0.5 text-[11px] whitespace-nowrap">
                          {tier.price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Savings Progress Bar */}
                {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
                  nextTier ? (
                    <div className="mt-2.5 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex justify-between text-[10px] text-emerald-700 font-semibold mb-1.5">
                        <span>Thêm {nextTier.min - quantity} chiếc nữa</span>
                        <span>→ giá {nextTier.price.toLocaleString("vi-VN")}đ/chiếc</span>
                      </div>
                      <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, Math.round((quantity / nextTier.min) * 100))
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                        💰 Tiết kiệm thêm {Math.max(0, (currentUnitPrice - nextTier.price) * nextTier.min).toLocaleString("vi-VN")}đ nếu đặt đủ {nextTier.min} chiếc
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-[11px] text-emerald-700 font-bold">
                      🎉 Bạn đang nhận mức giá sỉ tốt nhất!
                    </div>
                  )
                )}
              </div>

              {/* Màu sắc */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Màu: <span className="text-amber-700">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((c, i) => {
                      const active = selectedColor === c.name;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(c.name)}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 border transition-all active:scale-95 ${
                            active
                              ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: c.code }}
                          />
                          <span>{c.name}</span>
                          {active && (
                            <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700">
                      Size: <span className="text-amber-700">{selectedSize}</span>
                    </label>
                    <button
                      onClick={() =>
                        showToast(
                          "HUNI hỗ trợ gửi bảng size chi tiết hoặc chuyên viên đến đo tận nơi!",
                          "info"
                        )
                      }
                      className="text-[10px] sm:text-[11px] text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Hướng dẫn chọn size</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s, i) => {
                      const active = selectedSize === s;
                      const isCustom = s.toLowerCase().includes("may đo");
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedSize(s)}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all border active:scale-95 ${
                            active
                              ? "bg-[#071b34] text-amber-300 border-[#071b34]"
                              : isCustom
                              ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACCORDION ĐẶC ĐIỂM SẢN PHẨM */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs">
                {/* Tab 1: Đặc điểm nổi bật */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenTab(openTab === "features" ? null : "features")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-800 transition-colors"
                  >
                    <span>✦ Đặc điểm nổi bật</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        openTab === "features" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openTab === "features" && (
                    <div className="p-3 bg-white space-y-2">
                      {product.features && product.features.length > 0 ? (
                        product.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-700 text-[11px] sm:text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-[11px]">Đường may tỉ mỉ, phom dáng chuẩn quốc tế, bền đẹp theo thời gian.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Tab 2: Hướng dẫn bảo quản */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenTab(openTab === "care" ? null : "care")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-800 transition-colors"
                  >
                    <span>🧺 Hướng dẫn bảo quản</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        openTab === "care" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openTab === "care" && (
                    <div className="p-3 bg-white text-slate-700 text-[11px] sm:text-xs leading-relaxed">
                      {product.material?.includes("Kate")
                        ? "Giặt máy ≤30°C, không tẩy, ủi mặt trái"
                        : product.material?.includes("Seamless")
                        ? "Giặt tay hoặc máy chế độ nhẹ, không vắt mạnh"
                        : product.material?.includes("Wool")
                        ? "Giặt khô, ủi qua vải lót, bảo quản nơi thoáng mát"
                        : "Giặt máy ≤40°C, phơi nơi thoáng, không phơi trực tiếp nắng gắt"}
                    </div>
                  )}
                </div>

                {/* Tab 3: Chính sách */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenTab(openTab === "policy" ? null : "policy")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-800 transition-colors"
                  >
                    <span>🛡️ Chính sách</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        openTab === "policy" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openTab === "policy" && (
                    <div className="p-3 bg-white space-y-1.5 text-slate-700 text-[11px] sm:text-xs">
                      <div>✓ Bảo hành 30 ngày lỗi sản xuất</div>
                      <div>✓ Đổi trả trong 7 ngày nếu lỗi</div>
                      <div>✓ Giao hàng toàn quốc, theo dõi đơn realtime</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Đánh giá & Phản hồi thực tế (Prompt C) */}
              <Suspense
                fallback={
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    Đang tải đánh giá sản phẩm...
                  </div>
                }
              >
                <ReviewSection productId={product.id} />
              </Suspense>

              {/* Số lượng + Tính giá */}
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-slate-800 block">
                      Số lượng đặt may:
                    </label>
                    <span className="text-[10px] text-slate-500">
                      Càng nhiều — giá càng tốt!
                    </span>
                  </div>

                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(5, q - 5))}
                      aria-label="Giảm"
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black active:scale-95 text-sm"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="5"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-12 sm:w-14 text-center text-xs sm:text-sm font-black text-slate-900 focus:outline-none py-1"
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 5)}
                      aria-label="Tăng"
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black active:scale-95 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-amber-200 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="text-slate-600">Đơn giá:</span>
                    <strong className="text-amber-800 font-black text-xs sm:text-sm">
                      {currentUnitPrice.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold text-[11px] sm:text-xs">
                      Tổng cộng:
                    </span>
                    <strong className="text-[#071b34] text-base sm:text-lg font-black">
                      {currentTotalPrice.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>

                  {savings > 0 && (
                    <div className="text-right text-[10px] text-emerald-700 font-bold bg-emerald-50 rounded-lg px-2 py-0.5 mt-0.5 inline-block ml-auto">
                      ✓ Tiết kiệm {savings.toLocaleString("vi-VN")} đ
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =========================================================
                STICKY ACTION BAR
                ========================================================= */}
            <div className="p-2.5 sm:p-3 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Hàng công cụ & tuỳ chọn trên mobile */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    title="Gọi tư vấn"
                    className="p-2.5 sm:px-3 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition-colors active:scale-[0.98] shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="hidden md:inline">Tư vấn</span>
                  </a>

                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const url = window.location.origin + '/san-pham/' + product.id;
                        await navigator.clipboard.writeText(url);
                        showToast("Đã sao chép link sản phẩm!", "success");
                      } catch (err) {
                        showToast("Đã xảy ra lỗi sao chép link", "error");
                      }
                    }}
                    title="Chia sẻ sản phẩm"
                    className="p-2.5 sm:px-3 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition-colors active:scale-[0.98] shrink-0 flex items-center justify-center"
                  >
                    <Share2 className="w-3.5 h-3.5 text-brand-600" />
                  </button>

                  {/* Nút Yêu cầu Báo Giá B2B (khi quantity >= 100) */}
                  {quantity >= 100 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof setIsQuoteOpen === "function") setIsQuoteOpen(true);
                        else if (typeof setIsQuickQuoteOpen === "function") setIsQuickQuoteOpen(true);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 sm:flex-initial py-2.5 px-3 rounded-xl bg-[#004f5e] hover:bg-[#003843] text-brand-300 border border-brand-400/40 font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                    >
                      <span>📋 Báo Giá B2B</span>
                    </button>
                  )}

                  <button
                    onClick={handleOpenCustomizer}
                    className="flex-1 sm:flex-initial py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="hidden sm:inline">Mô Phỏng Logo (0đ)</span>
                    <span className="sm:hidden">Logo 3D</span>
                  </button>
                </div>

                {/* Nút thêm vào giỏ hàng: full-width trên mobile, flex-1 trên tablet/desktop */}
                <button
                  onClick={handleBuyNow}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Thêm Vào Giỏ ({quantity})</span>
                </button>
              </div>

              <div className="mt-1.5 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>
                  Gọi{" "}
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    {BRAND_INFO.contact.hotline}
                  </a>{" "}
                  để được tư vấn ngay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}