"use client";

import React, { useState } from "react";
import {
  FileText,
  Phone,
  Copy,
  Check,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit,
} from "lucide-react";
import QuoteStatusBadge from "./QuoteStatusBadge";

function formatVND(amount) {
  if (typeof amount !== "number" || amount === 0) return "—";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "—";
  }
}

const CATEGORY_NAMES = {
  polo: "Áo Polo",
  shirt: "Sơ Mi",
  vest: "Vest / Suit",
  golf: "Golf",
  school: "Trường Học",
  accessories: "Phụ Kiện",
  corporate: "Doanh Nghiệp",
};

export default function QuotesTable({
  quotes = [],
  pagination = {},
  onPageChange,
  onSelectQuote,
  onOpenUpdateModal,
  loading = false,
}) {
  const { page = 1, totalPages = 1, total = 0 } = pagination;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyPhone = (e, quoteId, phone) => {
    e.stopPropagation();
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedId(quoteId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Đang tải danh sách báo giá...</span>
          </div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-50" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">
              Chưa có yêu cầu báo giá nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không tìm thấy yêu cầu báo giá phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Khách hàng</th>
                <th className="py-3.5 px-4 font-semibold">SĐT</th>
                <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                <th className="py-3.5 px-4 font-semibold text-center">Số lượng</th>
                <th className="py-3.5 px-4 font-semibold">Báo giá KH</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold">Ngày gửi</th>
                <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {quotes.map((quote) => {
                const customer = quote.customer || {};
                const customerName =
                  customer.fullName || quote.fullName || "Khách hàng";
                const company = customer.company || quote.company;
                const phone = customer.phone || quote.phone;
                const categoryLabel =
                  CATEGORY_NAMES[quote.category?.toLowerCase()] ||
                  quote.category ||
                  "Đồng phục";
                const isNew = quote.status === "NEW";

                return (
                  <tr
                    key={quote.id}
                    onClick={() => onSelectQuote(quote)}
                    className={`transition-colors cursor-pointer group ${
                      isNew
                        ? "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Khách hàng */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>{customerName}</span>
                        {isNew && (
                          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        )}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[130px]">{company}</span>
                        </div>
                      )}
                    </td>

                    {/* SĐT */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleCopyPhone(e, quote.id, phone)}
                        className="font-mono font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
                        title="Click để copy SĐT"
                      >
                        <span>{phone || "—"}</span>
                        {copiedId === quote.id ? (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500 opacity-60 group-hover:opacity-100 shrink-0" />
                        )}
                      </button>
                    </td>

                    {/* Danh mục */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60">
                        {categoryLabel}
                      </span>
                    </td>

                    {/* Số lượng */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {quote.quantity} chiếc
                    </td>

                    {/* Báo giá KH */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {formatVND(quote.estimatedPrice)}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      <QuoteStatusBadge status={quote.status} />
                    </td>

                    {/* Ngày gửi */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {formatDateTime(quote.createdAt)}
                    </td>

                    {/* Nút hành động */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectQuote(quote);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 font-medium text-xs transition-colors"
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenUpdateModal(quote);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 font-medium text-xs transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Xử lý</span>
                        </button>
                      </div>
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
          Hiển thị <span className="font-bold text-white">{quotes.length}</span>{" "}
          trên tổng số <span className="font-bold text-white">{total}</span> yêu
          cầu báo giá
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
