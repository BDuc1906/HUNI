"use client";

import React, { useState } from "react";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO } from "@/shared/data";
import { apiClient } from "@/shared/services/apiClient";
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Scissors,
  Phone
} from "lucide-react";

/* =========================================================
   Map trạng thái DB → bước trong stepper (0-4)
   ========================================================= */
function mapStatusToStep(status) {
  switch (status) {
    case "PENDING":
      return 0;
    case "QUOTED":
    case "CONFIRMED":
      return 1;
    case "PRODUCING":
      return 2;
    case "SHIPPED":
      return 4;
    case "COMPLETED":
      return 4;
    case "CANCELLED":
      return 0;
    default:
      return 0;
  }
}

export default function OrderTrackingModal() {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, orders } = useShop();
  const [searchInput, setSearchInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setSearchedOrder(null);

    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    // ==================================================
    // 1. Tìm trong đơn local (đã đặt trên máy này)
    // ==================================================
    const localFound = orders.find(
      (o) =>
        (o.orderNumber || o.id || "").toUpperCase() === query ||
        (o.customer?.phone && o.customer.phone.includes(query))
    );

    if (localFound) {
      setSearchedOrder({
        id: localFound.orderNumber || localFound.id,
        createdAt: localFound.createdAt,
        customer: localFound.customer,
        status: localFound.status || "Đã tiếp nhận",
        currentStep: mapStatusToStep(localFound.status),
        total: localFound.total,
        items: localFound.items || []
      });
      return;
    }

    // ==================================================
    // 2. Query API thật
    // ==================================================
    try {
      setLoading(true);
      const data = await apiClient.get(
        `/api/tracking?code=${encodeURIComponent(query)}`
      );

      if (data.success && data.order) {
        setSearchedOrder({
          id: data.order.orderNumber,
          createdAt: data.order.createdAt,
          customer: data.order.customer,
          status: data.order.status,
          currentStep: mapStatusToStep(data.order.status),
          total: data.order.total,
          items: data.order.items || []
        });
      } else {
        setSearchedOrder(null);
      }
    } catch (err) {
      console.error("[tracking] error:", err);
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Tiếp Nhận Đơn Hàng", desc: "Đã duyệt thông tin & bản vẽ 2D", icon: Clock },
    { title: "Lên Mẫu & Duyệt Form", desc: "May áo mẫu thử thực tế", icon: Scissors },
    { title: "Sản Xuất Chuyền May", desc: "Cắt laser & Thêu Tajima Nhật", icon: Package },
    { title: "Kiểm Định KCS", desc: "Ủi hơi nước & Đóng hộp VIP", icon: CheckCircle2 },
    { title: "Đang Giao Hàng", desc: "Chuyển phát tận văn phòng", icon: Truck }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#004f5e] text-white p-3 sm:p-5 flex items-center justify-between border-b border-brand-500/20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Logo — icon.png căn giữa hoàn hảo */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 aspect-square rounded-lg overflow-hidden bg-white ring-1 ring-brand-200 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icon.png"
                alt="HDC Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-lg truncate">
                Tra Cứu Tiến Độ Đơn May
              </h3>
              <p className="text-[10px] sm:text-xs text-brand-200/80 truncate">
                HỆ THỐNG QUẢN LÝ SẢN XUẤT HDC
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label="Đóng"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Nhập mã đơn (VD: HN-123456) hoặc SĐT..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 disabled:opacity-60"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow transition-colors shrink-0 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Đang tra..." : "Tra cứu"}
            </button>
          </form>

          {/* Results */}
          {searched && searchedOrder ? (
            <div className="space-y-5 sm:space-y-6">
              {/* Order Info Card */}
              <div className="p-3 sm:p-4 bg-brand-50 rounded-xl sm:rounded-2xl border border-brand-200 text-xs text-slate-700 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">Mã đơn: </span>
                    <strong className="text-brand-900 font-black text-sm">
                      {searchedOrder.id}
                    </strong>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    {searchedOrder.status || "Đang xử lý tại xưởng"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 border-t border-brand-200">
                  <div>
                    Khách hàng: <strong>{searchedOrder.customer?.fullName}</strong>
                  </div>
                  <div>
                    SĐT: <strong>{searchedOrder.customer?.phone}</strong>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 sm:mb-4">
                  Tiến độ sản xuất tại xưởng:
                </h4>

                <div className="space-y-2.5 sm:space-y-3">
                  {steps.map((st, i) => {
                    const isDone = i <= (searchedOrder.currentStep || 0);
                    const isCurrent = i === (searchedOrder.currentStep || 0);
                    const Icon = st.icon;

                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20"
                            : isDone
                            ? "bg-emerald-50/40 border-emerald-200 text-slate-700"
                            : "bg-slate-50 border-slate-200 opacity-50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-[#004f5e] flex items-center justify-between gap-2">
                            <span className="truncate">{st.title}</span>
                            {isCurrent && (
                              <span className="text-[9px] sm:text-[10px] bg-brand-400 text-black px-1.5 sm:px-2 py-0.5 rounded-full font-bold animate-pulse shrink-0">
                                Đang làm
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hotline */}
              <div className="p-3 bg-slate-50 rounded-xl text-center text-[11px] sm:text-xs text-slate-500">
                Cần hỗ trợ gấp? Gọi hotline xưởng:{" "}
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="font-bold text-brand-700 hover:underline"
                >
                  {BRAND_INFO.contact.hotline}
                </a>
              </div>
            </div>
          ) : searched ? (
            <div className="text-center py-6 sm:py-8 space-y-2">
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Không tìm thấy đơn &ldquo;{searchInput}&rdquo;
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto">
                Kiểm tra lại mã đơn hoặc SĐT. Hoặc gọi hotline để kiểm tra ngay.
              </p>
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl mt-2 active:scale-95 transition-transform"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 text-[11px] sm:text-xs text-slate-400">
              Nhập mã đơn hoặc SĐT đã đăng ký để tra cứu tiến độ sản xuất tại chuyền may HDC.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}