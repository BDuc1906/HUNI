import React from "react";

export const ORDER_STATUS_MAP = {
  PENDING: {
    label: "⏳ Chờ xử lý",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
    dotClass: "bg-amber-500",
  },
  QUOTED: {
    label: "📋 Đã báo giá",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200 font-semibold",
    dotClass: "bg-purple-500",
  },
  CONFIRMED: {
    label: "✅ Xác nhận",
    badgeClass: "bg-brand-50 text-brand-700 border-brand-200 font-semibold",
    dotClass: "bg-brand-600",
  },
  PRODUCING: {
    label: "🔧 Đang may",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200 font-semibold",
    dotClass: "bg-orange-500",
  },
  SHIPPED: {
    label: "🚚 Đã giao",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold",
    dotClass: "bg-indigo-500",
  },
  COMPLETED: {
    label: "✔️ Hoàn thành",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    dotClass: "bg-emerald-500",
  },
  CANCELLED: {
    label: "❌ Đã huỷ",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
    dotClass: "bg-rose-500",
  },
};

export default function OrderStatusBadge({ status, className = "" }) {
  const config = ORDER_STATUS_MAP[status] || {
    label: status || "Không xác định",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200 font-medium",
    dotClass: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${config.badgeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
}
