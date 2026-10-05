import React from "react";
import { MoreHorizontal, TrendingUp } from "lucide-react";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function RevenuePanel({ totalRevenue = 0 }) {
  const bars = [40, 55, 45, 70, 60, 85, 78, 92, 88, 95, 82, 90];
  const maxH = Math.max(...bars);
  const currentIdx = new Date().getMonth();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            REVENUE
          </span>
          <div className="text-xs text-slate-500 mt-1">Doanh thu 12 tháng</div>
        </div>
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Big number */}
      <div className="mb-5">
        <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight leading-none">
          {formatVND(totalRevenue)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3" /> +12.5%
          </span>
          <span className="text-slate-400">vs last year</span>
        </div>
      </div>

      {/* Vertical bar chart (kiểu ảnh mẫu) */}
      <div className="flex-1 flex items-end gap-1 mt-auto min-h-[140px]">
        {bars.map((h, i) => {
          const isCurrent = i === currentIdx;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-md transition-all hover:opacity-80"
              style={{
                height: `${(h / maxH) * 100}%`,
                backgroundColor: isCurrent ? "#0097B2" : "#0097B230",
                boxShadow: isCurrent ? "0 0 12px #0097B240" : undefined,
              }}
              title={`Tháng ${i + 1}`}
            />
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </div>
  );
}