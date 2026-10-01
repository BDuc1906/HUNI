import React from "react";

export default function StatsCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBgColor = "bg-blue-500/10",
  iconTextColor = "text-blue-400",
  borderColor = "border-slate-800",
  trend,
}) {
  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/90 border ${borderColor} shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0 border border-white/5`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          {value}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{subtext}</span>
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
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
