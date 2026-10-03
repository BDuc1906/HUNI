"use client";

import React, { useState } from "react";
import { X, Tag, Sparkles, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { adminService } from "@/shared/services/apiClient";

function formatVND(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function CreateVoucherModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage"); // "percentage" | "fixed"
  const [discount, setDiscount] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""));
  };

  // Preview real-time
  const previewText = () => {
    const codeName = code || "HUNIXXXX";
    const discountVal = discount ? (type === "percentage" ? `${discount}%` : formatVND(parseInt(discount, 10))) : "X";
    const maxVal = type === "percentage" && maxDiscount ? ` tối đa ${formatVND(parseInt(maxDiscount, 10))}` : "";
    const minVal = minOrder ? ` cho đơn từ ${formatVND(parseInt(minOrder, 10))}` : " cho mọi đơn hàng";
    const expVal = expiresAt
      ? `, hiệu lực đến ${new Intl.DateTimeFormat("vi-VN").format(new Date(expiresAt))}`
      : ", không giới hạn thời gian";

    return `Voucher ${codeName}: Giảm ${discountVal}${maxVal}${minVal}${expVal}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!code || code.trim().length < 2) {
      setErrorMessage("Mã voucher phải có ít nhất 2 ký tự");
      return;
    }

    const discountNum = parseInt(discount, 10);
    if (!discountNum || discountNum <= 0) {
      setErrorMessage("Mức giảm giá phải lớn hơn 0");
      return;
    }

    if (type === "percentage" && discountNum > 100) {
      setErrorMessage("Giảm giá theo phần trăm không thể vượt quá 100%");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        type,
        discount: discountNum,
        minOrder: minOrder ? parseInt(minOrder, 10) : 0,
        maxDiscount: type === "percentage" && maxDiscount ? parseInt(maxDiscount, 10) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        active,
      };

      const res = await adminService.createVoucher(payload);
      if (res?.success) {
        if (onSuccess) {
          onSuccess(res.data);
        }
        onClose();
      } else {
        setErrorMessage(res?.error || "Không thể tạo mã voucher. Vui lòng kiểm tra lại.");
      }
    } catch (err) {
      console.error("Error creating voucher:", err);
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
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tạo Mã Voucher Mới</h3>
              <p className="text-xs text-slate-500">Thiết lập chiết khấu cho khách hàng</p>
            </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Real-time preview */}
          <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-start gap-2.5 text-xs text-brand-900">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-brand-800 block text-[11px] uppercase">
                Bản xem trước voucher:
              </span>
              <span className="mt-0.5 block">{previewText()}</span>
            </div>
          </div>

          {/* Mã voucher */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mã voucher <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="VD: HUNI2026, VIP10, CHAOHOPDONG"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-mono font-bold text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
            />
          </div>

          {/* Loại giảm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hình thức giảm giá <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  type === "percentage"
                    ? "bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="voucherType"
                  value="percentage"
                  checked={type === "percentage"}
                  onChange={() => setType("percentage")}
                  className="hidden"
                />
                <span>Theo phần trăm (%)</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  type === "fixed"
                    ? "bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="voucherType"
                  value="fixed"
                  checked={type === "fixed"}
                  onChange={() => setType("fixed")}
                  className="hidden"
                />
                <span>Số tiền cố định (đ)</span>
              </label>
            </div>
          </div>

          {/* Mức giảm & Giảm tối đa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mức giảm {type === "percentage" ? "(%)" : "(VNĐ)"}{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={type === "percentage" ? 100 : undefined}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder={type === "percentage" ? "VD: 10" : "VD: 200000"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
              />
            </div>

            {type === "percentage" ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="VD: 500000 (để trống: vô hạn)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giới hạn lượt dùng
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="Để trống = Không giới hạn"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* Đơn hàng tối thiểu & Hết hạn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="VD: 1000000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Ngày hết hạn (tuỳ chọn)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Kích hoạt ngay */}
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Kích hoạt ngay</span>
              <span className="text-[11px] text-slate-500">
                Cho phép khách áp dụng mã ngay khi đặt hàng
              </span>
            </div>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
            />
          </label>

          {/* Footer buttons */}
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
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Tạo mã voucher</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
