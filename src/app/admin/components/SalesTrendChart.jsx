"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TrendingUp } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function generateMockData() {
  const revenue = [42, 55, 48, 72, 60, 82, 78, 95, 88, 105, 98, 112];
  const orders =  [18, 22, 20, 28, 26, 34, 30, 38, 36, 42, 40, 46];
  return MONTHS.map((m, i) => ({ month: m, revenue: revenue[i], orders: orders[i] }));
}

export default function SalesTrendChart({ totalRevenue = "0đ", totalOrders = 0 }) {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentMonthIndex(new Date().getMonth());
  }, []);

  const data = useMemo(() => generateMockData(), []);
  const maxRev = Math.max(...data.map((d) => d.revenue)) * 1.15;
  const maxOrd = Math.max(...data.map((d) => d.orders)) * 1.15;
  const chartH = 240;
  const tabs = ["Weekly", "Monthly", "Yearly"];

  // Build line points
  const revPoints = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.revenue / maxRev) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const ordPoints = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.orders / maxOrd) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              SALES & ORDERS TREND
            </span>
            <span className="w-4 h-4 rounded-full bg-[#0097B2]/15 flex items-center justify-center">
              <TrendingUp className="w-2.5 h-2.5 text-[#0097B2]" />
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Doanh thu · <span className="text-slate-900 font-black font-mono text-base">{totalRevenue}</span>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold transition-all rounded-lg ${
                activeTab === tab ? "bg-white text-[#0097B2] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4 text-xs">
        <span className="flex items-center gap-2 text-slate-600 font-medium">
          <span className="w-3 h-0.5 rounded-full bg-[#0097B2]" /> Doanh thu
        </span>
        <span className="flex items-center gap-2 text-slate-600 font-medium">
          <span className="w-3 h-0.5 rounded-full bg-amber-500" /> Đơn hàng
        </span>
      </div>

      {/* Chart */}
      <div className="relative flex-1" style={{ minHeight: chartH + 40 }}>
        {/* Y grid */}
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: chartH }}>
          {[0, 25, 50, 75, 100].map((pct) => (
            <div
              key={pct}
              className="absolute w-full border-t border-dashed border-slate-100"
              style={{ top: `${100 - pct}%` }}
            >
              <span className="text-[10px] text-slate-300 font-mono absolute -left-1 -translate-y-2">
                {Math.round((pct / 100) * maxRev)}M
              </span>
            </div>
          ))}
        </div>

        {/* Line area */}
        <div className="absolute inset-x-10 top-0" style={{ height: chartH }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0097B2" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0097B2" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under revenue */}
            <polygon
              points={`0,100 ${revPoints} 100,100`}
              fill="url(#revGrad)"
            />

            {/* Revenue line */}
            <polyline
              points={revPoints}
              fill="none"
              stroke="#0097B2"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Orders line */}
            <polyline
              points={ordPoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Dots */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - (d.revenue / maxRev) * 100;
              const isCurrent = i === currentMonthIndex;
              const isHovered = hoveredIndex === i;
              return (
                <circle
                  key={`rev-${i}`}
                  cx={x}
                  cy={y}
                  r={isCurrent || isHovered ? "1.5" : "0.8"}
                  fill={isCurrent ? "#0097B2" : "white"}
                  stroke="#0097B2"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Hover columns */}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex-1 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === i && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xl text-[11px] whitespace-nowrap">
                      <div className="font-bold text-slate-900 mb-1">{d.month} 2026</div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-[#0097B2]" />
                        Doanh thu <span className="font-bold text-slate-900 ml-1">{d.revenue}M</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Đơn hàng <span className="font-bold text-slate-900 ml-1">{d.orders}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* X labels */}
        <div className="absolute inset-x-10 flex" style={{ top: chartH + 8 }}>
          {data.map((d, i) => (
            <div key={d.month} className="flex-1 text-center">
              <span className={`text-[10px] font-mono ${
                mounted && i === currentMonthIndex ? "text-[#0097B2] font-bold" : "text-slate-400"
              }`}>
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}