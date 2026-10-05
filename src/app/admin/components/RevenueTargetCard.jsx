"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

export default function RevenueTargetCard() {
  const { theme, currentAccent } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between ${
        isDark
          ? "bg-[#131926] border-[#1E293B] text-white shadow-lg shadow-black/20"
          : "bg-white border-slate-200/80 text-slate-900 shadow-xs"
      }`}
    >
      <div>
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b border-dashed ${
            isDark ? "border-[#1E293B]" : "border-slate-200/80"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            REVENUE TARGET
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              isDark
                ? currentAccent.bgActiveDark
                : currentAccent.bgActiveLight
            }`}
          >
            88% Done
          </span>
        </div>

        {/* Big Target Number */}
        <div className="mt-4">
          <span
            className={`text-[11px] font-medium block ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Revenue Target (Q4)
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight mt-1">
            $24,000
          </div>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Achieved $20,320 of total quarterly goal
          </p>
        </div>

        {/* Vertical Target Comparison Bars */}
        <div
          className={`mt-6 flex items-end justify-between gap-2 h-36 px-3 pt-4 rounded-xl border border-dashed ${
            isDark
              ? "bg-[#0E131F]/80 border-[#1E293B]"
              : "bg-slate-50/70 border-slate-200"
          }`}
        >
          {[
            { label: "1 JAN", height: 45, highlighted: false },
            { label: "1 APR", height: 60, highlighted: false },
            { label: "1 JUL", height: 75, highlighted: false },
            { label: "1 OCT", height: 95, highlighted: true },
          ].map((bar, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                className={`w-2.5 sm:w-3 rounded-full transition-all duration-500 ${
                  bar.highlighted
                    ? isDark
                      ? `${currentAccent.barAccentDark} shadow-md ${currentAccent.glow}`
                      : currentAccent.barAccentLight
                    : isDark
                    ? "bg-[#1E293B]"
                    : "bg-slate-300"
                }`}
                style={{ height: `${bar.height}%` }}
              />
              <span
                className={`mt-2 text-[10px] font-mono whitespace-nowrap ${
                  bar.highlighted
                    ? isDark
                      ? `${currentAccent.activeTextDark} font-bold`
                      : "text-slate-900 font-bold"
                    : isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button: View Forecast Report */}
      <div
        className={`mt-6 pt-3 border-t border-dashed ${
          isDark ? "border-[#1E293B]" : "border-slate-200/80"
        }`}
      >
        <button
          type="button"
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isDark
              ? "bg-[#1E293B] hover:bg-[#283852] text-white border border-[#2D3E5E]"
              : "bg-slate-900 hover:bg-black text-white shadow-xs"
          }`}
        >
          <span>View Forecast Report</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
