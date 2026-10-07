"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Scissors,
  Truck,
  XCircle,
  FileCheck,
  Layers,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

const STATUS_CONFIGS = [
  {
    key: "pending",
    label: "Chờ xử lý",
    icon: Clock,
    colorHex: "#f59e0b",
    barColor: "bg-amber-500 hover:bg-amber-400",
    textClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    desc: "Đơn hàng mới tiếp nhận, chờ duyệt cọc & mẫu vải",
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
    icon: FileCheck,
    colorHex: "#0284c7",
    barColor: "bg-sky-500 hover:bg-sky-400",
    textClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
    desc: "Đã chốt hợp đồng và thông số may, xuất kho vật tư",
  },
  {
    key: "producing",
    label: "Đang may",
    icon: Scissors,
    colorHex: "#0097b2",
    barColor: "bg-[#0097b2] hover:bg-[#008299]",
    textClass: "text-[#0097b2]",
    bgClass: "bg-[#0097b2]/10 border-[#0097b2]/30",
    desc: "Đang trên chuyền cắt vải, thêu logo và may ráp hoàn thiện",
  },
  {
    key: "shipped",
    label: "Đang giao",
    icon: Truck,
    colorHex: "#6366f1",
    barColor: "bg-indigo-500 hover:bg-indigo-400",
    textClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
    desc: "Đã đóng gói hộp quà HDC, bàn giao đối tác vận chuyển",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    icon: CheckCircle2,
    colorHex: "#10b981",
    barColor: "bg-emerald-500 hover:bg-emerald-400",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    desc: "Khách hàng doanh nghiệp đã nhận hàng & nghiệm thu 100%",
  },
  {
    key: "cancelled",
    label: "Đã huỷ",
    icon: XCircle,
    colorHex: "#ef4444",
    barColor: "bg-rose-500 hover:bg-rose-400",
    textClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    desc: "Đơn huỷ do thay đổi kế hoạch hoặc trùng yêu cầu",
  },
];

const MONTHLY_DATA = [
  { month: "Tháng 5", count: 0, revenue: "0đ" },
  { month: "Tháng 6", count: 0, revenue: "0đ" },
  { month: "Tháng 7", count: 0, revenue: "0đ" },
  { month: "Tháng 8", count: 0, revenue: "0đ" },
  { month: "Tháng 9", count: 0, revenue: "0đ" },
  { month: "Tháng 10", count: 0, revenue: "0đ" },
];

export default function OrderStatusChart({ statusCounts = {} }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("status"); // 'status' | 'monthly'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const pending = Number(statusCounts.pending) || 0;
  const confirmed = Number(statusCounts.confirmed) || 0;
  const producing = Number(statusCounts.producing) || 0;
  const shipped = Number(statusCounts.shipped) || 0;
  const completed = Number(statusCounts.completed) || 0;
  const cancelled = Number(statusCounts.cancelled) || 0;

  const statusValues = {
    pending,
    confirmed,
    producing,
    shipped,
    completed,
    cancelled,
  };

  const total =
    pending + confirmed + producing + shipped + completed + cancelled;

  const yMax = 50;
  const yTicks = [50, 40, 30, 20, 10, 0];

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between ${
        isDark
          ? "bg-[#1E293B] border-slate-700/80 text-white shadow-md shadow-black/20"
          : "bg-white border-slate-200/90 text-slate-900 shadow-xs"
      }`}
    >
      {/* 1. Header Card: Tiêu đề + Chuyển tab xem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0097B2]/10 border border-[#0097B2]/20 flex items-center justify-center text-[#0097B2]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold tracking-tight">
              Biểu Đồ Cột Tiến Độ Sản Xuất & Đơn Hàng
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === "status"
              ? "Khối lượng đơn hàng phân bổ qua 6 công đoạn tại xưởng may HDC"
              : "Sản lượng hoàn tất và doanh thu qua 6 tháng gần nhất"}
          </p>
        </div>

        {/* Tab switcher: Theo Trạng Thái / Theo Tháng */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 border border-slate-200/60 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("status")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "status"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0097B2]" />
              <span>Theo Trạng Thái</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "monthly"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Theo Tháng</span>
            </button>
          </div>

          <span className="hidden lg:inline-flex px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-[#0097B2]">
            Tổng: {total} đơn
          </span>
        </div>
      </div>

      {/* 2. KHU VỰC VẼ BIỂU ĐỒ CỘT (COLUMN CHART CANVAS) */}
      <div className="relative my-6 select-none">
        {activeTab === "status" ? (
          /* ========================================================
             CHẾ ĐỘ 1: BIỂU ĐỒ CỘT 6 TRẠNG THÁI SẢN XUẤT XƯỞNG MAY
             ======================================================== */
          <div className="relative h-64 sm:h-72 w-full pt-6 pb-2">
            {/* Lưới đường kẻ ngang Y-Axis */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-8">
              {yTicks.map((val) => (
                <div
                  key={val}
                  className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400"
                >
                  <span className="w-6 text-right shrink-0">{val}</span>
                  <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-700/60" />
                </div>
              ))}
            </div>

            {/* Các cột đứng phân bổ trạng thái */}
            <div className="relative h-full pl-10 pr-2 flex items-end justify-between gap-2 sm:gap-4 md:gap-6 z-10">
              {STATUS_CONFIGS.map((item, idx) => {
                const count = statusValues[item.key] || 0;
                const percent =
                  total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                const heightPercent =
                  count > 0
                    ? Math.max(Math.min(Math.round((count / yMax) * 100), 100), 6)
                    : 0;
                const isHovered = hoveredIdx === idx;
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Tooltip khi rê chuột */}
                    {isHovered && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs w-60 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="font-bold">{item.label}</span>
                          <span className="ml-auto font-mono font-bold text-emerald-400">
                            {percent}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug mb-1.5">
                          {item.desc}
                        </p>
                        <div className="pt-1.5 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                          <span className="text-slate-400">Khối lượng:</span>
                          <span className="font-bold text-white">
                            {count} đơn hàng
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Con số trên đầu cột */}
                    <span
                      className={`mb-2 text-xs font-mono font-extrabold transition-all duration-200 ${
                        isHovered
                          ? "scale-110 text-[#0097B2]"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {count}
                    </span>

                    {/* Thân cột đứng có rãnh trượt mượt mà */}
                    <div className="w-full max-w-[56px] h-full flex flex-col justify-end items-center bg-slate-100/70 dark:bg-slate-800/60 rounded-2xl p-1 transition-colors">
                      <div
                        className={`w-full rounded-xl transition-all duration-500 ease-out relative ${
                          item.barColor
                        } ${
                          isHovered
                            ? "ring-2 ring-white shadow-lg"
                            : "shadow-xs"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        {/* Vệt bóng sáng trên đỉnh cột */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 rounded-t-xl" />

                        {/* Icon trạng thái ở đáy cột */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 opacity-75 group-hover:opacity-100 transition-opacity">
                          <Icon className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Nhãn chân cột */}
                    <div className="mt-3 text-center">
                      <span
                        className={`block text-[11px] sm:text-xs font-bold truncate max-w-[64px] sm:max-w-none transition-colors ${
                          isHovered
                            ? "text-slate-900 dark:text-white font-extrabold"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400 font-semibold">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================
             CHẾ ĐỘ 2: BIỂU ĐỒ CỘT SẢN LƯỢNG 6 THÁNG
             ======================================================== */
          <div className="relative h-64 sm:h-72 w-full pt-6 pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-8">
              {yTicks.map((val) => (
                <div
                  key={val}
                  className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400"
                >
                  <span className="w-6 text-right shrink-0">{val}</span>
                  <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-700/60" />
                </div>
              ))}
            </div>

            <div className="relative h-full pl-10 pr-2 flex items-end justify-between gap-3 sm:gap-6 z-10">
              {MONTHLY_DATA.map((item, idx) => {
                const heightPercent =
                  item.count > 0 ? Math.round((item.count / yMax) * 100) : 0;
                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={item.month}
                    className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {isHovered && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs w-52 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
                        <div className="font-extrabold mb-1">
                          {item.month} (2026)
                        </div>
                        <div className="font-mono text-[11px] space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span>Sản lượng:</span>
                            <span className="font-bold text-white">
                              {item.count} đơn
                            </span>
                          </div>
                          <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800 font-bold">
                            <span>Doanh số:</span>
                            <span>{item.revenue}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <span className="mb-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                      {item.count}
                    </span>

                    <div className="w-full max-w-[48px] h-full flex flex-col justify-end items-center bg-slate-100/70 dark:bg-slate-800/60 rounded-2xl p-1">
                      <div
                        className="w-full rounded-xl bg-gradient-to-t from-[#007F96] to-[#0097B2] hover:brightness-110 transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="mt-3 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. DÃY 4 THẺ CHỈ SỐ TIẾN ĐỘ CHÂN BIỂU ĐỒ */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tổng Đơn
            </div>
            <div className="text-base font-extrabold font-mono">{total} đơn</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-slate-400" />
        </div>

        <div className="p-3 rounded-xl bg-[#0097B2]/10 border border-[#0097B2]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#0097B2]">
              Đang May Tại Xưởng
            </div>
            <div className="text-base font-extrabold font-mono text-[#0097B2]">
              {producing} đơn
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#0097B2] animate-pulse" />
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Tỷ Lệ Hoàn Thành
            </div>
            <div className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {total > 0 ? ((completed / total) * 100).toFixed(0) : 0}%
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Chờ Duyệt Cọc
            </div>
            <div className="text-base font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {pending} đơn
            </div>
          </div>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
      </div>
    </div>
  );
}
