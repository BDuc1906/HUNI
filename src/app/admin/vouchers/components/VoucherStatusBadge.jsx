import React from "react";

export default function VoucherStatusBadge({ voucher }) {
  if (!voucher) return null;

  const isExpired = voucher.expiresAt && new Date(voucher.expiresAt) < new Date();
  const isExhausted =
    voucher.usageLimit !== null &&
    voucher.usageLimit !== undefined &&
    voucher.usedCount >= voucher.usageLimit;

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        <span>Hết hạn</span>
      </span>
    );
  }

  if (isExhausted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>Đã dùng hết</span>
      </span>
    );
  }

  if (!voucher.active) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700/25 text-slate-400 border border-slate-700/40">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span>Đã tắt</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      <span>Hoạt động</span>
    </span>
  );
}
