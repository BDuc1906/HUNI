"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Receipt,
  FileText,
  ShoppingBag,
  Copy,
  Check,
  Crown,
  ExternalLink,
  Calendar,
} from "lucide-react";
import OrderStatusBadge from "../../orders/components/OrderStatusBadge";
import QuoteStatusBadge from "../../quotes/components/QuoteStatusBadge";

function formatVND(amount) {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "—";
  }
}

export default function CustomerDetailPanel({ customer, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !customer) return null;

  const handleCopyPhone = () => {
    if (customer.phone) {
      navigator.clipboard.writeText(customer.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const isVip = (customer.orderCount || 0) >= 5;
  const recentOrderDate = customer.orders?.[0]?.createdAt
    ? formatDate(customer.orders[0].createdAt)
    : "Chưa có";

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/40 sticky top-0 z-10 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-600/20">
                {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : "K"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {customer.fullName}
                  </h2>
                  {isVip && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Crown className="w-3 h-3" />
                      <span>VIP</span>
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  {customer.company && (
                    <span className="text-slate-300 font-medium">
                      {customer.company}
                    </span>
                  )}
                  {customer.company && <span>•</span>}
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>{customer.phone}</span>
                    {copiedPhone ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Cards */}
          <div className="p-6 pb-2 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Tổng đơn hàng
              </span>
              <span className="text-base font-extrabold text-blue-400 font-mono mt-0.5 block">
                {customer.orderCount || 0} đơn
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Doanh số tích luỹ
              </span>
              <span className="text-base font-extrabold text-emerald-400 font-mono mt-0.5 block truncate">
                {formatVND(customer.totalSpent || 0)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Đơn gần nhất
              </span>
              <span className="text-xs font-bold text-slate-200 font-mono mt-1 block truncate">
                {recentOrderDate}
              </span>
            </div>
          </div>

          {/* Tabs Selector */}
          <div className="px-6 border-b border-slate-800 flex gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`py-3 border-b-2 transition-all ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Thông Tin Khách Hàng
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <span>Lịch Sử Đơn Hàng</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">
                {customer.orders?.length || 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("quotes")}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "quotes"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <span>Yêu Cầu Báo Giá</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">
                {customer.quotes?.length || 0}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 flex-1 space-y-4">
            {activeTab === "info" && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Hồ Sơ Doanh Nghiệp & Cá Nhân</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Họ và tên:</span>
                      <span className="text-white font-semibold">{customer.fullName}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Số điện thoại:</span>
                      <span className="font-mono text-blue-400 font-bold">{customer.phone}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Email liên hệ:</span>
                      <span className="text-slate-300">{customer.email || "—"}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Tổ chức / Công ty:</span>
                      <span className="text-slate-300">{customer.company || "Cá nhân"}</span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block text-[11px]">Địa chỉ giao hàng:</span>
                      <span className="text-slate-300 flex items-start gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{customer.address || "Chưa cập nhật"}</span>
                      </span>
                    </div>

                    {customer.taxCode && (
                      <div className="sm:col-span-2 pt-2 border-t border-slate-800 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-400">Mã số thuế doanh nghiệp:</span>
                        <span className="font-mono font-bold text-white">{customer.taxCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {customer.notes && (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
                      Ghi Chú Khách Hàng:
                    </span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-3">
                {(!customer.orders || customer.orders.length === 0) ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    Khách hàng chưa có đơn hàng nào.
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
                          <th className="py-2.5 px-3">Mã đơn</th>
                          <th className="py-2.5 px-3">Trạng thái</th>
                          <th className="py-2.5 px-3">Tổng tiền</th>
                          <th className="py-2.5 px-3 text-right">Ngày đặt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {customer.orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-400">
                              <Link
                                href={`/admin/orders?search=${encodeURIComponent(ord.orderNumber)}`}
                                className="hover:underline flex items-center gap-1"
                              >
                                <span>{ord.orderNumber}</span>
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </Link>
                            </td>
                            <td className="py-2.5 px-3">
                              <OrderStatusBadge status={ord.status} />
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                              {formatVND(ord.total)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-400 text-[11px]">
                              {formatDate(ord.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "quotes" && (
              <div className="space-y-3">
                {(!customer.quotes || customer.quotes.length === 0) ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    Khách hàng chưa gửi yêu cầu báo giá nào.
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
                          <th className="py-2.5 px-3">Danh mục</th>
                          <th className="py-2.5 px-3 text-center">Số lượng</th>
                          <th className="py-2.5 px-3">Trạng thái</th>
                          <th className="py-2.5 px-3 text-right">Ngày gửi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {customer.quotes.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 font-medium text-slate-200">
                              {q.category}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                              {q.quantity} chiếc
                            </td>
                            <td className="py-2.5 px-3">
                              <QuoteStatusBadge status={q.status} />
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-400 text-[11px]">
                              {formatDate(q.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Đóng panel
            </button>
            <Link
              href={`/admin/orders?search=${encodeURIComponent(customer.phone)}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5"
            >
              <span>Xem tất cả đơn của khách</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
