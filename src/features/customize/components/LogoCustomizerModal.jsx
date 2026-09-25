"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  X,
  Upload,
  Sparkles,
  Check,
  ShoppingBag
} from "lucide-react";

export default function LogoCustomizerModal() {
  const {
    isCustomizerOpen,
    setIsCustomizerOpen,
    customizerProduct,
    addToCart,
    setIsCartOpen,
    showToast
  } = useShop();

  const [method, setMethod] = useState("theu_vi_tinh");
  const [position, setPosition] = useState("chest_left");
  const [logoType, setLogoType] = useState("upload");
  const [customText, setCustomText] = useState("HUNI GROUP");
  const [logoImage, setLogoImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(30);

  if (!isCustomizerOpen || !customizerProduct) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoImage(url);
      showToast("Đã tải logo lên mockup thành công!");
    }
  };

  const handleApplyAndAddToCart = () => {
    const customLogoData = {
      method:
        method === "theu_vi_tinh"
          ? "Thêu Vi Tính Tajima Nhật Bản"
          : "In Pet Kỹ Thuật Số 4K",
      position:
        position === "chest_left"
          ? "Ngực Trái"
          : position === "back_center"
          ? "Sau Lưng"
          : "Tay Áo",
      logoUrl: logoImage,
      customText: logoType === "text" ? customText : "",
      notes
    };

    addToCart(customizerProduct, quantity, {
      color: customizerProduct.colors?.[0]?.name || "Chuẩn",
      size: "May đo / Bảng size chuẩn",
      customLogo: customLogoData
    });

    setIsCustomizerOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-400/40 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
        {/* =============================================
            Header
            ============================================= */}
        <div className="bg-[#071b34] text-white p-3 sm:p-5 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-lg truncate">
                Mô Phỏng Logo
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-200/80 truncate">
                {customizerProduct.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label="Đóng"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* =============================================
            Body — 2 columns on desktop
            ============================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* =========================================
              Left: Mockup canvas
              ========================================= */}
          <div className="md:col-span-6 bg-slate-900 p-4 sm:p-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 aspect-[4/5]">
              {/* Product image */}
              <Image
                src={customizerProduct.image}
                alt={customizerProduct.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-top opacity-90"
              />

              {/* =========================================
                  Logo overlays by position
                  ========================================= */}
              {position === "chest_left" && (
                <div className="absolute top-[32%] left-[34%] transform -translate-x-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded border border-amber-400/60 bg-black/40 backdrop-blur-xs flex items-center justify-center max-w-[60%]">
                  {logoType === "upload" && logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="Uploaded logo" className="max-h-6 sm:max-h-8 max-w-16 object-contain" />
                  ) : (
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-amber-300 drop-shadow-md">
                      {customText || "LOGO CTY"}
                    </span>
                  )}
                  <span className="absolute -top-3.5 sm:-top-4 text-[8px] sm:text-[9px] bg-amber-500 text-black px-1 rounded font-bold whitespace-nowrap">
                    Ngực trái
                  </span>
                </div>
              )}

              {position === "back_center" && (
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-2 sm:p-3 rounded border border-amber-400/60 bg-black/40 backdrop-blur-xs flex items-center justify-center w-28 sm:w-36 max-w-[70%]">
                  {logoType === "upload" && logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="Uploaded logo" className="max-h-10 sm:max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] sm:text-xs font-black tracking-wider text-amber-300 text-center drop-shadow-md">
                      {customText || "TÊN CÔNG TY"}
                    </span>
                  )}
                  <span className="absolute -top-3.5 sm:-top-4 text-[8px] sm:text-[9px] bg-amber-500 text-black px-1 rounded font-bold whitespace-nowrap">
                    Sau lưng
                  </span>
                </div>
              )}

              {position === "sleeve_left" && (
                <div className="absolute top-[42%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 p-1 sm:p-1.5 rounded border border-amber-400/60 bg-black/40 backdrop-blur-xs flex items-center justify-center max-w-[50%]">
                  {logoType === "upload" && logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoImage} alt="Uploaded logo" className="max-h-5 sm:max-h-6 max-w-10 object-contain" />
                  ) : (
                    <span className="text-[8px] sm:text-[9px] font-black text-amber-300">
                      {customText || "LOGO"}
                    </span>
                  )}
                  <span className="absolute -top-3.5 sm:-top-4 text-[8px] sm:text-[9px] bg-amber-500 text-black px-1 rounded font-bold whitespace-nowrap">
                    Tay áo
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] sm:text-xs text-slate-400 text-center mt-3 leading-relaxed">
              ★ Bản vẽ 2D minh họa. HUNI gửi bản vẽ 3D chính xác 100% trước khi may!
            </div>
          </div>

          {/* =========================================
              Right: Controls
              ========================================= */}
          <div className="md:col-span-6 p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* 1. Method */}
            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 block mb-2">
                1. Công nghệ in / thêu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("theu_vi_tinh")}
                  className={`p-2.5 rounded-xl border text-left text-[11px] sm:text-xs font-semibold transition-all active:scale-[0.98] ${
                    method === "theu_vi_tinh"
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-amber-300 text-slate-700"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between gap-1">
                    <span className="truncate">Thêu Tajima</span>
                    {method === "theu_vi_tinh" && (
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Bền vĩnh viễn</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("in_pet_4k")}
                  className={`p-2.5 rounded-xl border text-left text-[11px] sm:text-xs font-semibold transition-all active:scale-[0.98] ${
                    method === "in_pet_4k"
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-amber-300 text-slate-700"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between gap-1">
                    <span className="truncate">In PET 4K</span>
                    {method === "in_pet_4k" && (
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Đa sắc màu</div>
                </button>
              </div>
            </div>

            {/* 2. Position */}
            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 block mb-2">
                2. Vị trí logo:
              </label>
              <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                {[
                  { id: "chest_left", label: "Ngực trái" },
                  { id: "back_center", label: "Sau lưng" },
                  { id: "sleeve_left", label: "Tay áo" }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id)}
                    className={`py-2 px-1.5 sm:px-2.5 rounded-xl border text-center font-bold transition-all active:scale-[0.98] ${
                      position === pos.id
                        ? "bg-[#071b34] text-amber-300 border-[#071b34]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Logo upload or text */}
            <div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                  3. Logo doanh nghiệp:
                </label>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                  <button
                    type="button"
                    onClick={() => setLogoType("upload")}
                    className={`px-2 py-1 rounded font-semibold transition-colors ${
                      logoType === "upload"
                        ? "bg-amber-100 text-amber-800"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    File ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoType("text")}
                    className={`px-2 py-1 rounded font-semibold transition-colors ${
                      logoType === "text"
                        ? "bg-amber-100 text-amber-800"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Tên chữ
                  </button>
                </div>
              </div>

              {logoType === "upload" ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer bg-slate-50 relative transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mx-auto mb-1" />
                  <div className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Bấm để tải logo lên
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    PNG trong suốt, JPG, AI, CDR (&lt;20MB)
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Nhập tên doanh nghiệp / Slogan..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
                />
              )}
            </div>

            {/* 4. Quantity */}
            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 block mb-1.5">
                4. Số lượng dự kiến:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(10, parseInt(e.target.value) || 10))
                  }
                  className="w-20 sm:w-24 px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold leading-tight">
                  ✓ Miễn phí khuôn in / phim thêu từ 30 áo
                </span>
              </div>
            </div>

            {/* 5. Notes */}
            <div>
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 block mb-1.5">
                Ghi chú cho HUNI:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Chỉ thêu vàng kim nhũ, logo rộng 7.5cm..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 resize-none"
              />
            </div>

            {/* Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleApplyAndAddToCart}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Lưu Mockup & Thêm Vào Giỏ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}