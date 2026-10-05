import React from "react";
import { Filter } from "lucide-react";

export default function FunnelB2BChart({ data = [] }) {
  const total = data[0]?.value || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#0097B2]/10 text-[#0097B2] border border-[#0097B2]/20">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Funnel Chuyển Đổi B2B</h3>
            <p className="text-xs text-slate-500">Hành trình từ báo giá → hoàn thành</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          30 ngày qua
        </span>
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {data.map((item, i) => (
          <div key={item.stage} className="relative">
            <div className="flex items-center gap-3">
              {/* Step number */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 text-white"
                style={{ backgroundColor: item.color }}
              >
                {i + 1}
              </div>

              {/* Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{item.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">Tỷ lệ chốt cuối:</span>
        <span className="font-black text-[#0097B2] font-mono text-base">
          {data[data.length - 1]?.percentage || 0}%
        </span>
      </div>
    </div>
  );
}