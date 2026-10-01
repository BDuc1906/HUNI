"use client";

import React, { useState } from "react";
import { Tag, Copy, Check, Power, AlertCircle, Loader2 } from "lucide-react";
import VoucherStatusBadge from "./VoucherStatusBadge";

function formatVND(amount) {
  if (typeof amount !== "number" || amount === 0) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatDate(dateStr) {
  if (!dateStr) return "Không HH";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "—";
  }
}

export default function VouchersTable({
  vouchers = [],
  onToggleActive,
  loading = false,
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (v) => {
    if (v.usedCount > 10 && v.active) {
      if (!confirm(`Voucher ${v.code} đang có ${v.usedCount} lượt dùng. Bạn có chắc muốn tắt không?`)) {
        return;
      }
    }

    setTogglingId(v.id);
    try {
      if (onToggleActive) {
        await onToggleActive(v);
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Đang tải danh sách voucher...</span>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Tag className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-50" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">
              Chưa có mã voucher nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bấm &quot;Tạo voucher mới&quot; để thiết lập chương trình ưu đãi đầu tiên.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Mã voucher</th>
                <th className="py-3.5 px-4 font-semibold">Loại</th>
                <th className="py-3.5 px-4 font-semibold">Mức giảm</th>
                <th className="py-3.5 px-4 font-semibold">Đơn tối thiểu</th>
                <th className="py-3.5 px-4 font-semibold">Giảm tối đa</th>
                <th className="py-3.5 px-4 font-semibold text-center">Đã dùng / Giới hạn</th>
                <th className="py-3.5 px-4 font-semibold">Hết hạn</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vouchers.map((v) => {
                const isToggling = togglingId === v.id;

                return (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Mã voucher */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleCopy(v.code)}
                        className="font-mono font-bold text-white hover:text-blue-400 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 transition-colors"
                        title="Click để copy mã"
                      >
                        <span>{v.code}</span>
                        {copiedCode === v.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:opacity-100 shrink-0" />
                        )}
                      </button>
                    </td>

                    {/* Loại */}
                    <td className="py-3.5 px-4">
                      {v.type === "percentage" ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/25 text-[11px] font-semibold">
                          % Phần trăm
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/25 text-[11px] font-semibold">
                          VNĐ Cố định
                        </span>
                      )}
                    </td>

                    {/* Mức giảm */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {v.type === "percentage" ? `${v.discount}%` : formatVND(v.discount)}
                    </td>

                    {/* Đơn tối thiểu */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {v.minOrder > 0 ? formatVND(v.minOrder) : "Không GH"}
                    </td>

                    {/* Giảm tối đa */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {v.maxDiscount ? formatVND(v.maxDiscount) : "—"}
                    </td>

                    {/* Đã dùng / Giới hạn */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs">
                      <span className="font-bold text-white">{v.usedCount}</span>
                      <span className="text-slate-500"> / </span>
                      <span className="text-slate-400">
                        {v.usageLimit !== null && v.usageLimit !== undefined
                          ? v.usageLimit
                          : "∞"}
                      </span>
                    </td>

                    {/* Hết hạn */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {formatDate(v.expiresAt)}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      <VoucherStatusBadge voucher={v} />
                    </td>

                    {/* Hành động */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggle(v)}
                        disabled={isToggling}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                          v.active
                            ? "bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700"
                            : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Power className="w-3.5 h-3.5" />
                        )}
                        <span>{v.active ? "Tắt" : "Bật"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-center justify-between">
        <span>Tổng cộng: <strong className="text-white">{vouchers.length}</strong> voucher</span>
        <span className="text-[11px] text-slate-400">Click vào mã để sao chép nhanh</span>
      </div>
    </div>
  );
}
