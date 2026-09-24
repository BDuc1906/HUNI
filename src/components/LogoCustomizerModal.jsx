"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import {
  X,
  Upload,
  Sparkles,
  Check,
  ShoppingBag,
  Send,
  Layers,
  Image as ImageIcon,
  Type
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

  const [method, setMethod] = useState("theu_vi_tinh"); // theu_vi_tinh, in_pet_4k, in_lua, decal
  const [position, setPosition] = useState("chest_left"); // chest_left, back_center, sleeve_left
  const [logoType, setLogoType] = useState("upload"); // upload or text
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
          : method === "in_pet_4k"
          ? "In Pet Kỹ Thuật Số 4K"
          : "In Decal Phản Quang",
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-400/40 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#071b34] text-white p-5 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Mô Phỏng In / Thêu Logo Thương Hiệu
              </h3>
              <p className="text-xs text-amber-200/80">
                Áp dụng cho: <strong>{customizerProduct.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left: Interactive Mockup Canvas */}
          <div className="md:col-span-6 bg-slate-900 p-6 flex flex-col items-center justify-center relative min-h-[380px]">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
              <img
                src={customizerProduct.image}
                alt={customizerProduct.title}
                className="w-full h-80 object-cover object-top opacity-90"
              />

              {/* Dynamic Logo Placement on Shirt */}
              {position === "chest_left" && (
                <div className="absolute top-[32%] left-[34%] transform -translate-x-1/2 -translate-y-1/2 p-2 rounded border border-amber-400/60 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  {logoType === "upload" && logoImage ? (
                    <img src={logoImage} alt="Uploaded logo" className="max-h-8 max-w-16 object-contain" />
                  ) : (
                    <span className="text-[11px] font-black tracking-wider text-amber-300 drop-shadow-md">
                      {customText || "LOGO CTY"}
                    </span>
                  )}
                  <span className="absolute -top-4 text-[9px] bg-amber-500 text-black px-1 rounded font-bold">
                    Ngực trái
                  </span>
                </div>
              )}

              {position === "back_center" && (
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-3 rounded border border-amber-400/60 bg-black/40 backdrop-blur-xs flex items-center justify-center w-36">
                  {logoType === "upload" && logoImage ? (
                    <img src={logoImage} alt="Uploaded logo" className="max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="text-xs font-black tracking-wider text-amber-300 text-center drop-shadow-md">
                      {customText || "TÊN DOANH NGHIỆP"}
                    </span>
                  )}
                  <span className="absolute -top-4 text-[9px] bg-amber-500 text-black px-1 rounded font-bold">
                    Sau lưng
                  </span>
                </div>
              )}

              {position === "sleeve_left" && (
                <div className="absolute top-[42%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded border border-amber-400/60 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  {logoType === "upload" && logoImage ? (
                    <img src={logoImage} alt="Uploaded logo" className="max-h-6 max-w-10 object-contain" />
                  ) : (
                    <span className="text-[9px] font-black text-amber-300">
                      {customText || "LOGO"}
                    </span>
                  )}
                  <span className="absolute -top-4 text-[9px] bg-amber-500 text-black px-1 rounded font-bold">
                    Tay áo
                  </span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 text-center mt-3">
              ★ Bản vẽ mô phỏng 2D minh họa. HUNI sẽ gửi bản vẽ 3D chính xác 100% trước khi may mẫu thử!
            </div>
          </div>

          {/* Right: Controls & Options */}
          <div className="md:col-span-6 p-6 space-y-5">
            {/* 1. Technology Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                1. Chọn Công Nghệ In / Thêu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("theu_vi_tinh")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    method === "theu_vi_tinh"
                      ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Thêu Vi Tính Tajima</span>
                    {method === "theu_vi_tinh" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sang trọng, bền vĩnh viễn</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("in_pet_4k")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    method === "in_pet_4k"
                      ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>In Pet Chuyển Nhiệt 4K</span>
                    {method === "in_pet_4k" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Đa sắc màu, sắc nét 100%</div>
                </button>
              </div>
            </div>

            {/* 2. Position Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                2. Vị Trí Đặt Logo:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "chest_left", label: "Ngực Trái (Chuẩn)" },
                  { id: "back_center", label: "Sau Lưng Áo" },
                  { id: "sleeve_left", label: "Bắp Tay Áo" }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id)}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all ${
                      position === pos.id
                        ? "bg-[#071b34] text-amber-300 border-[#071b34]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Upload Logo or Type text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  3. Logo Doanh Nghiệp:
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setLogoType("upload")}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      logoType === "upload" ? "bg-amber-100 text-amber-800" : "text-slate-500"
                    }`}
                  >
                    Tải File Ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoType("text")}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      logoType === "text" ? "bg-amber-100 text-amber-800" : "text-slate-500"
                    }`}
                  >
                    Gõ Tên Chữ
                  </button>
                </div>
              </div>

              {logoType === "upload" ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-700">
                    Bấm để tải logo doanh nghiệp lên
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Hỗ trợ file PNG trong suốt, JPG, AI, CDR (Dưới 20MB)
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Nhập tên doanh nghiệp / Slogan..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              )}
            </div>

            {/* 4. Quantity */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                4. Số Lượng Dự Kiến:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
                <span className="text-xs text-emerald-700 font-semibold">
                  ✓ Miễn phí 100% chi phí ra phim thêu / khuôn in từ 30 áo!
                </span>
              </div>
            </div>

            {/* 5. Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ghi chú thêm cho bộ phận thiết kế HUNI:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Chỉ thêu chỉ vàng kim nhũ, kích thước logo rộng 7.5cm..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyAndAddToCart}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#071b34] font-black text-sm shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Lưu Bản Mockup & Thêm Vào Giỏ Hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
