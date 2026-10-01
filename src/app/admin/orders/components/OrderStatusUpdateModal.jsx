"use client";

import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { adminService } from "@/shared/services/apiClient";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "⏳ Chờ xử lý (PENDING)" },
  { value: "QUOTED", label: "📋 Đã báo giá (QUOTED)" },
  { value: "CONFIRMED", label: "✅ Xác nhận đơn (CONFIRMED)" },
  { value: "PRODUCING", label: "🔧 Đang may / gia công (PRODUCING)" },
  { value: "SHIPPED", label: "🚚 Đã giao hàng (SHIPPED)" },
  { value: "COMPLETED", label: "✔️ Hoàn thành đơn hàng (COMPLETED)" },
  { value: "CANCELLED", label: "❌ Huỷ đơn hàng (CANCELLED)" },
];

export default function OrderStatusUpdateModal({
  order,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || "PENDING"
  );
  const [notes, setNotes] = useState(order?.notes || "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await adminService.updateOrderStatus(order.id, {
        status: selectedStatus,
        notes: notes.trim() || undefined,
      });

      if (res?.success) {
        if (onSuccess) {
          onSuccess(res.data);
        }
        onClose();
      } else {
        setErrorMessage(
          res?.error || "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại."
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setErrorMessage("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Cập Nhật Trạng Thái Đơn Hàng</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Mã đơn: <span className="text-blue-400 font-bold">{order.orderNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Chọn trạng thái mới <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Ghi chú nội bộ xưởng may (tuỳ chọn)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              placeholder="Nhập tiến độ cắt vải, in thêu logo, ngày xuất xưởng dự kiến..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Xác nhận cập nhật</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
