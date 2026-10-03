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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span>Hết hạn</span>
      </span>
    );
  }

  if (isExhausted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>Đã dùng hết</span>
      </span>
    );
  }

  if (!voucher.active) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span>Đã tắt</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span>Hoạt động</span>
    </span>
  );
}
