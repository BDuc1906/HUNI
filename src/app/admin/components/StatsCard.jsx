"use client";

import React from "react";
import { TrendingUp, ArrowUp } from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

const DEFAULT_BAR_HEIGHTS = [25, 40, 35, 60, 50, 75, 95, 80, 100];

export default function StatsCard({
  title,
  value,
  subtext,
  trend = { isPositive: true, label: "+14.8% tuần này" },
  sparkHeights = DEFAULT_BAR_HEIGHTS,
  accentColor = "teal",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 relative border flex flex-col justify-between ${
        isDark
          ? "bg-[#1E293B] border-slate-700/80 text-white shadow-md shadow-black/20"
          : "bg-white border-slate-200/90 text-slate-900 shadow-xs hover:border-slate-300"
      }`}
    >
      {/* Top Row: Title + Mini Spark-bars */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
        </div>

        {/* Mini Sparkline Vertical Bars */}
        <div className="flex items-end gap-[3px] h-9 pt-2 shrink-0">
          {sparkHeights.map((h, i) => {
            const isHighlighted = i >= sparkHeights.length - 3;
            let barBg = "";
            if (isHighlighted) {
              barBg = "bg-[#0097B2] shadow-xs shadow-[#0097B2]/30";
            } else {
              barBg = isDark ? "bg-slate-700" : "bg-slate-200";
            }

            return (
              <div
                key={i}
                className={`w-[2.5px] rounded-full transition-all duration-300 ${barBg}`}
                style={{ height: `${Math.max(h, 15)}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Subtext + Trend */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
          {subtext}
        </span>

        {trend && (
          <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
            <ArrowUp className="w-3 h-3 stroke-[3]" />
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
