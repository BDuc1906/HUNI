import React from "react";

export const ORDER_STATUS_MAP = {
  PENDING: {
    label: "⏳ Chờ xử lý",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  QUOTED: {
    label: "📋 Đã báo giá",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    dotClass: "bg-purple-400",
  },
  CONFIRMED: {
    label: "✅ Xác nhận",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dotClass: "bg-blue-400",
  },
  PRODUCING: {
    label: "🔧 Đang may",
    badgeClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dotClass: "bg-orange-400",
  },
  SHIPPED: {
    label: "🚚 Đã giao",
    badgeClass: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    dotClass: "bg-indigo-400",
  },
  COMPLETED: {
    label: "✔️ Hoàn thành",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-400",
  },
  CANCELLED: {
    label: "❌ Đã huỷ",
    badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    dotClass: "bg-rose-400",
  },
};

export default function OrderStatusBadge({ status, className = "" }) {
  const config = ORDER_STATUS_MAP[status] || {
    label: status || "Không xác định",
    badgeClass: "bg-slate-700/20 text-slate-300 border-slate-700/40",
    dotClass: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
}
