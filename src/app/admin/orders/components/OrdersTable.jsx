"use client";

import React from "react";
import {
  ShoppingBag,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

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

export default function OrdersTable({
  orders = [],
  pagination = {},
  onPageChange,
  onSelectOrder,
  onOpenUpdateModal,
  loading = false,
}) {
  const { page = 1, totalPages = 1, total = 0 } = pagination;

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Đang tải danh sách đơn hàng...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
            <h4 className="text-sm font-bold text-slate-700 mb-1">
              Chưa có đơn hàng nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không tìm thấy đơn hàng phù hợp với điều kiện tìm kiếm hoặc bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Mã đơn</th>
                <th className="py-3.5 px-4 font-semibold">Khách hàng</th>
                <th className="py-3.5 px-4 font-semibold">Sản phẩm</th>
                <th className="py-3.5 px-4 font-semibold">Tổng tiền</th>
                <th className="py-3.5 px-4 font-semibold">Thanh toán</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const customer = order.customer || {};
                const orderCode = order.orderNumber || order.orderCode || order.id;
                const customerName =
                  order.customerName || customer.fullName || order.fullName || "Khách hàng";
                const company = order.companyName || customer.company || order.company;
                const phone = order.customerPhone || customer.phone || order.phone;
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
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Mã đơn */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="font-mono font-bold text-brand-700 hover:text-brand-800 hover:underline flex items-center gap-1"
                      >
                        <span>{orderCode}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-600" />
                      </button>
                    </td>

                    {/* Khách hàng */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {customerName}
                      </div>
                      {company && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{company}</span>
                        </div>
                      )}
                      {phone && (
                        <div className="text-[11px] font-mono text-slate-500">
                          {phone}
                        </div>
                      )}
                    </td>

                    {/* Sản phẩm */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium line-clamp-1 max-w-[180px]">
                        {firstItemTitle}
                      </div>
                      {itemsCount > 1 && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          +{itemsCount - 1} phân loại khác
                        </span>
                      )}
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {formatVND(totalAmount)}
                    </td>

                    {/* Phương thức thanh toán */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 uppercase">
                        <CreditCard className="w-3 h-3 text-slate-500" />
                        <span>{order.paymentMethod || "vietqr"}</span>
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Ngày tạo */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {formatDateTime(order.createdAt)}
                    </td>

                    {/* Nút hành động */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-medium text-xs transition-colors"
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenUpdateModal(order)}
                          className="px-2.5 py-1.5 rounded-lg text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 font-medium text-xs transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Cập nhật</span>
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
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Hiển thị <span className="font-bold text-slate-900">{orders.length}</span>{" "}
          trên tổng số <span className="font-bold text-slate-900">{total}</span> đơn
          hàng
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-xs transition-colors"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-slate-700 px-2 font-medium">
            Trang {page} / {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-xs transition-colors"
            aria-label="Trang tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
