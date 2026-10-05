"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowRight,
  Building2,
  Phone,
  Bell,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
<<<<<<< HEAD
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
=======
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
    }).format(d);
  } catch { return "—"; }
}

export function QuoteBadge({ status }) {
<<<<<<< HEAD
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
=======
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Bell className="w-3 h-3 text-sky-500" />
          <span>Mới</span>
        </span>
      );
    case "CONTACTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Phone className="w-3 h-3 text-amber-500" />
          <span>Đã liên hệ</span>
        </span>
      );
    case "QUOTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <FileText className="w-3 h-3 text-purple-500" />
          <span>Đã báo giá</span>
        </span>
      );
    case "CONVERTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Chuyển đơn</span>
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Đóng</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
<<<<<<< HEAD
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
=======
    <div
      className={`rounded-2xl transition-all duration-300 border overflow-hidden flex flex-col justify-between ${
        isDark
          ? "bg-[#1E293B] border-slate-700/80 text-white shadow-md shadow-black/20"
          : "bg-white border-slate-200/90 text-slate-900 shadow-xs"
      }`}
    >
      {/* Table Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              Yêu Cầu Báo Giá Gần Đây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Các yêu cầu cần tư vấn chất liệu & may mẫu thử 0đ
            </p>
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
          </div>
        </div>

        <Link
          href="/admin/quotes"
<<<<<<< HEAD
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline transition-all"
=======
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 hover:underline"
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {quotes.length === 0 ? (
<<<<<<< HEAD
          <div className="p-8 text-center text-[#64748b] text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#1e4a5c]" />
=======
          <div className="p-8 text-center text-slate-400 text-xs">
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
            Chưa có yêu cầu báo giá nào mới.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
<<<<<<< HEAD
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
=======
              <tr className="border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Công ty / Khách hàng</th>
                <th className="py-3 px-4">SĐT</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Số lượng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
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
<<<<<<< HEAD
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
=======
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white leading-tight">
                        {customerName}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[140px]">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{company}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {quote.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {quote.quantity}{" "}
                      <span className="text-[10px] font-normal text-slate-500">
                        chiếc
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <QuoteBadge status={quote.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
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
