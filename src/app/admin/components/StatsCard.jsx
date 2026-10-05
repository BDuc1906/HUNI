"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

const DEFAULT_BAR_HEIGHTS = [20, 35, 45, 30, 60, 50, 75, 95, 80, 100];

export default function StatsCard({
  title = "TOTAL REVENUE",
  value = "$20,320",
  unit = "",
  trend = { isPositive: true, label: "+0,94% last year" },
  sparkHeights = DEFAULT_BAR_HEIGHTS,
}) {
  const { theme, currentAccent } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 relative border flex flex-col justify-between ${
        isDark
          ? "bg-[#131926] border-[#1E293B] text-white hover:border-[#2A3B5C] shadow-lg shadow-black/20"
          : "bg-white border-slate-200/80 text-slate-900 shadow-xs hover:border-slate-300"
      }`}
    >
      {/* Top Row: Title on Left + Mini Spark-bars on Right */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`text-[11px] font-bold uppercase tracking-widest ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-sans tracking-tight flex items-baseline gap-1.5">
            <span>{value}</span>
            {unit && (
              <span
                className={`text-xs font-medium font-sans ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Mini Sparkline Vertical Bars */}
        <div className="flex items-end gap-[3px] h-10 pt-2 shrink-0">
          {sparkHeights.map((h, i) => {
            const isHighlighted = i >= sparkHeights.length - 3;
            let barBg = "";
            if (isHighlighted) {
              barBg = isDark
                ? currentAccent.barAccentDark
                : currentAccent.barAccentLight;
            } else {
              barBg = isDark ? "bg-[#1E293B]" : "bg-slate-200";
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

      {/* Bottom Row: Circle Arrow Up (↑) + Percentage */}
      <div
        className={`mt-5 pt-3 border-t border-dashed flex items-center justify-between ${
          isDark ? "border-[#1E293B]" : "border-slate-200/80"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
              isDark
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            <ArrowUp className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-500">
            {trend?.label || "+0,94% last year"}
          </span>
        </div>

        <span
          className={`text-[10px] font-mono ${
            isDark ? "text-slate-400" : "text-slate-400"
          }`}
        >
          YoY Growth
        </span>
      </div>
    </div>
  );
}
