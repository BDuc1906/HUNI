"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowRight,
  Building2,
  Clock,
  Scissors,
  CheckCircle2,
  Truck,
  XCircle,
  FileCheck,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

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

export function OrderBadge({ status }) {
<<<<<<< HEAD
  const config = {
    PENDING:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   label: "⏳ Chờ xử lý" },
    QUOTED:    { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200",  label: "📋 Đã báo giá" },
    CONFIRMED: { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     label: "✅ Xác nhận" },
    PRODUCING: { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200",    label: "🧵 Đang may" },
    SHIPPED:   { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  label: "🚚 Đã giao" },
    COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "✔️ Hoàn thành" },
    CANCELLED: { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    label: "❌ Đã huỷ" },
  };
  const c = config[status] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", label: status };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
=======
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>Chờ xử lý</span>
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <FileCheck className="w-3 h-3 text-sky-500" />
          <span>Xác nhận</span>
        </span>
      );
    case "PRODUCING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0097B2]/10 text-[#007F96] dark:text-[#0097B2] border border-[#0097B2]/30">
          <Scissors className="w-3 h-3 text-[#0097B2] animate-pulse" />
          <span>Đang may</span>
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Truck className="w-3 h-3 text-indigo-500" />
          <span>Đang giao</span>
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Hoàn thành</span>
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <XCircle className="w-3 h-3 text-rose-500" />
          <span>Đã huỷ</span>
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

export default function RecentOrdersTable({ orders = [] }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
<<<<<<< HEAD
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#0097B2]/10 text-[#0097B2] border border-[#0097B2]/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Đơn Hàng Gần Đây</h3>
            <p className="text-xs text-slate-500">5 đơn hàng mới nhất cần theo dõi</p>
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
          <div className="w-9 h-9 rounded-xl bg-[#0097B2]/10 text-[#0097B2] flex items-center justify-center border border-[#0097B2]/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              Đơn Hàng Gần Đây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Các đơn may đo đồng phục mới nhất cần theo dõi
            </p>
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
          </div>
        </div>

        <Link
          href="/admin/orders"
<<<<<<< HEAD
          className="text-xs font-semibold text-[#0097B2] hover:text-[#007f96] flex items-center gap-1 hover:underline"
=======
          className="text-xs font-bold text-[#0097B2] hover:text-[#007F96] flex items-center gap-1 hover:underline"
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto flex-1">
        {orders.length === 0 ? (
<<<<<<< HEAD
          <div className="p-8 text-center text-slate-400 text-sm">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Chưa có đơn hàng nào.
=======
          <div className="p-8 text-center text-slate-400 text-xs">
            Chưa có đơn hàng nào trong hệ thống.
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
<<<<<<< HEAD
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Mã đơn</th>
                <th className="py-3 px-4 font-semibold">Khách hàng</th>
                <th className="py-3 px-4 font-semibold">Sản phẩm</th>
                <th className="py-3 px-4 font-semibold">Tổng tiền</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
=======
              <tr className="border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng / Doanh nghiệp</th>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thời gian</th>
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {orders.map((order) => {
<<<<<<< HEAD
                const orderCode = order.orderNumber || order.orderCode || order.id;
                const customerName = order.customerName || order.customer?.fullName || order.fullName || "Khách hàng";
                const company = order.companyName || order.company || order.customer?.company;
                const itemsCount = order.items?.length || 0;
                const firstItemTitle = order.items?.[0]?.productName || order.items?.[0]?.productTitle || order.items?.[0]?.title || "Đồng phục doanh nghiệp";
=======
                const orderCode =
                  order.orderNumber || order.orderCode || order.id;
                const customerName =
                  order.customerName ||
                  order.customer?.fullName ||
                  order.fullName ||
                  "Khách hàng";
                const company =
                  order.companyName ||
                  order.company ||
                  order.customer?.company;
                const firstItemTitle =
                  order.items?.[0]?.productName ||
                  order.items?.[0]?.title ||
                  "Đồng phục doanh nghiệp";
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
                const totalAmount = order.totalAmount || order.total || 0;

                return (
                  <tr
                    key={order.id}
<<<<<<< HEAD
                    onClick={() => router.push(`/admin/orders?search=${encodeURIComponent(orderCode)}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0097B2]">{orderCode}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{customerName}</div>
                      {company && <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{company}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">{firstItemTitle}</span>
                      {itemsCount > 1 && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          +{itemsCount - 1}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{formatVND(totalAmount)}</td>
                    <td className="py-3.5 px-4"><OrderBadge status={order.status} /></td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
=======
                    onClick={() =>
                      router.push(
                        `/admin/orders?search=${encodeURIComponent(orderCode)}`
                      )
                    }
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0097B2]">
                      {orderCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white leading-tight">
                        {customerName}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px] flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{company}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px] inline-block">
                        {firstItemTitle}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                      {formatVND(totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
>>>>>>> ffef8bc5bdf97e0e8ba5db6f73256774b5a491ac
                      {formatDateTime(order.createdAt)}
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