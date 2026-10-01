"use client";

import React from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Receipt,
  Package,
  Calendar,
  CreditCard,
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

export default function OrderDetailPanel({
  order,
  isOpen,
  onClose,
  onOpenUpdateModal,
}) {
  if (!isOpen || !order) return null;

  const customer = order.customer || {};
  const vatInfo = order.vatInfo;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/40 sticky top-0 z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-white font-mono tracking-tight">
                  {order.orderNumber}
                </h2>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Ngày tạo: {formatDateTime(order.createdAt)}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Đóng panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* 1. Thông Tin Khách Hàng */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Thông Tin Khách Hàng</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Họ và tên:</span>
                  <span className="font-semibold text-slate-200 text-sm">
                    {customer.fullName || order.fullName || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Số điện thoại:</span>
                  <span className="font-mono font-medium text-blue-400 text-sm">
                    {customer.phone || order.phone || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Email liên hệ:</span>
                  <span className="text-slate-300">
                    {customer.email || order.email || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Công ty / Tổ chức:</span>
                  <span className="text-slate-300">
                    {customer.company || order.company || "Cá nhân"}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[11px]">Địa chỉ giao hàng:</span>
                  <span className="text-slate-300 flex items-start gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{customer.address || order.address || "—"}</span>
                  </span>
                </div>
              </div>

              {/* Thông tin VAT nếu có */}
              {vatInfo && vatInfo.taxCode && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-900/60 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1 text-[11px] uppercase">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Thông tin xuất hoá đơn VAT</span>
                  </div>
                  <div className="text-slate-300">
                    MST: <span className="font-mono font-bold">{vatInfo.taxCode}</span>
                  </div>
                  {vatInfo.companyName && (
                    <div className="text-slate-300">Công ty: {vatInfo.companyName}</div>
                  )}
                  {vatInfo.companyAddress && (
                    <div className="text-slate-400 text-[11px]">
                      Địa chỉ: {vatInfo.companyAddress}
                    </div>
                  )}
                  {vatInfo.invoiceEmail && (
                    <div className="text-slate-400 text-[11px]">
                      Email HĐ: {vatInfo.invoiceEmail}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Danh Sách Sản Phẩm */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Danh Sách Sản Phẩm ({order.items?.length || 0})</span>
              </h4>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
                      <th className="py-2.5 px-3">Sản phẩm</th>
                      <th className="py-2.5 px-3">Màu/Size</th>
                      <th className="py-2.5 px-3 text-center">SL</th>
                      <th className="py-2.5 px-3 text-right">Đơn giá</th>
                      <th className="py-2.5 px-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(order.items || []).map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">
                            {item.productName || item.productTitle || "Đồng phục"}
                          </div>
                          {item.customLogo && (
                            <span className="text-[10px] text-amber-400 font-medium">
                              Có in/thêu logo
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <div>Màu: {item.color || "Chuẩn"}</div>
                          <div className="text-[11px] text-slate-400">
                            Size: {item.size || "Free"}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-white">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {formatVND(item.unitPrice)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          {formatVND(item.subtotal || item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Tổng Tiền & Thanh Toán */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Tạm tính hàng hoá:</span>
                <span className="font-mono text-slate-200">
                  {formatVND(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex items-center justify-between text-rose-400">
                  <span>Chiết khấu / Voucher:</span>
                  <span className="font-mono">-{formatVND(order.discount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400">
                <span>Phương thức thanh toán:</span>
                <span className="font-semibold text-slate-200 uppercase font-mono">
                  {order.paymentMethod || "vietqr"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Tổng Thanh Toán:</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  {formatVND(order.total)}
                </span>
              </div>
            </div>

            {/* 4. Ghi Chú Đơn Hàng */}
            {order.notes && (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
                  Ghi Chú Tiến Độ / Yêu Cầu Của Khách:
                </span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-800 bg-slate-950/60 sticky bottom-0 z-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Đóng panel
            </button>
            <button
              type="button"
              onClick={() => onOpenUpdateModal(order)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Cập nhật trạng thái</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
