import React from "react";

export const QUOTE_STATUS_MAP = {
  NEW: {
    label: "🔔 Mới tiếp nhận",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200/80",
    dotClass: "bg-sky-500",
  },
  CONTACTED: {
    label: "📞 Đã liên hệ",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
  },
  QUOTED: {
    label: "📄 Đã báo giá",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200/80",
    dotClass: "bg-purple-500",
  },
  CONVERTED: {
    label: "✅ Đã chốt đơn",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  CLOSED: {
    label: "🔒 Đã đóng",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export default function QuoteStatusBadge({ status, className = "" }) {
  const config = QUOTE_STATUS_MAP[status] || {
    label: status || "Không xác định",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
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
