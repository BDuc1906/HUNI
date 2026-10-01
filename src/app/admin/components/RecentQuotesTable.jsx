"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, Phone, Building2 } from "lucide-react";

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

export function QuoteBadge({ status }) {
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
          🔔 Mới
        </span>
      );
    case "CONTACTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          📞 Đã liên hệ
        </span>
      );
    case "QUOTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
          📄 Đã báo giá
        </span>
      );
    case "CONVERTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ✅ Chuyển đơn
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-600/20 text-slate-400 border border-slate-600/30">
          🔒 Đóng
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700/20 text-slate-400 border border-slate-700/30">
          {status}
        </span>
      );
  }
}

const CATEGORY_NAMES = {
  polo: "Áo Polo Đồng Phục",
  shirt: "Sơ Mi Công Sở",
  vest: "Vest / Suit Cao Cấp",
  golf: "Trang Phục Golf",
  school: "Đồng Phục Học Sinh",
  accessories: "Phụ Kiện",
  corporate: "Đồng Phục Doanh Nghiệp",
};

export default function RecentQuotesTable({ quotes = [] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Yêu Cầu Báo Giá Gần Đây</h3>
            <p className="text-xs text-slate-400">
              5 yêu cầu cần tư vấn & phản hồi sớm
            </p>
          </div>
        </div>
        <Link
          href="/admin/quotes"
          className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline transition-all"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {quotes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
            Chưa có yêu cầu báo giá nào mới.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Công ty / Khách</th>
                <th className="py-3 px-4 font-semibold">SĐT</th>
                <th className="py-3 px-4 font-semibold">Danh mục</th>
                <th className="py-3 px-4 font-semibold">Số lượng</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {quotes.map((quote) => {
                const customerName =
                  quote.customer?.fullName || quote.fullName || "Khách hàng";
                const company = quote.customer?.company || quote.company;
                const categoryLabel =
                  CATEGORY_NAMES[quote.category?.toLowerCase()] ||
                  quote.category ||
                  "Đồng phục";

                return (
                  <tr
                    key={quote.id}
                    onClick={() => router.push("/admin/quotes")}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {customerName}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[130px]">{company}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {quote.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60">
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {quote.quantity} chiếc
                    </td>
                    <td className="py-3.5 px-4">
                      <QuoteBadge status={quote.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {formatDateTime(quote.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
