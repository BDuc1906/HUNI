"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { adminService } from "@/shared/services/apiClient";

const QUOTE_STATUS_OPTIONS = [
  { value: "NEW", label: "🔔 Mới tiếp nhận (NEW)" },
  { value: "CONTACTED", label: "📞 Đã liên hệ khách (CONTACTED)" },
  { value: "QUOTED", label: "📄 Đã gửi báo giá chi tiết (QUOTED)" },
  { value: "CONVERTED", label: "✅ Đã chốt đơn / chuyển đơn hàng (CONVERTED)" },
  { value: "CLOSED", label: "🔒 Đóng / không phát sinh đơn (CLOSED)" },
];

export default function QuoteUpdateModal({
  quote,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [status, setStatus] = useState("NEW");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (quote) {
      setStatus(quote.status || "NEW");
      setEstimatedPrice(quote.estimatedPrice ? String(quote.estimatedPrice) : "");
      setNotes(quote.notes || "");
      setErrorMessage("");
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        status,
        notes: notes.trim() || undefined,
      };

      if (estimatedPrice !== "") {
        const parsedPrice = parseInt(estimatedPrice, 10);
        if (!isNaN(parsedPrice) && parsedPrice >= 0) {
          payload.estimatedPrice = parsedPrice;
        }
      }

      const res = await adminService.updateQuoteStatus(quote.id, payload);

      if (res?.success) {
        if (onSuccess) {
          onSuccess(res.data);
        }
        onClose();
      } else {
        setErrorMessage(
          res?.error || "Không thể cập nhật báo giá. Vui lòng kiểm tra lại."
        );
      }
    } catch (err) {
      console.error("Error updating quote:", err);
      setErrorMessage("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Xử Lý Yêu Cầu Báo Giá
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Khách hàng: <span className="text-brand-600 font-semibold">{quote.fullName}</span> ({quote.phone})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Trạng thái xử lý <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
            >
              {QUOTE_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Báo giá đề xuất (VNĐ) <span className="text-slate-400 font-normal">(tuỳ chọn)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                disabled={loading}
                placeholder="Ví dụ: 12500000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono shadow-2xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                VNĐ
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Ghi chú tư vấn / phương án chất liệu
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              placeholder="Ghi chú lại nội dung đã trao đổi với khách, vải chọn, số lượng chốt, thời gian cần hàng..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
