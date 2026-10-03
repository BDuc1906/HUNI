"use client";

import React, { useState } from "react";
import {
  Send,
  Sparkles,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  FileCheck,
  Scissors,
  Check,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";

const UNIFORM_TYPES = [
  { id: "polo", label: "Áo Polo Doanh Nghiệp", desc: "Cá sấu Cotton Compact 4C" },
  { id: "shirt", label: "Sơ Mi & Quần Âu", desc: "Bamboo Silk chống nhăn" },
  { id: "suit", label: "Vest & Blazer Cao Cấp", desc: "May đo đo ni từng người" },
  { id: "sport", label: "Đồng Phục Golf & Thể Thao", desc: "Công nghệ AeroCool làm mát" },
  { id: "school", label: "Đồng Phục Trường Học", desc: "Chuẩn form dáng quốc tế" },
  { id: "jacket", label: "Áo Khoác Gió Doanh Nghiệp", desc: "Chống nước & cản gió" },
  { id: "accessory", label: "Phụ Kiện Doanh Nghiệp", desc: "Mũ nón, cặp túi thương hiệu" },
];

const QUANTITY_TIERS = [
  "20 - 50 áo",
  "50 - 100 áo",
  "100 - 300 áo",
  "300 - 500 áo",
  "Trên 500 áo",
];

const COMPLIMENTARY_PERKS = [
  { id: "sample_shirt", label: "May áo mẫu thử thật 0đ duyệt form trước khi may đồng loạt" },
  { id: "sample_box", label: "Gửi miễn phí bộ Catalogue & hộp mẫu vải thực tế tận văn phòng" },
  { id: "design_3d", label: "Miễn phí thiết kế 2D/3D theo nhận diện thương hiệu công ty" },
  { id: "onsite_measure", label: "Hỗ trợ chuyên viên đến văn phòng lấy số đo từng nhân sự" },
  { id: "vat_invoice", label: "Yêu cầu hợp đồng kinh tế & xuất hóa đơn GTGT (VAT)" },
];

export default function ContactFormSection() {
  const { showToast, triggerConfetti } = useShop();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selectedType, setSelectedType] = useState("polo");
  const [quantityTier, setQuantityTier] = useState("50 - 100 áo");
  const [customQty, setCustomQty] = useState("");
  const [selectedPerks, setSelectedPerks] = useState([
    "sample_shirt",
    "design_3d",
    "sample_box",
  ]);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  const togglePerk = (id) => {
    setSelectedPerks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại hoặc Zalo";
    } else {
      const cleanPhone = phone.replace(/[\s.-]/g, "");
      if (!/^0\d{9,10}$/.test(cleanPhone)) {
        newErrors.phone = "Số điện thoại không hợp lệ (cần 10 chữ số)";
      }
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Địa chỉ email không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Vui lòng kiểm tra lại thông tin bắt buộc", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      const code = `HDC-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedData({
        code,
        fullName,
        phone,
        email,
        company,
        type: UNIFORM_TYPES.find((t) => t.id === selectedType)?.label,
        quantity: customQty ? `${customQty} áo` : quantityTier,
        perksCount: selectedPerks.length,
      });

      triggerConfetti();
      showToast("Đã gửi yêu cầu thành công! Chuyên viên HDC sẽ liên hệ trong 5-15 phút.");
    }, 800);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFullName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setNotes("");
    setCustomQty("");
    setErrors({});
  };

  return (
    <section id="contact-form-section" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-50/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Yêu Cầu Tư Vấn &amp; Đặt May Mẫu 0đ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#004f5e] tracking-tight">
            GỬI THÔNG TIN DOANH NGHIỆP
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Nhận bản phác thảo 3D miễn phí, báo giá chiết khấu tận xưởng và áo mẫu thật gửi tận văn
            phòng kiểm tra chất lượng. Cam kết phản hồi nhanh chóng trong vòng <strong>15 phút</strong>.
          </p>
        </div>

        {/* Main Grid: Form on Left, Direct Contact / SLA on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              LEFT COLUMN: THE CONTACT FORM OR SUCCESS STATE
              ======================================================== */}
          <div className="lg:col-span-8 bg-slate-50/80 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
            {submittedData ? (
              /* SUCCESS STATE */
              <div className="text-center py-6 sm:py-10 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Tiếp nhận thành công
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#004f5e]">
                    CẢM ƠN QUÝ KHÁCH ĐÃ LIÊN HỆ HDC FASHION!
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
                    Mã yêu cầu của bạn là:{" "}
                    <strong className="text-brand-600 font-mono text-lg">{submittedData.code}</strong>.
                    Chuyên viên tư vấn may đo sẽ liên hệ lại qua SĐT/Zalo{" "}
                    <strong className="text-[#004f5e]">{submittedData.phone}</strong> trong vòng 15 phút.
                  </p>
                </div>

                {/* Inquiry Summary Box */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Khách hàng:</span>
                    <span className="font-bold text-slate-800">{submittedData.fullName}</span>
                  </div>
                  {submittedData.company && (
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Doanh nghiệp:</span>
                      <span className="font-bold text-slate-800">{submittedData.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Dòng sản phẩm:</span>
                    <span className="font-bold text-brand-600">{submittedData.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Số lượng dự kiến:</span>
                    <span className="font-bold text-slate-800">{submittedData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đãi ngộ đã chọn:</span>
                    <span className="font-bold text-emerald-600">
                      {submittedData.perksCount} đặc quyền miễn phí
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons in Success State */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#0068FF] hover:bg-[#0055d4] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Nhắn Zalo nhận mẫu ngay</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              </div>
            ) : (
              /* MAIN INTERACTIVE FORM */
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* 1. Customer Basic Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#004f5e] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Thông Tin Người Liên Hệ</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Họ và tên của bạn <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors({ ...errors, fullName: null });
                        }}
                        placeholder="Ví dụ: Nguyễn Văn An"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 text-sm focus:outline-none transition-colors ${
                          errors.fullName
                            ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                            : "border-slate-300 focus:border-brand-500 ring-2 ring-brand-50"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Phone / Zalo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        placeholder="Ví dụ: 0984 959 586"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 text-sm focus:outline-none transition-colors ${
                          errors.phone
                            ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                            : "border-slate-300 focus:border-brand-500 ring-2 ring-brand-50"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email doanh nghiệp (nhận báo giá PDF)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        placeholder="tencongty@gmail.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 text-sm focus:outline-none transition-colors ${
                          errors.email
                            ? "border-rose-400 focus:border-rose-500 ring-2 ring-rose-100"
                            : "border-slate-300 focus:border-brand-500 ring-2 ring-brand-50"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tên công ty / Tổ chức / Trường học
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Tập đoàn / Công ty / Ngân hàng..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-brand-500 ring-2 ring-brand-50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Uniform Category Selection */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#004f5e] mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Dòng Sản Phẩm Cần Tư Vấn &amp; Báo Giá</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {UNIFORM_TYPES.map((type) => {
                      const active = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            active
                              ? "bg-brand-500 text-white border-brand-500 shadow-md ring-2 ring-brand-400/30"
                              : "bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-extrabold text-xs leading-snug">{type.label}</div>
                          <div
                            className={`text-[10px] mt-1 line-clamp-1 ${
                              active ? "text-brand-100" : "text-slate-400"
                            }`}
                          >
                            {type.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Expected Quantity */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#004f5e] mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Số Lượng Đặt May Dự Kiến</span>
                  </h3>

                  <div className="space-y-2">
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        min="10"
                        step="1"
                        required
                        value={customQty || (quantityTier && quantityTier !== "10 - 20 áo" ? quantityTier.split(" ")[0] : "")}
                        onChange={(e) => {
                          setCustomQty(e.target.value);
                          setQuantityTier("");
                        }}
                        placeholder="Nhập số lượng áo (tối thiểu 10 cái)..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-bold focus:outline-none focus:border-brand-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        áo / cái
                      </span>
                    </div>
                    {customQty !== "" && Number(customQty) < 10 && (
                      <p className="text-[11px] text-rose-500 font-bold">
                        * Số lượng nhập không được nhỏ hơn 10 cái
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Complimentary Perks Checkboxes */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#004f5e] mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                      4
                    </span>
                    <span>Đặc Quyền Doanh Nghiệp Bạn Mong Muốn Nhận (Miễn Phí 100%)</span>
                  </h3>

                  <div className="space-y-2.5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200">
                    {COMPLIMENTARY_PERKS.map((perk) => {
                      const checked = selectedPerks.includes(perk.id);
                      return (
                        <label
                          key={perk.id}
                          className="flex items-start gap-3 cursor-pointer group select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePerk(perk.id)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                              checked
                                ? "bg-brand-500 border-brand-500 text-white"
                                : "bg-white border-slate-300 group-hover:border-brand-400"
                            }`}
                          >
                            {checked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                              checked ? "font-bold text-slate-800" : "text-slate-600"
                            }`}
                          >
                            {perk.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Notes / Specifications */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ghi chú thêm về yêu cầu may đo (màu sắc logo, deadline cần hàng, chất vải mong muốn...)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Công ty cần may 80 áo polo màu xanh thương hiệu, thêu logo trước ngực, cần nhận áo trước ngày 20 tháng sau..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-brand-500 ring-2 ring-brand-50 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-600 to-[#004f5e] hover:from-brand-400 hover:to-brand-600 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-brand-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70 animate-shine"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Đang gửi thông tin...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>GỬI YÊU CẦU &amp; NHẬN BÁO GIÁ TRONG 15 PHÚT</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 mt-2.5">
                    🔒 Thông tin của quý khách được bảo mật tuyệt đối theo chính sách HDC FASHION.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: TRUST SLA, CEO LETTER & DIRECT CONNECT
              ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* SLA Commitment Card */}
            <div className="bg-gradient-to-br from-[#003843] to-[#004f5e] text-white rounded-3xl p-6 sm:p-7 border border-brand-400/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cam Kết Dịch Vụ HDC
              </div>

              <h3 className="text-xl font-black text-white mb-4">
                TẠI SAO 50.000+ DOANH NGHIỆP TIN CHỌN HDC?
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Phản Hồi Báo Giá Sau 15 Phút</strong>
                    <span className="text-slate-300 text-xs">
                      Đội ngũ tư vấn trực Zalo/Hotline liên tục từ 08:00 đến 22:00 hàng ngày.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">May Mẫu Thử Thật Miễn Phí 0đ</strong>
                    <span className="text-slate-300 text-xs">
                      May áo mẫu chuẩn từng đường kim, thêu logo thực tế gửi tận tay kiểm tra.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Giá Gốc Tận Xưởng 2.500m²</strong>
                    <span className="text-slate-300 text-xs">
                      Không qua bất kỳ trung gian thương mại nào, tối ưu 20-30% chi phí cho công ty.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Bảo Hành 1 Đổi 1 Trong 30 Ngày</strong>
                    <span className="text-slate-300 text-xs">
                      Cam kết đổi mới 100% nếu phát sinh lỗi đường chỉ, bung cúc hay sai màu nhận diện.
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Track Contact Buttons */}
              <div className="mt-6 pt-5 border-t border-brand-400/20 space-y-2.5">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="w-full py-3 px-4 rounded-xl bg-white text-[#004f5e] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4 text-brand-600 animate-pulse" />
                  <span>Gọi Hotline 24/7: {BRAND_INFO.contact.hotline}</span>
                </a>

                <a
                  href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Trực Tiếp Qua Zalo</span>
                </a>
              </div>
            </div>

            {/* Corporate Invoice & Banking Info */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileCheck className="w-4 h-4 text-brand-600" />
                <span>Pháp Nhân &amp; Tài Khoản Doanh Nghiệp</span>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed bg-white rounded-2xl p-3.5 border border-slate-200/80">
                <div>
                  <strong>Đơn vị sở hữu:</strong> {BRAND_INFO.parentCompany}
                </div>
                <div>
                  <strong>Thương hiệu:</strong> {BRAND_INFO.brandName}
                </div>
                <div>
                  <strong>Ngân hàng:</strong> {BRAND_INFO.bankInfo.bankName}
                </div>
                <div>
                  <strong>Số tài khoản:</strong>{" "}
                  <span className="font-mono font-bold text-brand-700">
                    {BRAND_INFO.bankInfo.accountNumber}
                  </span>
                </div>
                <div>
                  <strong>Chủ tài khoản:</strong> {BRAND_INFO.bankInfo.accountHolder}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Hỗ trợ xuất hóa đơn điện tử GTGT hợp lệ gửi qua email ngay sau khi nghiệm thu giao hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
