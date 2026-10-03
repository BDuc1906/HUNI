import React from "react";

export default function StatsCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBgColor = "bg-brand-50",
  iconTextColor = "text-brand-600",
  borderColor = "border-slate-200/80",
  trend,
}) {
  return (
    <div
      className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0 border border-slate-100 shadow-xs`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
          {value}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{subtext}</span>
          {trend && (
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                trend.isPositive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {trend.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
