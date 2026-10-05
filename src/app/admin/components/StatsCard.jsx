import React from "react";
import { BarChart3 } from "lucide-react";

export default function StatsCard({
  title,
  value,
  subValue,
  trendValue,
  trendDirection = "up",
  trendLabel = "last year",
  accentColor = "#0097B2",
  sparkline = [35, 55, 40, 70, 55, 85, 65, 90],
}) {
  const isUp = trendDirection === "up";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-[#0097B2]/40 hover:shadow-lg hover:shadow-[#0097B2]/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <BarChart3 className="w-4 h-4" style={{ color: accentColor }} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap mb-2">
        <span className="text-2xl sm:text-[26px] font-black text-slate-900 font-mono tracking-tight">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-400 font-medium">{subValue}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span className={`inline-flex items-center gap-0.5 font-bold ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
          {isUp ? "▲" : "▼"} {trendValue}
        </span>
        <span className="text-slate-400">{trendLabel}</span>
      </div>

      <div className="mt-4 flex items-end gap-1 h-4">
        {sparkline.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              backgroundColor: accentColor,
              opacity: 0.15 + i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}