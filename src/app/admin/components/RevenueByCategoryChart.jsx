"use client";

import React, { useState } from "react";
import { Layers } from "lucide-react";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function RevenueByCategoryChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((s, d) => s + d.revenue, 0);

  const radius = 65;
  const strokeWidth = 26;
  const center = 90;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const slices = data.map((item, i) => {
    const pct = total > 0 ? (item.revenue / total) * 100 : 0;
    const dashArray = `${(pct / 100) * circumference} ${circumference}`;
    const dashOffset = -((accumulated / 360) * circumference);
    accumulated += (pct / 100) * 360;
    return { ...item, percentage: pct, dashArray, dashOffset, index: i };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Doanh Thu Theo Danh Mục</h3>
            <p className="text-xs text-slate-500">Tỷ trọng đóng góp từng dòng sản phẩm</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          2026
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-5 flex-1">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            {slices.map((slice) => {
              const isHovered = hoveredIndex === slice.index;
              return (
                <circle
                  key={slice.category}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
                  strokeDasharray={slice.dashArray}
                  strokeDashoffset={slice.dashOffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(slice.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredIndex !== null ? (() => {
              const active = slices[hoveredIndex];
              return (
                <>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {Math.round(active.percentage)}%
                  </span>
                  <span className="text-[10px] text-slate-500 max-w-[100px] leading-tight mt-0.5">
                    {active.category}
                  </span>
                </>
              );
            })() : (
              <>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {formatVND(total)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Tổng cộng</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 w-full max-w-xs space-y-1.5">
          {slices.map((slice) => (
            <div
              key={slice.category}
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                hoveredIndex === slice.index ? "bg-slate-50" : ""
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-slate-600 font-medium truncate">{slice.category}</span>
              </div>
              <span className="font-bold text-slate-900 font-mono shrink-0 ml-2">
                {Math.round(slice.percentage)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}