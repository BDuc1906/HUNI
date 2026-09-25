"use client";

import React, { useState } from "react";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO } from "@/shared/data";
import { X, Send, CheckCircle2, Phone } from "lucide-react";

export default function QuickQuoteModal() {
  const { isQuickQuoteOpen, setIsQuickQuoteOpen, showToast, triggerConfetti } = useShop();

  const [category, setCategory] = useState("polo");
  const [quantity, setQuantity] = useState(50);
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isQuickQuoteOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast("Vui lòng điền số điện thoại hoặc Zalo để nhận báo giá", "error");
      return;
    }
    setSubmitted(true);
    triggerConfetti();
    showToast("Đã gửi yêu cầu thành công! HUNI sẽ phản hồi trong 5 phút.");
  };

  const handleClose = () => {
    setIsQuickQuoteOpen(false);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#071b34] text-white p-3 sm:p-5 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Logo TRÒN */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full aspect-square overflow-hidden border-2 border-amber-400/60 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
              <span className="absolute font-black text-sm text-[#071b34]">HN</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="HUNI Logo"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base truncate">
                Đăng Ký Báo Giá Nhanh
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-200/80 truncate">
                HUNI UNIFORM • Phản hồi trong 5 phút
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm overflow-y-auto">
            {/* Category */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 text-[11px] sm:text-xs">
                Dòng sản phẩm quan tâm:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              >
                <option value="polo">Áo Polo Doanh Nghiệp (Cá sấu / Cotton compact)</option>
                <option value="shirt">Áo Sơ Mi Công Sở (Sợi tre Bamboo / Kate Ý)</option>
                <option value="suit">Bộ Vest Doanh Nhân & Lãnh Đạo (Bespoke may đo)</option>
                <option value="golf">Đồng Phục Golf / Pickleball / Teambuilding</option>
                <option value="school">Đồng Phục Trường Học / Học Sinh - Sinh Viên</option>
                <option value="accessories">Phụ Kiện Doanh Nghiệp (Nón, Cặp da, Túi quà)</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 text-[11px] sm:text-xs">
                Số lượng may dự kiến:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-24 sm:w-28 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium">sản phẩm (Chiết khấu sỉ theo mốc)</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-[11px] sm:text-xs">
                  SĐT / Zalo nhận báo giá <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0984.xxx.xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-[11px] sm:text-xs">
                  Tên công ty / Cơ quan
                </label>
                <input
                  type="text"
                  placeholder="Công ty CP..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-[11px] sm:text-xs">
                  Yêu cầu thêm
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Cần may gấp trong 5 ngày, giao tại Hà Nội..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] sm:text-[11px] space-y-1">
              <div className="font-bold">Ưu đãi khi đăng ký ngay:</div>
              <div>✓ Miễn phí 100% thiết kế phối cảnh 3D theo nhận diện</div>
              <div>✓ Miễn phí may 01 áo mẫu thử duyệt form trước khi may loạt</div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Yêu Cầu Báo Giá</span>
            </button>
          </form>
        ) : (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#071b34]">GỬI YÊU CẦU THÀNH CÔNG!</h4>
            <p className="text-[11px] sm:text-xs text-slate-600 max-w-xs mx-auto">
              Chuyên viên tư vấn HUNI sẽ liên hệ đến số{" "}
              <strong>{phone}</strong> trong vòng 5 phút để gửi bảng báo giá kèm mẫu vải.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#071b34] text-amber-300 font-bold text-xs sm:text-sm rounded-xl active:scale-95 transition-transform"
            >
              Đóng cửa sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}