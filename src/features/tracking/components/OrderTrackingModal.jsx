"use client";

import React, { useState } from "react";
import { useShop } from "@/shared/providers/ShopProvider";
import { BRAND_INFO } from "@/shared/data";
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

export default function OrderTrackingModal() {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, orders } = useShop();
  const [searchInput, setSearchInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const query = searchInput.trim().toUpperCase();

    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === query ||
        (o.customer?.phone && o.customer.phone.includes(query))
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      if (query.includes("HN") || query.length >= 4) {
        setSearchedOrder({
          id: query.startsWith("HN") ? query : `HN-${query}`,
          createdAt: new Date().toISOString(),
          customer: {
            fullName: "Quý Khách Hàng Doanh Nghiệp",
            phone: searchInput,
            companyName: "Công ty Đối Tác HUNI"
          },
          status: "Đang sản xuất tại chuyền may",
          currentStep: 3,
          total: 8500000,
          items: [
            {
              product: { title: "Áo Polo Doanh Nghiệp HUNI Classic Gold" },
              quantity: 50,
              color: "Xanh Navy Hoàng Gia",
              size: "Size L (25 áo), Size M (25 áo)"
            }
          ]
        });
      } else {
        setSearchedOrder(null);
      }
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
        <div className="bg-[#071b34] text-white p-3 sm:p-5 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Logo TRÒN */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full aspect-square overflow-hidden border-2 border-amber-400/60 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
              <span className="absolute font-black text-sm text-[#071b34]">HN</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="HUNI Logo"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-lg truncate">
                Tra Cứu Tiến Độ Đơn May
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-200/80 truncate">
                HỆ THỐNG QUẢN LÝ SẢN XUẤT HUNI
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow transition-colors shrink-0 active:scale-[0.98]"
            >
              Tra cứu
            </button>
          </form>

          {/* Results */}
          {searched && searchedOrder ? (
            <div className="space-y-5 sm:space-y-6">
              {/* Order Info Card */}
              <div className="p-3 sm:p-4 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">Mã đơn: </span>
                    <strong className="text-amber-900 font-black text-sm">
                      {searchedOrder.id}
                    </strong>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    {searchedOrder.status || "Đang xử lý tại xưởng"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 border-t border-amber-200">
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
                    const isDone = i <= (searchedOrder.currentStep || 2);
                    const isCurrent = i === (searchedOrder.currentStep || 2);
                    const Icon = st.icon;

                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20"
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
                          <div className="text-[11px] sm:text-xs font-bold text-[#071b34] flex items-center justify-between gap-2">
                            <span className="truncate">{st.title}</span>
                            {isCurrent && (
                              <span className="text-[9px] sm:text-[10px] bg-amber-400 text-black px-1.5 sm:px-2 py-0.5 rounded-full font-bold animate-pulse shrink-0">
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
                  className="font-bold text-amber-700 hover:underline"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-[#071b34] font-bold text-xs rounded-xl mt-2 active:scale-95 transition-transform"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 text-[11px] sm:text-xs text-slate-400">
              Nhập mã đơn hoặc SĐT đã đăng ký để tra cứu tiến độ sản xuất tại chuyền may HUNI.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}