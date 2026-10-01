"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Clock, User, Package } from "lucide-react";

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
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          ⏳ Chờ xử lý
        </span>
      );
    case "QUOTED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
          📋 Đã báo giá
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          ✅ Xác nhận
        </span>
      );
    case "PRODUCING":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
          🔧 Đang may
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
          🚚 Đã giao
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ✔️ Hoàn thành
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          ❌ Đã huỷ
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
          {status}
        </span>
      );
  }
}

export default function RecentOrdersTable({ orders = [] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Đơn Hàng Gần Đây</h3>
            <p className="text-xs text-slate-400">
              5 đơn hàng mới nhất cần theo dõi
            </p>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline transition-all"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
            Chưa có đơn hàng nào trong hệ thống.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Mã đơn</th>
                <th className="py-3 px-4 font-semibold">Khách hàng</th>
                <th className="py-3 px-4 font-semibold">Sản phẩm</th>
                <th className="py-3 px-4 font-semibold">Tổng tiền</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((order) => {
                const customerName =
                  order.customer?.fullName || order.fullName || "Khách vãng lai";
                const company = order.customer?.company || order.company;
                const itemsCount = order.items?.length || 0;
                const firstItemTitle =
                  order.items?.[0]?.productName ||
                  order.items?.[0]?.productTitle ||
                  order.items?.[0]?.title ||
                  "Đồng phục doanh nghiệp";

                return (
                  <tr
                    key={order.id}
                    onClick={() =>
                      router.push(
                        `/admin/orders?search=${encodeURIComponent(
                          order.orderNumber
                        )}`
                      )
                    }
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {customerName}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {company}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-medium">
                        {firstItemTitle}
                      </span>
                      {itemsCount > 1 && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          +{itemsCount - 1} khác
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {formatVND(order.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
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
