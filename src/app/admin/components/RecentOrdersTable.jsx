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

export function OrderBadge({ status }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          ⏳ Chờ xử lý
        </span>
      );
    case "QUOTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          📋 Đã báo giá
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          ✅ Xác nhận
        </span>
      );
    case "PRODUCING":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
          🔧 Đang may
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          🚚 Đã giao
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✔️ Hoàn thành
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          ❌ Đã huỷ
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}

export default function RecentOrdersTable({ orders = [] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow overflow-hidden flex flex-col justify-between">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Đơn Hàng Gần Đây</h3>
            <p className="text-xs text-slate-500">
              5 đơn hàng mới nhất cần theo dõi
            </p>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline transition-all"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
            Chưa có đơn hàng nào trong hệ thống.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-600 uppercase tracking-wider text-[11px]">
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
                const customerName =
                  order.customerName || order.customer?.fullName || order.fullName || "Khách hàng";
                const company = order.companyName || order.company || order.customer?.company;
                const itemsCount = order.items?.length || 0;
                const firstItemTitle =
                  order.items?.[0]?.productName ||
                  order.items?.[0]?.productTitle ||
                  order.items?.[0]?.title ||
                  "Đồng phục doanh nghiệp";
                const totalAmount = order.totalAmount || order.total || 0;

                return (
                  <tr
                    key={order.id}
                    onClick={() =>
                      router.push(
                        `/admin/orders?search=${encodeURIComponent(orderCode)}`
                      )
                    }
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                      {orderCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {customerName}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {company}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">
                        {firstItemTitle}
                      </span>
                      {itemsCount > 1 && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200/60">
                          +{itemsCount - 1} khác
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {formatVND(totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderBadge status={order.status} />
                    </td>
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
