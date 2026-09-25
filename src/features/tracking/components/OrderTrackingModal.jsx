"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
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

    // Find in user's placed orders
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === query ||
        (o.customer?.phone && o.customer.phone.includes(query))
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      // Mock demo order if typing demo code
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#071b34] text-white p-5 flex items-center justify-between border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 text-[#071b34] font-black flex items-center justify-center text-sm">
              HN
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Tra Cứu Tiến Độ Đơn May Đồng Phục
              </h3>
              <p className="text-xs text-cyan-200/80">HỆ THỐNG QUẢN LÝ TIẾN ĐỘ SẢN XUẤT HUNI</p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Nhập mã đơn (VD: HN-123456) hoặc Số điện thoại đặt hàng..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#071b34] hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm rounded-2xl shadow transition-colors shrink-0"
            >
              Tra cứu
            </button>
          </form>

          {/* Results Display */}
          {searched && searchedOrder ? (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs text-slate-700 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">Mã đơn hàng: </span>
                    <strong className="text-cyan-900 font-black text-sm">{searchedOrder.id}</strong>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    {searchedOrder.status || "Đang xử lý tại xưởng"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 border-t border-cyan-200">
                  <div>
                    Khách hàng: <strong>{searchedOrder.customer?.fullName}</strong>
                  </div>
                  <div>
                    Số điện thoại: <strong>{searchedOrder.customer?.phone}</strong>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Tiến độ sản xuất thực tế tại xưởng:
                </h4>

                <div className="space-y-3">
                  {steps.map((st, i) => {
                    const isDone = i <= (searchedOrder.currentStep || 2);
                    const isCurrent = i === (searchedOrder.currentStep || 2);
                    const Icon = st.icon;

                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-cyan-50/80 border-cyan-400 ring-2 ring-cyan-500/20"
                            : isDone
                            ? "bg-emerald-50/40 border-emerald-200 text-slate-700"
                            : "bg-slate-50 border-slate-200 opacity-50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#071b34] flex items-center justify-between">
                            <span>{st.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-cyan-400 text-black px-2 py-0.5 rounded-full font-bold animate-pulse">
                                Đang thực hiện
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hotline support */}
              <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                Cần cập nhật hoặc điều chỉnh số đo gấp? Gọi ngay hotline xưởng:{" "}
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="font-bold text-cyan-700 hover:underline"
                >
                  {BRAND_INFO.contact.hotline}
                </a>
              </div>
            </div>
          ) : searched ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-bold text-slate-700">
                Không tìm thấy đơn hàng với thông tin &ldquo;{searchInput}&rdquo;
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Vui lòng kiểm tra lại mã đơn hoặc số điện thoại. Hoặc kết nối hotline để kiểm tra ngay lập tức.
              </p>
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 text-[#071b34] font-bold text-xs rounded-xl mt-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Hotline: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              Nhập mã đơn hàng hoặc số điện thoại đã đăng ký để tra cứu tiến độ sản xuất tại chuyền may HUNI.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}