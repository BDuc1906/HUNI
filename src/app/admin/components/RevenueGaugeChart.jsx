import React from "react";
import { Target, TrendingUp } from "lucide-react";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function RevenueGaugeChart({ current = 0, target = 1, delta = 0 }) {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const radius = 80;
  const strokeWidth = 18;
  const cx = 120;
  const cy = 130;

  // Semi-circle: from 180° (left) to 0° (right), sweep 180°
  const circumference = Math.PI * radius;
  const dashArray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            MỤC TIÊU DOANH THU
          </span>
          <div className="text-xs text-slate-500 mt-1">Tháng 10/2026</div>
        </div>
        <div className="p-2 rounded-lg bg-[#0097B2]/10 border border-[#0097B2]/20">
          <Target className="w-4 h-4 text-[#0097B2]" />
        </div>
      </div>

      {/* Gauge SVG */}
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 240 140" className="w-full max-w-[280px]">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0097B2" />
              <stop offset="100%" stopColor="#66C5D8" />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dashArray}
          />

          {/* Center text */}
          <text
            x={cx}
            y={cy - 20}
            textAnchor="middle"
            className="fill-slate-900 font-black"
            style={{ fontSize: "32px", fontFamily: "monospace" }}
          >
            {percentage}%
          </text>
          <text
            x={cx}
            y={cy + 2}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            of target
          </text>
        </svg>
      </div>

      {/* Stats below gauge */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Đã đạt:</span>
          <span className="font-black text-slate-900 font-mono">
            {formatVND(current)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Mục tiêu:</span>
          <span className="font-bold text-[#0097B2] font-mono">
            {formatVND(target)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-slate-500">So với kỳ trước:</span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            +{delta}%
          </span>
        </div>
      </div>
    </div>
  );
}