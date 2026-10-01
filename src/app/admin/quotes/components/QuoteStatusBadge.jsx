import React from "react";

export const QUOTE_STATUS_MAP = {
  NEW: {
    label: "🔔 Mới",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    dotClass: "bg-sky-400",
  },
  CONTACTED: {
    label: "📞 Đã liên hệ",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  QUOTED: {
    label: "📄 Đã báo giá",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    dotClass: "bg-purple-400",
  },
  CONVERTED: {
    label: "✅ Chuyển đơn",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-400",
  },
  CLOSED: {
    label: "🔒 Đóng",
    badgeClass: "bg-slate-600/20 text-slate-400 border-slate-600/30",
    dotClass: "bg-slate-400",
  },
};

export default function QuoteStatusBadge({ status, className = "" }) {
  const config = QUOTE_STATUS_MAP[status] || {
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
