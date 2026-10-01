"use client";

import React from "react";
import { Plus, Trash2, Tag, TrendingDown } from "lucide-react";

function formatVND(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function WholesaleTiersEditor({
  tiers = [],
  basePrice = 0,
  onChange,
}) {
  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? (lastTier.max ? lastTier.max + 1 : lastTier.min + 50) : 10;
    const newMax = newMin + 49;
    const suggestedPrice = Math.max(
      10000,
      Math.round((basePrice > 0 ? basePrice * 0.9 : 150000) / 1000) * 1000
    );

    const newTier = {
      min: newMin,
      max: newMax,
      price: suggestedPrice,
      label: `${newMin} - ${newMax} chiếc`,
    };

    onChange([...tiers, newTier]);
  };

  const handleRemoveTier = (index) => {
    const updated = tiers.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChangeTier = (index, field, value) => {
    const updated = [...tiers];
    const current = { ...updated[index] };

    if (field === "min" || field === "price") {
      current[field] = parseInt(value, 10) || 0;
    } else if (field === "max") {
      current.max = value === "" ? null : parseInt(value, 10) || null;
    } else {
      current[field] = value;
    }

    // Tự động cập nhật nhãn nếu không chỉnh sửa thủ công
    if (field === "min" || field === "max") {
      const minVal = current.min || 0;
      const maxVal = current.max;
      current.label = maxVal ? `${minVal} - ${maxVal} chiếc` : `Từ ${minVal} chiếc trở lên`;
    }

    updated[index] = current;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" />
            <span>Bảng Giá Sỉ Theo Số Lượng (Wholesale Tiers)</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Áp dụng giá ưu đãi khi doanh nghiệp đặt may số lượng lớn
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddTier}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm mốc giá sỉ</span>
        </button>
      </div>

      {tiers.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
          Chưa thiết lập mốc giá sỉ nào. Bấm &quot;Thêm mốc giá sỉ&quot; để cài đặt.
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
          <div className="grid grid-cols-12 gap-2 p-3 border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase">
            <div className="col-span-3">Từ (Tối thiểu)</div>
            <div className="col-span-3">Đến (Tối đa)</div>
            <div className="col-span-3">Đơn giá (VNĐ)</div>
            <div className="col-span-2">Tiết kiệm</div>
            <div className="col-span-1 text-center">Xóa</div>
          </div>

          <div className="divide-y divide-slate-800/60 p-2 space-y-2">
            {tiers.map((tier, idx) => {
              const diff = basePrice > 0 ? basePrice - (tier.price || 0) : 0;
              const savingsPercent =
                basePrice > 0 && diff > 0 ? Math.round((diff / basePrice) * 100) : 0;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center py-1.5 text-xs"
                >
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="1"
                      value={tier.min || ""}
                      onChange={(e) => handleChangeTier(idx, "min", e.target.value)}
                      placeholder="VD: 10"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      min={tier.min || 1}
                      value={tier.max === null || tier.max === undefined ? "" : tier.max}
                      onChange={(e) => handleChangeTier(idx, "max", e.target.value)}
                      placeholder="Không GH"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={tier.price || ""}
                      onChange={(e) => handleChangeTier(idx, "price", e.target.value)}
                      placeholder="VD: 150000"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div className="col-span-2 text-[11px] font-mono">
                    {diff > 0 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 shrink-0" />
                        <span>-{savingsPercent}%</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Xóa mốc này"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
