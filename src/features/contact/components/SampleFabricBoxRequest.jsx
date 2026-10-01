"use client";

import React, { useState } from "react";
import {
  PackageOpen,
  Sparkles,
  Check,
  Send,
  Truck,
  ShieldCheck,
  Layers,
  ArrowRight,
  Gift,
} from "lucide-react";
import { useShop } from "@/shared/providers/ShopProvider";

const SAMPLE_FABRICS = [
  {
    id: "cotton_compact",
    name: "Cotton Compact 4 Chiều",
    badge: "Bán chạy nhất",
    desc: "Chuyên may áo Polo cao cấp, êm ái, co giãn đa chiều, không xù lông.",
  },
  {
    id: "bamboo_silk",
    name: "Bamboo Silk Sợi Tre",
    badge: "Công sở cao cấp",
    desc: "Sơ mi & polo mềm rũ nhẹ, kháng khuẩn tự nhiên, thấm hút mồ hôi vượt trội.",
  },
  {
    id: "lacoste_poly",
    name: "Cá Sấu Poly Kháng Khuẩn",
    badge: "Bền màu 100 lần giặt",
    desc: "Đồng phục sản xuất, showroom, chuỗi cửa hàng, giữ form cứng cáp.",
  },
  {
    id: "wool_cashmere",
    name: "Wool Pha Cashmere Ý",
    badge: "Dành cho Vest Lãnh Đạo",
    desc: "Dòng vải cao cấp định lượng 320g/m², chuẩn phom vest Ý sang trọng.",
  },
  {
    id: "aerocool",
    name: "AeroCool Thể Thao",
    badge: "Golf & Marathon",
    desc: "Hạ nhiệt cơ thể 3°C, chống tia cực tím UPF 50+, co giãn swing tối đa.",
  },
];

export default function SampleFabricBoxRequest() {
  const { showToast, triggerConfetti } = useShop();

  const [selectedFabrics, setSelectedFabrics] = useState([
    "cotton_compact",
    "bamboo_silk",
  ]);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleFabric = (id) => {
    setSelectedFabrics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRequestSampleBox = (e) => {
    e.preventDefault();
    if (!receiverName.trim() || !receiverPhone.trim() || !receiverAddress.trim()) {
      showToast("Vui lòng điền đủ Tên, Số điện thoại và Địa chỉ nhận hộp mẫu vải", "error");
      return;
    }

    if (selectedFabrics.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 loại vải bạn muốn thử nghiệm", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      triggerConfetti();
      showToast("Đã gửi yêu cầu nhận Hộp Mẫu Vải! HDC sẽ đóng gói gửi bưu điện ngay.");
    }, 700);
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] rounded-3xl p-6 sm:p-10 md:p-12 text-white border border-brand-400/25 shadow-2xl relative overflow-hidden">
          {/* Subtle light accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left info & fabric selector */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30">
                <Gift className="w-4 h-4 text-brand-300" />
                Dịch Vụ Trải Nghiệm Doanh Nghiệp 0đ
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  NHẬN HỘP MẪU VẢI &amp; CATALOGUE <br />
                  <span className="text-brand-gradient">TẬN VĂN PHÒNG HOÀN TOÀN MIỄN PHÍ</span>
                </h2>
                <p className="text-slate-200 text-xs sm:text-sm md:text-base mt-2.5 leading-relaxed">
                  Doanh nghiệp bạn muốn sờ tận tay, cảm nhận độ dày, độ mềm mịn và kiểm tra độ bền màu
                  của chất liệu vải trước khi ký hợp đồng? HDC tặng miễn phí 100% hộp swatch mẫu vải &amp;
                  bảng màu chi tiết giao hỏa tốc đến tận bàn làm việc của bạn.
                </p>
              </div>

              {/* Fabric Picker Cards */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  <span>Chọn các chất liệu vải bạn quan tâm:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_FABRICS.map((fabric) => {
                    const isChecked = selectedFabrics.includes(fabric.id);
                    return (
                      <div
                        key={fabric.id}
                        onClick={() => toggleFabric(fabric.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                          isChecked
                            ? "bg-white/20 border-brand-300 text-white shadow-md"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            isChecked
                              ? "bg-brand-400 border-brand-400 text-slate-900"
                              : "border-white/30"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-white">{fabric.name}</span>
                            <span className="text-[10px] text-brand-300 font-bold px-1.5 py-0.5 rounded bg-white/10">
                              {fabric.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {fabric.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-300" />
                  Freeship toàn quốc
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-300" />
                  Không cam kết mua hàng
                </span>
              </div>
            </div>

            {/* Right Quick Address Form */}
            <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-black text-[#004f5e]">
                    ĐÃ TIẾP NHẬN YÊU CẦU!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    HDC Fashion sẽ đóng gói <strong>{selectedFabrics.length} mẫu vải</strong> cùng cuốn
                    Catalogue mới nhất gửi đến:
                    <br />
                    <strong className="text-slate-800 mt-1 block">
                      {receiverName} — {receiverPhone}
                    </strong>
                    <span className="text-xs text-slate-500">{receiverAddress}</span>
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setReceiverName("");
                      setReceiverPhone("");
                      setReceiverAddress("");
                      setCompanyName("");
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Đăng ký hộp khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestSampleBox} className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base sm:text-lg font-black text-[#004f5e]">
                      Địa Chỉ Nhận Hộp Mẫu Vải
                    </h3>
                    <p className="text-xs text-slate-500">
                      Gửi bưu điện EMS / Chuyển phát nhanh đến tận công ty của bạn
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên người nhận <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Người nhận mẫu vải"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-brand-500 ring-2 ring-brand-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        placeholder="0984 xxx xxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-brand-500 ring-2 ring-brand-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tên công ty / Tổ chức
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Tên công ty"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-brand-500 ring-2 ring-brand-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Địa chỉ nhận bưu phẩm cụ thể <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={receiverAddress}
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      placeholder="Số nhà, tên tòa nhà, phòng ban, đường phố, phường/xã, quận/huyện, tỉnh/TP..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-brand-500 ring-2 ring-brand-50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <PackageOpen className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? "Đang gửi đăng ký..."
                        : `GỬI HỘP MẪU VẢI MIỄN PHÍ (${selectedFabrics.length} MẪU)`}
                    </span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    Bưu phẩm được gửi chuyển phát nhanh và người nhận không phải thanh toán bất kỳ chi phí nào.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
