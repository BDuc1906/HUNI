"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  FileText,
  Copy,
  Check,
  Edit,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import QuoteStatusBadge from "./QuoteStatusBadge";

function formatVND(amount) {
  if (typeof amount !== "number") return "—";
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

const CATEGORY_NAMES = {
  polo: "Áo Polo Đồng Phục",
  shirt: "Sơ Mi Công Sở",
  vest: "Vest / Suit Cao Cấp",
  golf: "Trang Phục Golf",
  school: "Đồng Phục Học Sinh",
  accessories: "Phụ Kiện",
  corporate: "Đồng Phục Doanh Nghiệp",
};

const STEPPER_STAGES = [
  { key: "NEW", label: "Mới" },
  { key: "CONTACTED", label: "Liên hệ" },
  { key: "QUOTED", label: "Báo giá" },
  { key: "CONVERTED", label: "Chuyển đơn" },
];

export default function QuoteDetailPanel({
  quote,
  isOpen,
  onClose,
  onOpenUpdateModal,
}) {
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !quote) return null;

  const handleCopyPhone = () => {
    if (quote.phone) {
      navigator.clipboard.writeText(quote.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const currentCategory =
    CATEGORY_NAMES[quote.category?.toLowerCase()] ||
    quote.category ||
    "Đồng phục";

  // Xác định vị trí của stage trong stepper
  const currentStageIndex = STEPPER_STAGES.findIndex(
    (s) => s.key === quote.status
  );

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/40 sticky top-0 z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-extrabold text-white">
                  Yêu Cầu Báo Giá
                </h2>
                <QuoteStatusBadge status={quote.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Gửi lúc: {formatDateTime(quote.createdAt)}</span>
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
            {/* Stepper Tiến Độ */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Tiến Trình Xử Lý Báo Giá
              </span>
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />

                {STEPPER_STAGES.map((step, idx) => {
                  const isDone =
                    currentStageIndex >= idx && quote.status !== "CLOSED";
                  const isCurrent = quote.status === step.key;

                  return (
                    <div
                      key={step.key}
                      className="relative z-10 flex flex-col items-center gap-1.5 bg-slate-950 px-1"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                            : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isDone && !isCurrent ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold whitespace-nowrap ${
                          isCurrent
                            ? "text-blue-400"
                            : isDone
                            ? "text-emerald-400"
                            : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {quote.status === "CLOSED" && (
                <div className="mt-3 p-2 rounded-lg bg-slate-800/80 text-center text-xs text-slate-400 font-medium">
                  Yêu cầu này đã được đóng (CLOSED)
                </div>
              )}
            </div>

            {/* Khách hàng đã chốt đơn Banner */}
            {quote.status === "CONVERTED" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Khách hàng đã đồng ý chuyển sang đơn hàng!</span>
                </div>
                <p className="text-slate-300">
                  Tạo đơn hàng chính thức để tiến hành may mẫu hoặc sản xuất hàng loạt.
                </p>
                <Link
                  href={`/admin/orders?search=${encodeURIComponent(quote.phone)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 rounded-lg shadow transition-colors"
                >
                  <span>Xem / Tạo đơn hàng cho khách này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* 1. Thông Tin Khách Hàng */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 text-[11px]">
                <User className="w-4 h-4 text-blue-400" />
                <span>Người Liên Hệ</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Họ và tên:</span>
                  <span className="font-semibold text-slate-200 text-sm">
                    {quote.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Số điện thoại:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-blue-400 text-sm">
                      {quote.phone}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Sao chép số điện thoại"
                    >
                      {copiedPhone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedPhone && (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        Đã copy!
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Email:</span>
                  <span className="text-slate-300">{quote.email || "—"}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Doanh nghiệp:</span>
                  <span className="text-slate-300 font-medium">
                    {quote.company || "Cá nhân / Tập thể"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Chi Tiết Yêu Cầu May */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 text-[11px]">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>Nhu Cầu Báo Giá</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Danh mục sản phẩm:</span>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-semibold border border-slate-700 mt-1">
                    {currentCategory}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Số lượng dự kiến:</span>
                  <span className="font-mono font-extrabold text-white text-base block mt-0.5">
                    {quote.quantity} chiếc
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Giá đề xuất / tham khảo:</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    {formatVND(quote.estimatedPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Ghi Chú Yêu Cầu */}
            {quote.notes && (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
                  Nội Dung Yêu Cầu & Ghi Chú:
                </span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {quote.notes}
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
              onClick={() => onOpenUpdateModal(quote)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Cập nhật báo giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
