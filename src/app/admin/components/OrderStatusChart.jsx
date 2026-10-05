"use client";

import React, { useState } from "react";
import { PieChart } from "lucide-react";

const STATUS_CONFIG = [
  { key: "pending",   label: "Chờ xử lý",  color: "#f59e0b" },
  { key: "producing", label: "Đang may",   color: "#0097B2" },
  { key: "completed", label: "Hoàn thành", color: "#10b981" },
  { key: "cancelled", label: "Đã huỷ",     color: "#ef4444" },
];

export default function OrderStatusChart({ statusCounts = {} }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  const data = STATUS_CONFIG.map((cfg) => ({
    ...cfg,
    count: Number(statusCounts[cfg.key]) || 0,
  }));

  const total = data.reduce((sum, item) => sum + item.count, 0);

  let accumulatedAngle = 0;
  const radius = 65;
  const strokeWidth = 22;
  const center = 90;
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Trạng Thái Đơn Hàng</h3>
            <p className="text-xs text-slate-500">Phân bổ theo quy trình sản xuất</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
          {total} đơn
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-5 flex-1">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            {total > 0 && slices.map((slice) => {
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

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredKey ? (() => {
              const active = slices.find((s) => s.key === hoveredKey);
              return (
                <>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">{active?.count}</span>
                  <span className="text-[11px] text-slate-500">{active?.label}</span>
                  <span className="text-[10px] font-bold" style={{ color: active?.color }}>
                    {active?.percentage}%
                  </span>
                </>
              );
            })() : (
              <>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">{total}</span>
                <span className="text-xs text-slate-500 font-medium">Đơn</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 w-full max-w-xs space-y-1.5">
          {slices.map((slice) => (
            <div
              key={slice.key}
              onMouseEnter={() => setHoveredKey(slice.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                hoveredKey === slice.key ? "bg-slate-50 border-slate-200" : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-slate-600 font-medium">{slice.label}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="font-bold text-slate-900">{slice.count}</span>
                <span className="text-slate-400 w-8 text-right">
                  {total > 0 ? `${slice.percentage}%` : "0%"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}