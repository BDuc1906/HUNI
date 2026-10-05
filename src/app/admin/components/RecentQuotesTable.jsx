"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, Building2 } from "lucide-react";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(d);
  } catch { return "—"; }
}

export function QuoteBadge({ status }) {
  const config = {
    NEW:       { bg: "bg-[#0097B2]/15",   text: "text-[#33B0CB]",  border: "border-[#0097B2]/25",  label: "🔔 Mới" },
    CONTACTED: { bg: "bg-amber-500/15",   text: "text-amber-400",  border: "border-amber-500/25",  label: "📞 Đã liên hệ" },
    QUOTED:    { bg: "bg-purple-500/15",  text: "text-purple-400", border: "border-purple-500/25", label: "📄 Đã báo giá" },
    CONVERTED: { bg: "bg-emerald-500/15", text: "text-emerald-400",border: "border-emerald-500/25",label: "✅ Chuyển đơn" },
    CLOSED:    { bg: "bg-white/6",        text: "text-[#64748b]",  border: "border-white/10",      label: "🔒 Đóng" },
  };
  const c = config[status] || { bg: "bg-white/6", text: "text-[#94a3b8]", border: "border-white/10", label: status };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}

const CATEGORY_NAMES = {
  polo: "Áo Polo Đồng Phục",
  shirt: "Sơ Mi Công Sở",
  vest: "Vest / Suit Cao Cấp",
  golf: "Trang Phục Golf",
  school: "Đồng Phục Học Sinh",
  accessories: "Phụ Kiện",
  corporate: "Đồng Phục DN",
};

export default function RecentQuotesTable({ quotes = [] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-[#071a21] border border-[#0b3440] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[#0b3440] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/12 text-amber-400 border border-amber-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Yêu Cầu Báo Giá Gần Đây</h3>
            <p className="text-xs text-[#64748b]">5 yêu cầu cần tư vấn & phản hồi sớm</p>
          </div>
        </div>
        <Link
          href="/admin/quotes"
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline transition-all"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {quotes.length === 0 ? (
          <div className="p-8 text-center text-[#64748b] text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#1e4a5c]" />
            Chưa có yêu cầu báo giá nào mới.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#0b3440] bg-white/3 text-[#64748b] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Công ty / Khách</th>
                <th className="py-3 px-4 font-semibold">SĐT</th>
                <th className="py-3 px-4 font-semibold">Danh mục</th>
                <th className="py-3 px-4 font-semibold">Số lượng</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0b3440]">
              {quotes.map((quote) => {
                const customerName = quote.customer?.fullName || quote.fullName || "Khách hàng";
                const company = quote.customer?.company || quote.company;
                const categoryLabel =
                  CATEGORY_NAMES[quote.category?.toLowerCase()] ||
                  quote.categoryLabel || quote.category || "Đồng phục";

                return (
                  <tr
                    key={quote.id}
                    onClick={() => router.push("/admin/quotes")}
                    className={`cursor-pointer transition-colors ${
                      quote.status === "NEW"
                        ? "bg-[#0097B2]/5 hover:bg-[#0097B2]/10"
                        : "hover:bg-white/4"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{customerName}</div>
                      {company && (
                        <div className="text-[11px] text-[#64748b] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#1e4a5c]" />
                          <span className="truncate max-w-[130px]">{company}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#94a3b8]">{quote.phone || "—"}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white/6 text-[#94a3b8] text-[11px] font-medium border border-[#0b3440]">
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{quote.quantity} chiếc</td>
                    <td className="py-3.5 px-4"><QuoteBadge status={quote.status} /></td>
                    <td className="py-3.5 px-4 text-right text-[#64748b] font-mono text-[11px]">
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
