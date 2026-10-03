"use client";

import React from "react";
import { Plus, Trash2, Palette } from "lucide-react";

export default function ColorEditor({ colors = [], onChange }) {
  const handleAddColor = () => {
    const newColor = {
      name: "Xanh HDC Teal",
      code: "#0097b2",
    };
    onChange([...colors, newColor]);
  };

  const handleRemoveColor = (index) => {
    const updated = colors.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...colors];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-brand-600" />
          <span>Bảng Màu Sắc ({colors.length})</span>
        </label>
        <button
          type="button"
          onClick={handleAddColor}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm màu</span>
        </button>
      </div>

      {colors.length === 0 ? (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
          Chưa thêm màu sắc nào.
        </div>
      ) : (
        <div className="space-y-2">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200"
            >
              {/* Color swatch picker */}
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-300 shadow-2xs">
                <input
                  type="color"
                  value={color.code || "#000000"}
                  onChange={(e) => handleChange(idx, "code", e.target.value)}
                  className="absolute -inset-2 w-12 h-12 cursor-pointer border-0 p-0"
                />
              </div>

              {/* Tên màu */}
              <input
                type="text"
                value={color.name || ""}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                placeholder="Tên màu (VD: Xanh Navy)"
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-500 shadow-2xs"
              />

              {/* Mã Hex */}
              <span className="text-[11px] font-mono text-slate-500 uppercase w-16">
                {color.code}
              </span>

              {/* Nút xoá */}
              <button
                type="button"
                onClick={() => handleRemoveColor(idx)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Xóa màu"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
