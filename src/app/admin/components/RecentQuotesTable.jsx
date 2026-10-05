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
  MessageCircle,
} from "lucide-react";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
          <Bell className="w-3 h-3 text-sky-500 animate-bounce" />
          <span>Mới</span>
        </span>
      );
    case "CONTACTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Phone className="w-3 h-3 text-amber-500" />
          <span>Đã liên hệ</span>
        </span>
      );
    case "QUOTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <FileText className="w-3 h-3 text-purple-500" />
          <span>Đã báo giá</span>
        </span>
      );
    case "CONVERTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Chuyển đơn</span>
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
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
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Yêu Cầu Báo Giá Gần Đây
            </h3>
            <p className="text-xs text-slate-500">
              5 yêu cầu cần tư vấn báo giá & may mẫu thử 0đ
            </p>
          </div>
        </div>

        <Link
          href="/admin/quotes"
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-50 border border-amber-200/60 transition-all flex items-center gap-1"
        >
          <span>Tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {quotes.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            Chưa có yêu cầu báo giá nào mới.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/90 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Công ty / Khách hàng</th>
                <th className="py-3 px-4">Liên hệ</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Số lượng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => {
                const customerName =
                  quote.customer?.fullName || quote.fullName || "Khách hàng";
                const company = quote.customer?.company || quote.company;
                const categoryLabel =
                  CATEGORY_NAMES[quote.category?.toLowerCase()] ||
                  quote.categoryLabel ||
                  quote.category ||
                  "Đồng phục doanh nghiệp";
                const customerInitial = customerName.charAt(0).toUpperCase();

                return (
                  <tr
                    key={quote.id}
                    onClick={() => router.push("/admin/quotes")}
                    className="hover:bg-amber-50/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-800 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {customerInitial}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 leading-tight">
                            {customerName}
                          </div>
                          {company && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[140px]">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{company}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-semibold">
                      {quote.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/60">
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                      {quote.quantity}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        chiếc
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <QuoteBadge status={quote.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
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
