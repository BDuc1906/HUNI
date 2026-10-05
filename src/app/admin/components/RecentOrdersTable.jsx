"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight } from "lucide-react";

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
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(d);
  } catch { return "—"; }
}

export function OrderBadge({ status }) {
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
}

export default function RecentOrdersTable({ orders = [] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#0097B2]/10 text-[#0097B2] border border-[#0097B2]/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Đơn Hàng Gần Đây</h3>
            <p className="text-xs text-slate-500">5 đơn hàng mới nhất cần theo dõi</p>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-[#0097B2] hover:text-[#007f96] flex items-center gap-1 hover:underline"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto flex-1">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Chưa có đơn hàng nào.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Mã đơn</th>
                <th className="py-3 px-4 font-semibold">Khách hàng</th>
                <th className="py-3 px-4 font-semibold">Sản phẩm</th>
                <th className="py-3 px-4 font-semibold">Tổng tiền</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const orderCode = order.orderNumber || order.orderCode || order.id;
                const customerName = order.customerName || order.customer?.fullName || order.fullName || "Khách hàng";
                const company = order.companyName || order.company || order.customer?.company;
                const itemsCount = order.items?.length || 0;
                const firstItemTitle = order.items?.[0]?.productName || order.items?.[0]?.productTitle || order.items?.[0]?.title || "Đồng phục doanh nghiệp";
                const totalAmount = order.totalAmount || order.total || 0;

                return (
                  <tr
                    key={order.id}
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