"use client";

import React, { useState } from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/context/ShopContext";
import { Calculator, Send, CheckCircle2, Phone, Sparkles, FileSpreadsheet } from "lucide-react";

export default function QuickQuoteSection() {
  const { showToast, triggerConfetti } = useShop();

  const [category, setCategory] = useState("polo");
  const [quantity, setQuantity] = useState(50);
  const [fabric, setFabric] = useState("cotton_compact");
  const [logoOption, setLogoOption] = useState("theu_tajima");

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast("Vui lòng nhập số điện thoại hoặc Zalo để nhận báo giá", "error");
      return;
    }
    setSubmitted(true);
    triggerConfetti();
    showToast("Đã gửi yêu cầu báo giá thành công! HUNI sẽ liên hệ trong 5 phút.");
  };

  return (
    <section id="quick-quote-section" className="py-20 bg-[#071b34] text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              Công Cụ Báo Giá Nhanh
            </div>

            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              TÍNH GIÁ ĐỒNG PHỤC DỰ KIẾN TRONG <span className="text-gold-gradient">3 PHÚT</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Nhận dự toán chi phí chi tiết theo quy mô công ty. HUNI hỗ trợ xuất hóa đơn VAT,
              ký hợp đồng điện tử và cam kết giá gốc tận xưởng may không qua bất kỳ khâu trung gian nào.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Tặng 100% chi phí thiết kế phối cảnh 3D bộ nhận diện</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>May áo mẫu thật gửi tận văn phòng thẩm định chất lượng vải</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Cử chuyên viên mang bảng size hoặc đến đo tận nơi</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-4 text-xs text-cyan-400">
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="flex items-center gap-2 hover:underline font-bold"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Hotline tư vấn 24/7: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>

          {/* Right Interactive Calculator Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#0b2042] rounded-3xl border border-cyan-400/30 p-6 sm:p-8 shadow-2xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Select Category */}
                  <div>
                    <label className="text-xs font-bold text-cyan-300 block mb-2">
                      1. Chọn Dòng Đồng Phục:
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
                          className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                            category === item.id
                              ? "bg-cyan-500 text-[#071b34] border-cyan-400 shadow-md"
                              : "bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-cyan-300">2. Số Lượng Áo Dự Kiến:</span>
                      <span className="text-base text-cyan-400 font-black">{quantity} sản phẩm</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>10 chiếc</span>
                      <span>50 chiếc (Giảm 15%)</span>
                      <span>100 chiếc (Giảm 22%)</span>
                      <span>500+ (Giá sỉ xưởng)</span>
                    </div>
                  </div>

                  {/* Fabric Option */}
                  <div>
                    <label className="text-xs font-bold text-cyan-300 block mb-2">
                      3. Nhu Cầu Về Chất Liệu:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "cotton_compact", label: "Cotton Compact 100%" },
                        { id: "pique", label: "Pique Cá Sấu 4 Chiều" },
                        { id: "bamboo", label: "Bamboo Sợi Tre Kháng Khuẩn" }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFabric(f.id)}
                          className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                            fabric === f.id
                              ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
                              : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Output Banner */}
                  <div className="p-4 bg-gradient-to-r from-[#071b34] to-[#040e1c] rounded-2xl border border-cyan-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Đơn giá sỉ ước tính:</div>
                      <div className="text-lg font-black text-cyan-400">
                        ~{unitPrice.toLocaleString("vi-VN")} đ/sp
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Tổng ngân sách dự toán:</div>
                      <div className="text-xl font-black text-white">
                        ~{totalPrice.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  </div>

                  {/* Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">
                        Tên Doanh Nghiệp / Đơn Vị:
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Công ty TNHH HUNI..."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">
                        Số Điện Thoại / Zalo Nhận Báo Giá <span className="text-cyan-400">*</span>:
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0984.xxx.xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-[#071b34] font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá Kèm File Phối Cảnh 3D</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Chuyên viên báo giá HUNI Uniform sẽ gửi file dự toán chi tiết và liên hệ số{" "}
                    <strong className="text-cyan-300">{phone}</strong> trong vòng 5 - 10 phút.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-slate-800 text-cyan-400 rounded-xl text-xs font-bold hover:bg-slate-700"
                  >
                    Tính giá cho dự án khác
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}