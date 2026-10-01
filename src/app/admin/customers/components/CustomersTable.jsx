"use client";

import React, { useState } from "react";
import {
  Users,
  Phone,
  Mail,
  Building2,
  Copy,
  Check,
  Crown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
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

export default function CustomersTable({
  customers = [],
  pagination = {},
  onPageChange,
  onSelectCustomer,
  loading = false,
}) {
  const { page = 1, totalPages = 1, total = 0 } = pagination;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyPhone = (e, customerId, phone) => {
    e.stopPropagation();
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedId(customerId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Đang tải danh sách khách hàng...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-50" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">
              Chưa có khách hàng nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không tìm thấy hồ sơ khách hàng phù hợp với điều kiện tìm kiếm.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Khách hàng</th>
                <th className="py-3.5 px-4 font-semibold">SĐT</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold text-center">Số đơn hàng</th>
                <th className="py-3.5 px-4 font-semibold text-center">Số báo giá</th>
                <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => {
                const isVip = (c.orderCount || 0) >= 5;

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCustomer(c)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Tên + công ty */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <span>{c.fullName}</span>
                        {isVip && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Crown className="w-2.5 h-2.5" />
                            <span>VIP</span>
                          </span>
                        )}
                      </div>
                      {c.company && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[150px]">{c.company}</span>
                        </div>
                      )}
                    </td>

                    {/* SĐT */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleCopyPhone(e, c.id, c.phone)}
                        className="font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
                        title="Click để copy SĐT"
                      >
                        <span>{c.phone || "—"}</span>
                        {copiedId === c.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500 opacity-60 group-hover:opacity-100" />
                        )}
                      </button>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {c.email || <span className="text-slate-500">—</span>}
                    </td>

                    {/* Số đơn */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {c.orderCount || 0}
                      </span>
                    </td>

                    {/* Số báo giá */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {c.quoteCount || 0}
                      </span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {formatDate(c.createdAt)}
                    </td>

                    {/* Hành động */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCustomer(c);
                        }}
                        className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 font-medium text-xs transition-colors"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Hiển thị <span className="font-bold text-white">{customers.length}</span>{" "}
          trên tổng số <span className="font-bold text-white">{total}</span> khách hàng
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-slate-300 px-2 font-medium">
            Trang {page} / {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
            aria-label="Trang tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
