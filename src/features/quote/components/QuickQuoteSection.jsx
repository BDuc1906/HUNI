"use client";

import React, { useState } from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import { Calculator, Send, CheckCircle2, Phone, Sparkles, MessageCircle, ShieldCheck } from "lucide-react";

export default function QuickQuoteSection() {
  const { showToast, triggerConfetti } = useShop();

  const [category, setCategory] = useState("polo");
  const [quantity, setQuantity] = useState(50);
  const [fabric, setFabric] = useState("cotton_compact");
  const [logoOption, setLogoOption] = useState("theu_tajima");

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic estimate calculation
  const getEstimatedUnitPrice = () => {
    let base = 180000;
    if (category === "suit") base = 1500000;
    if (category === "shirt") base = 230000;
    if (category === "golf") base = 280000;
    if (category === "school") base = 260000;

    // Quantity discounts
    let discountMultiplier = 1.0;
    if (quantity >= 30 && quantity < 50) discountMultiplier = 0.92;
    else if (quantity >= 50 && quantity < 100) discountMultiplier = 0.85;
    else if (quantity >= 100 && quantity < 300) discountMultiplier = 0.78;
    else if (quantity >= 300) discountMultiplier = 0.70;

    // Fabric modifier
    let fabricMod = 0;
    if (fabric === "bamboo") fabricMod = 25000;
    if (fabric === "wool") fabricMod = 250000;

    // Logo modifier
    let logoMod = logoOption === "none" ? 0 : 15000;

    return Math.round((base + fabricMod + logoMod) * discountMultiplier);
  };

  const unitPrice = getEstimatedUnitPrice();
  const totalPrice = unitPrice * quantity;

  // Discount percentage helper
  const getDiscountPercent = () => {
    if (quantity >= 300) return 30;
    if (quantity >= 100) return 22;
    if (quantity >= 50) return 15;
    if (quantity >= 30) return 8;
    return 0;
  };

  const discountPercent = getDiscountPercent();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast("Vui lòng nhập số điện thoại hoặc Zalo để nhận báo giá", "error");
      return;
    }
    setSubmitted(true);
    triggerConfetti();
    showToast("Đã ghi nhận yêu cầu! Chuyên viên HDC sẽ gửi file báo giá qua Zalo/SĐT trong 5 phút.");
  };

  return (
    <section id="quick-quote-section" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-50 rounded-full blur-3xl pointer-events-none opacity-70" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT — Value Proposition */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-brand-600" />
              Công Cụ Dự Toán Ngân Sách Trực Tuyến
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-[#004f5e]">
              TÍNH GIÁ ĐỒNG PHỤC DỰ KIẾN TRONG{" "}
              <span className="text-brand-gradient">3 PHÚT</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Nhận ngay bảng dự toán chi phí chi tiết theo quy mô nhân sự. HDC hỗ trợ xuất hóa đơn VAT đầy đủ,
              ký hợp đồng điện tử và cam kết mức giá gốc tại xưởng may 2.500m².
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                  ✓
                </div>
                <span>Tặng 100% chi phí thiết kế phối cảnh 3D bộ nhận diện</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                  ✓
                </div>
                <span>May áo mẫu thật gửi tận văn phòng thẩm định chất lượng vải</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                  ✓
                </div>
                <span>Cử chuyên viên mang bảng size hoặc đến đo tận nơi</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-4 text-xs">
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="flex items-center gap-2 text-[#004f5e] hover:text-brand-600 font-bold transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-500 animate-bounce" />
                <span>Hotline tư vấn 24/7: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>

          {/* RIGHT — Interactive Calculator Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-8 relative">
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 rounded-t-3xl" />

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                  {/* 1. Category */}
                  <div>
                    <label className="text-xs font-bold text-[#004f5e] block mb-2">
                      1. Chọn Dòng Đồng Phục Doanh Nghiệp:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "polo", label: "Áo Polo Doanh Nghiệp" },
                        { id: "shirt", label: "Áo Sơ Mi Công Sở" },
                        { id: "suit", label: "Bộ Vest Lãnh Đạo" },
                        { id: "golf", label: "Đồng Phục Golf/Thể Thao" },
                        { id: "school", label: "Đồng Phục Trường Học" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCategory(item.id)}
                          className={`p-2.5 rounded-xl border text-center font-bold transition-all text-[11px] sm:text-xs ${
                            category === item.id
                              ? "bg-gradient-to-r from-brand-400 to-brand-500 text-white border-brand-500 shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50/50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Quantity Slider + Quick Presets */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-[#004f5e]">2. Số Lượng Áo Dự Kiến:</span>
                      <div className="flex items-center gap-2">
                        {discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-extrabold text-[10px] border border-rose-200">
                            Giảm {discountPercent}%
                          </span>
                        )}
                        <span className="text-base text-brand-600 font-black">{quantity} sản phẩm</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />

                    {/* Quick preset buttons */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Chọn nhanh:</span>
                      {[20, 50, 100, 200, 500].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setQuantity(preset)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                            quantity === preset
                              ? "bg-[#004f5e] text-white border-[#004f5e]"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {preset} áo
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Fabric Option */}
                  <div>
                    <label className="text-xs font-bold text-[#004f5e] block mb-2">
                      3. Nhu Cầu Về Chất Liệu:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "cotton_compact", label: "Cotton Compact 100%" },
                        { id: "pique", label: "Pique Cá Sấu 4 Chiều" },
                        { id: "bamboo", label: "Bamboo Kháng Khuẩn" }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFabric(f.id)}
                          className={`p-2 rounded-xl border text-center font-semibold transition-all text-[11px] sm:text-xs ${
                            fabric === f.id
                              ? "border-brand-500 bg-brand-50 text-brand-800 font-bold"
                              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Output Banner */}
                  <div className="p-3.5 sm:p-4 bg-gradient-to-r from-brand-50/70 via-slate-50 to-brand-50/70 rounded-2xl border border-brand-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500">Đơn giá sỉ ước tính:</div>
                      <div className="text-base sm:text-lg font-black text-brand-600">
                        ~{unitPrice.toLocaleString("vi-VN")} đ/sp
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] sm:text-[11px] text-slate-500">Tổng ngân sách dự kiến:</div>
                      <div className="text-lg sm:text-xl font-black text-[#004f5e]">
                        ~{totalPrice.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  </div>

                  {/* Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Tên Doanh Nghiệp / Tổ Chức:
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Tập đoàn ABC..."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Số Điện Thoại / Zalo Nhận Báo Giá <span className="text-brand-600">*</span>:
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0984.xxx.xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá Kèm File Phối Cảnh 3D</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 sm:py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#004f5e]">
                    YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN THÀNH CÔNG!
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dòng sản phẩm:</span>
                      <strong className="text-slate-800 uppercase">{category}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số lượng dự kiến:</span>
                      <strong className="text-brand-600 font-bold">{quantity} sản phẩm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dự toán ngân sách:</span>
                      <strong className="text-[#004f5e] font-extrabold">~{totalPrice.toLocaleString("vi-VN")} đ</strong>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Chuyên viên HDC Fashion sẽ gửi file PDF báo giá chi tiết và liên hệ số{" "}
                    <strong className="text-brand-700">{phone}</strong> trong vòng 5 - 10 phút.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    <a
                      href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Zalo Nhận Báo Giá Ngay</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#004f5e] rounded-xl text-xs font-bold transition-colors"
                    >
                      Tính giá cho dự án khác
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
