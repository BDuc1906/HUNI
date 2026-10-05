import React from "react";
import { Trophy } from "lucide-react";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function TopProductsChart({ products = [] }) {
  const maxSold = Math.max(...products.map((p) => p.sold), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Top 5 Sản Phẩm Bán Chạy</h3>
            <p className="text-xs text-slate-500">Xếp hạng theo số lượng bán ra</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Tháng này
        </span>
      </div>

      <div className="space-y-3.5 flex-1 flex flex-col justify-center">
        {products.map((product, idx) => {
          const pct = (product.sold / maxSold) * 100;
          const rankColors = ["#0097B2", "#33B0CB", "#66C5D8", "#99D9E5", "#CCECF2"];
          const color = rankColors[idx] || "#CCECF2";

          return (
            <div key={product.id}>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {product.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-slate-900 font-mono">
                    {product.sold}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatVND(product.revenue)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}