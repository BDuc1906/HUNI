"use client";

import React, { useState } from "react";

const STATUS_CONFIG = [
  {
    key: "pending",
    label: "Chờ xử lý",
    color: "#f59e0b", // amber-500
    bgClass: "bg-amber-500",
    textClass: "text-amber-600",
  },
  {
    key: "producing",
    label: "Đang may",
    color: "#0097b2", // HDC Teal
    bgClass: "bg-brand-500",
    textClass: "text-brand-600",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    color: "#10b981", // emerald-500
    bgClass: "bg-emerald-500",
    textClass: "text-emerald-600",
  },
  {
    key: "cancelled",
    label: "Đã huỷ",
    color: "#ef4444", // rose-500
    bgClass: "bg-rose-500",
    textClass: "text-rose-600",
  },
];

export default function OrderStatusChart({ statusCounts = {} }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  const pending = Number(statusCounts.pending) || 0;
  const producing = Number(statusCounts.producing) || 0;
  const completed = Number(statusCounts.completed) || 0;
  const cancelled = Number(statusCounts.cancelled) || 0;

  const total = pending + producing + completed + cancelled;

  const data = [
    { ...STATUS_CONFIG[0], count: pending },
    { ...STATUS_CONFIG[1], count: producing },
    { ...STATUS_CONFIG[2], count: completed },
    { ...STATUS_CONFIG[3], count: cancelled },
  ];

  // Tính toán góc cho SVG Donut Chart
  let accumulatedAngle = 0;
  const radius = 70;
  const strokeWidth = 24;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  const slices = data.map((item) => {
    const percentage = total > 0 ? (item.count / total) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedAngle / 360) * circumference);
    accumulatedAngle += (percentage / 100) * 360;

    return {
      ...item,
      percentage: Math.round(percentage),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Phân Bổ Trạng Thái Đơn Hàng</span>
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200/60">
            Tổng: {total} đơn
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Tỷ lệ đơn hàng theo quy trình xử lý tại xưởng may HDC
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Donut Chart */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 200 200"
            role="img"
            aria-label="Biểu đồ phân bổ trạng thái đơn hàng"
          >
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {total > 0 &&
              slices.map((slice) => {
                if (slice.count === 0) return null;
                const isHovered = hoveredKey === slice.key;
                return (
                  <circle
                    key={slice.key}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredKey(slice.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                );
              })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredKey ? (
              (() => {
                const active = slices.find((s) => s.key === hoveredKey);
                return (
                  <>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {active?.count}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 max-w-[80px] truncate">
                      {active?.label}
                    </span>
                    <span className="text-[10px] text-brand-600 font-bold">
                      {active?.percentage}%
                    </span>
                  </>
                );
              })()
            ) : (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {total}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Đơn Hàng
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full max-w-xs space-y-2.5">
          {slices.map((slice) => {
            const isHovered = hoveredKey === slice.key;
            return (
              <div
                key={slice.key}
                onMouseEnter={() => setHoveredKey(slice.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                  isHovered ? "bg-slate-50 border-slate-200" : "border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full ${slice.bgClass} shadow-xs`}
                  />
                  <span className="text-slate-700 font-medium">
                    {slice.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="font-bold text-slate-900">{slice.count}</span>
                  <span className="text-slate-400 w-8 text-right">
                    {total > 0 ? `${slice.percentage}%` : "0%"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Cập nhật theo thời gian thực</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Đồng bộ tự động
        </span>
      </div>
    </div>
  );
}
