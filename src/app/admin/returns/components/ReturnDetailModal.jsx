"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RotateCcw,
  X,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  Package,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  DollarSign,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ Tiếp Nhận",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  PROCESSING: {
    label: "Đang Xử Lý / Kiểm Hàng",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: RotateCcw,
  },
  EXCHANGED: {
    label: "Đã Đổi Hàng Mới",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icon: CheckCircle2,
  },
  REFUNDED: {
    label: "Đã Hoàn Tiền",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: DollarSign,
  },
  REJECTED: {
    label: "Từ Chối Đổi Trả",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    icon: XCircle,
  },
};

export default function ReturnDetailModal({ item, onClose, onUpdateStatus }) {
  const [currentStatus, setCurrentStatus] = useState(item?.status || "PENDING");
  const [adminNotes, setAdminNotes] = useState(item?.adminNotes || "");
  const [refundAmount, setRefundAmount] = useState(item?.refundAmount || 0);
  const [saving, setSaving] = useState(false);

  if (!item) return null;

  const statusObj = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusObj.icon;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateStatus(item.id, {
        status: currentStatus,
        adminNotes: adminNotes.trim(),
        refundAmount: Number(refundAmount) || 0,
      });
      onClose();
    } catch (err) {
      console.error("Error updating return request:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative text-slate-200">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Đóng popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề & Mã yêu cầu */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-black text-white">{item.id}</h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusObj.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{statusObj.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Liên kết đơn hàng:{" "}
              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {item.orderNumber}
              </span>{" "}
              • Ngày tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Thông tin khách hàng & Công ty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Người Yêu Cầu</span>
            </div>
            <div className="font-bold text-white text-sm">{item.customerName}</div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.customerPhone}</span>
            </div>
            {item.customerEmail && (
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.customerEmail}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 sm:border-l sm:border-slate-800/80 sm:pl-3.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>Doanh Nghiệp / Tổ Chức</span>
            </div>
            <div className="font-bold text-white">{item.company || "Khách hàng cá nhân"}</div>
            <div className="text-slate-400 flex items-center gap-1.5">
              <span>Hình thức xử lý:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  item.type === "REFUND"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {item.type === "REFUND" ? "💸 Hoàn Tiền" : "🔄 Đổi Sản Phẩm 1-1"}
              </span>
            </div>
          </div>
        </div>

        {/* Sản phẩm cần đổi trả */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Sản Phẩm Đổi Trả</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative shrink-0">
                <Image
                  src={
                    item.evidenceImages?.[0] ||
                    "/images/06_polo_01.jpg"
                  }
                  alt={item.productTitle || "Sản phẩm"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{item.productTitle}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Số lượng: <span className="font-bold text-amber-400">{item.quantity} cái</span>
                </div>
              </div>
            </div>

            {item.refundAmount > 0 && (
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Số tiền hoàn:</div>
                <div className="text-base font-black text-emerald-400">
                  {item.refundAmount.toLocaleString("vi-VN")} đ
                </div>
              </div>
            )}
          </div>

          {/* Lý do & Chi tiết lỗi */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Lý do: {item.reason}</span>
            </div>
            <p className="text-slate-300 italic pl-5.5">{item.details}</p>
          </div>
        </div>

        {/* Thông tin tài khoản hoàn tiền (nếu là hoàn tiền) */}
        {item.bankInfo && (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Thông Tin Tài Khoản Nhận Tiền Hoàn</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Ngân Hàng</div>
                <div className="font-bold text-white mt-0.5">{item.bankInfo.bankName}</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Số Tài Khoản</div>
                <div className="font-bold text-emerald-400 mt-0.5 tracking-wider">
                  {item.bankInfo.accountNumber}
                </div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Chủ Tài Khoản</div>
                <div className="font-bold text-white mt-0.5">{item.bankInfo.accountHolder}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Cập Nhật Trạng Thái & Ghi Chú Admin */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-800 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Cập nhật trạng thái xử lý
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="PENDING">🟡 Chờ tiếp nhận (PENDING)</option>
                <option value="PROCESSING">🔵 Đang xử lý / Đang kiểm hàng (PROCESSING)</option>
                <option value="EXCHANGED">🟣 Đã đổi hàng mới (EXCHANGED)</option>
                <option value="REFUNDED">🟢 Đã chuyển khoản hoàn tiền (REFUNDED)</option>
                <option value="REJECTED">🔴 Từ chối yêu cầu (REJECTED)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Số tiền hoàn lại (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Nhập số tiền hoàn..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Ghi chú nội bộ quản trị viên
            </label>
            <textarea
              rows="3"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="VD: Đã gọi điện hẹn shipper thu hồi áo lỗi, chuyển khoản hoàn tiền lúc 14h..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none text-xs"
            />
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Đang lưu..." : "Lưu Cập Nhật"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
