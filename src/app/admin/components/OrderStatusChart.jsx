"use client";

import React, { useState } from "react";
import {
  Info,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

const MONTH_DATA = [
  { month: "JAN", existingBlocks: 2, newBlocks: 2, newUser: "1.2k", existingUser: "0.8k", revenue: "$4,200", revenueVND: "98.000.000đ" },
  { month: "FEB", existingBlocks: 3, newBlocks: 2, newUser: "1.8k", existingUser: "1.1k", revenue: "$6,500", revenueVND: "145.000.000đ" },
  { month: "MAR", existingBlocks: 5, newBlocks: 2, newUser: "2.4k", existingUser: "1.5k", revenue: "$9,800", revenueVND: "210.000.000đ" },
  { month: "APR", existingBlocks: 4, newBlocks: 3, newUser: "2.1k", existingUser: "1.3k", revenue: "$8,400", revenueVND: "185.000.000đ" },
  { month: "MAY", existingBlocks: 6, newBlocks: 3, newUser: "3.2k", existingUser: "1.6k", revenue: "$14,200", revenueVND: "320.000.000đ" },
  { month: "JUN", existingBlocks: 8, newBlocks: 4, newUser: "3.8k", existingUser: "1.8k", revenue: "$20,320", revenueVND: "460.000.000đ" },
  { month: "JUL", existingBlocks: 4, newBlocks: 2, newUser: "2.2k", existingUser: "1.2k", revenue: "$8,900", revenueVND: "195.000.000đ" },
  { month: "AUG", existingBlocks: 6, newBlocks: 3, newUser: "3.1k", existingUser: "1.5k", revenue: "$13,800", revenueVND: "305.000.000đ" },
  { month: "SEP", existingBlocks: 5, newBlocks: 2, newUser: "2.7k", existingUser: "1.4k", revenue: "$11,200", revenueVND: "250.000.000đ" },
  { month: "OCT", existingBlocks: 7, newBlocks: 4, newUser: "3.6k", existingUser: "1.7k", revenue: "$17,500", revenueVND: "385.000.000đ" },
  { month: "NOV", existingBlocks: 4, newBlocks: 3, newUser: "2.3k", existingUser: "1.3k", revenue: "$9,200", revenueVND: "205.000.000đ" },
  { month: "DEC", existingBlocks: 7, newBlocks: 3, newUser: "3.5k", existingUser: "1.7k", revenue: "$16,900", revenueVND: "375.000.000đ" },
];

const Y_TICKS = ["60k", "50k", "40k", "30k", "20k", "10k", "0k"];

export default function OrderStatusChart({ statusCounts = {} }) {
  const { theme, currentAccent } = useTheme();
  const isDark = theme === "dark";

  const [activePeriod, setActivePeriod] = useState("Monthly");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(5);
  const [currencyMode, setCurrencyMode] = useState("USD");

  const activeMonth = MONTH_DATA[selectedMonthIndex] || MONTH_DATA[5];
  const TOTAL_BLOCKS = 13;

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 relative border ${
        isDark
          ? "bg-[#131926] border-[#1E293B] text-white shadow-lg shadow-black/20"
          : "bg-white border-slate-200/80 text-slate-900 shadow-xs"
      }`}
    >
      {/* 1. Header: SALES TREND ⓘ  ... */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <h3
            className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            SALES TREND
          </h3>
          <button
            type="button"
            title="Thống kê doanh thu theo khối ma trận thời gian thực"
            className={`${
              isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút đổi tiền tệ */}
          <button
            type="button"
            onClick={() =>
              setCurrencyMode((prev) => (prev === "USD" ? "VND" : "USD"))
            }
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
              isDark
                ? "bg-[#1A2337] border-[#2B3B59] text-cyan-300 hover:border-cyan-400"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:text-black"
            }`}
          >
            {currencyMode === "USD" ? "$ USD (Mẫu ảnh)" : "₫ VNĐ (HDC)"}
          </button>

          <button
            type="button"
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-400 hover:text-slate-800"
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Sub-header: Total Revenue : $20,320   ● NEW USER   ● EXISTING USER   [Weekly | Monthly | Yearly] */}
      <div
        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3 border-t border-b border-dashed ${
          isDark ? "border-[#1E293B]" : "border-slate-200/80"
        }`}
      >
        {/* Left: Total Revenue */}
        <div className="flex items-baseline gap-2">
          <span
            className={`text-xs font-semibold ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Total Revenue :
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">
            {currencyMode === "USD"
              ? activeMonth.revenue
              : activeMonth.revenueVND}
          </span>
        </div>

        {/* Middle: Legend Items */}
        <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDark ? "bg-[#334155]" : "bg-[#94A3B8]"
              }`}
            />
            <span
              className={`text-[11px] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              NEW USER
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{
                backgroundColor: isDark
                  ? currentAccent.primaryDark
                  : currentAccent.primaryLight,
              }}
            />
            <span
              className={`text-[11px] font-extrabold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              EXISTING USER
            </span>
          </div>
        </div>

        {/* Right: Capsule Segmented Button [Weekly | Monthly | Yearly] */}
        <div
          className={`self-start md:self-auto p-1 rounded-xl flex items-center gap-1 border text-xs font-bold ${
            isDark
              ? "bg-[#0E131F] border-[#1E293B]"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          {["Weekly", "Monthly", "Yearly"].map((period) => {
            const isActive = activePeriod === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-[#1E293B] text-white shadow-xs"
                      : "bg-white text-slate-950 shadow-xs"
                    : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. THE SIGNATURE PIXEL BLOCK MATRIX COLUMN CHART */}
      <div className="relative pt-6 pb-2 select-none">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-10 pr-2 pt-6 pb-8">
          {Y_TICKS.map((tick, i) => (
            <div
              key={i}
              className="w-full flex items-center gap-2 text-[10px] font-mono"
            >
              <div
                className={`flex-1 border-b ${
                  isDark ? "border-[#1E293B]/70" : "border-slate-200/70"
                } border-dashed`}
              />
            </div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="relative flex items-stretch min-h-[290px] sm:min-h-[320px]">
          {/* Y-Axis Labels Column */}
          <div className="flex flex-col justify-between text-[11px] font-mono shrink-0 pr-3 pb-8 text-right w-9">
            {Y_TICKS.map((tick) => (
              <span
                key={tick}
                className={isDark ? "text-slate-400" : "text-slate-400"}
              >
                {tick}
              </span>
            ))}
          </div>

          {/* 12 Columns of Pixel Blocks */}
          <div className="flex-1 grid grid-cols-12 gap-1.5 sm:gap-2 md:gap-3 items-end relative pb-8">
            {MONTH_DATA.map((item, colIdx) => {
              const isSelected = selectedMonthIndex === colIdx;

              return (
                <div
                  key={item.month}
                  onClick={() => setSelectedMonthIndex(colIdx)}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer relative"
                >
                  {/* Vertical guideline for active month */}
                  {isSelected && (
                    <div
                      className={`absolute top-0 bottom-8 w-px border-l border-dashed pointer-events-none z-10 ${
                        isDark ? "border-cyan-400/60" : "border-slate-700/60"
                      }`}
                    >
                      {/* Target dot on guideline */}
                      <div
                        className="absolute top-1/3 -left-1 w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm"
                        style={{
                          backgroundColor: isDark
                            ? currentAccent.primaryDark
                            : currentAccent.primaryLight,
                        }}
                      />
                    </div>
                  )}

                  {/* FLOATING TOOLTIP CARD FOR ACTIVE MONTH */}
                  {isSelected && (
                    <div
                      className={`absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-xl p-3 shadow-2xl border text-xs min-w-[155px] animate-in fade-in zoom-in-95 duration-150 ${
                        isDark
                          ? "bg-[#182236] border-[#2A3B5C] text-white"
                          : "bg-white border-slate-200 text-slate-900 shadow-lg"
                      }`}
                    >
                      <div className="font-extrabold text-xs mb-2 flex items-center justify-between">
                        <span>{item.month} 2026</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isDark
                              ? currentAccent.bgActiveDark
                              : currentAccent.bgActiveLight
                          }`}
                        >
                          PRO
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDark ? "bg-[#475569]" : "bg-[#94A3B8]"
                              }`}
                            />
                            New User:
                          </span>
                          <span className="font-bold text-emerald-400">
                            {item.newUser}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: isDark
                                  ? currentAccent.primaryDark
                                  : currentAccent.primaryLight,
                              }}
                            />
                            Existing:
                          </span>
                          <span
                            className={`font-bold ${
                              isDark
                                ? currentAccent.activeTextDark
                                : "text-slate-900"
                            }`}
                          >
                            {item.existingUser}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STACK OF PIXEL RECTANGULAR BLOCKS */}
                  <div className="w-full flex flex-col justify-end gap-[3px] sm:gap-[4px] h-[220px] sm:h-[250px]">
                    {Array.from({ length: TOTAL_BLOCKS }).map((_, blockIdx) => {
                      const blockFromBottom = TOTAL_BLOCKS - 1 - blockIdx;
                      const isExisting = blockFromBottom < item.existingBlocks;
                      const isNew =
                        !isExisting &&
                        blockFromBottom <
                          item.existingBlocks + item.newBlocks;

                      let blockColor = "";
                      if (isExisting) {
                        blockColor = isDark
                          ? currentAccent.blockActiveDark
                          : currentAccent.blockActiveLight;
                      } else if (isNew) {
                        blockColor = isDark
                          ? "bg-[#253248] hover:bg-[#324361]"
                          : "bg-[#94A3B8] hover:bg-[#64748B]";
                      } else {
                        blockColor = isDark
                          ? "bg-[#182030] hover:bg-[#202B40]"
                          : "bg-[#F1F5F9] hover:bg-[#E2E8F0]";
                      }

                      return (
                        <div
                          key={blockIdx}
                          className={`w-full h-[12px] sm:h-[14px] rounded-[3px] transition-all duration-150 ${blockColor} ${
                            isSelected && isExisting
                              ? "ring-1 ring-white/30"
                              : ""
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* X-Axis Month Label at Bottom */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-center">
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors ${
                        isSelected
                          ? isDark
                            ? `font-black ${currentAccent.activeTextDark}`
                            : `font-black text-slate-950`
                          : isDark
                          ? "text-slate-400 hover:text-slate-200"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FLOATING CAROUSEL PILL ON CHART (< ● ● >) */}
        <div
          className={`absolute bottom-14 left-1/3 -translate-x-1/2 z-20 px-3 py-1 rounded-full flex items-center gap-2 border shadow-lg backdrop-blur-md ${
            isDark
              ? "bg-[#182236]/90 border-[#2A3B5C] text-slate-300"
              : "bg-white/95 border-slate-200 text-slate-700"
          }`}
        >
          <button
            type="button"
            onClick={() =>
              setSelectedMonthIndex((prev) =>
                prev > 0 ? prev - 1 : MONTH_DATA.length - 1
              )
            }
            className="hover:scale-110 transition-transform cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 px-1">
            <span
              className="w-2 h-2 rounded-full shadow-xs"
              style={{
                backgroundColor: isDark
                  ? currentAccent.primaryDark
                  : currentAccent.primaryLight,
              }}
            />
            <span
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-slate-600" : "bg-slate-300"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setSelectedMonthIndex((prev) =>
                prev < MONTH_DATA.length - 1 ? prev + 1 : 0
              )
            }
            className="hover:scale-110 transition-transform cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
