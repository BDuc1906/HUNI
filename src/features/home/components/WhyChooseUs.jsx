"use client";

import React from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  ShieldCheck,
  Sparkles,
  Scissors,
  BadgePercent,
  Truck,
  HeartHandshake,
  RefreshCw,
  ArrowRight,
  Phone
} from "lucide-react";

const iconMap = {
  ShieldCheck,
  Sparkles,
  Scissors,
  BadgePercent,
  Truck,
  HeartHandshake,
  RefreshCw
};

export default function WhyChooseUs() {
  const { setIsQuickQuoteOpen } = useShop();

  const standardCommitments = BRAND_INFO.commitments.filter((c) => c.id !== "partner");
  const vipCommitment = BRAND_INFO.commitments.find((c) => c.id === "partner");

  return (
    <section id="why-choose-us" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Năng Lực &amp; Cam Kết
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            VÌ SAO DOANH NGHIỆP CHỌN HDC?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Chúng tôi không chỉ may đồng phục — chúng tôi đồng hành xây dựng
            bản sắc thương hiệu vững mạnh cho doanh nghiệp của bạn.
          </p>
        </div>

        {/* 6 Core Cards in balanced 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-6">
          {standardCommitments.map((item) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={item.id}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-[#004f5e] text-base sm:text-lg mb-2 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 7th VIP Master Commitment Banner — Spans Full Width */}
        {vipCommitment && (
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#004f5e] via-[#00677a] to-[#003843] rounded-3xl border border-brand-500/30 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start sm:items-center gap-4 sm:gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shrink-0">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-brand-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Cam Kết Đồng Hành &amp; Dịch Vụ Vàng
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-black text-white">
                  {vipCommitment.title} — Bảo Hành 1 Đổi 1 Trong 30 Ngày
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
                  {vipCommitment.desc} Hỗ trợ may bổ sung số lượng ít trọn đời theo phom mẫu ban đầu khi công ty có nhân sự mới.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto relative z-10 shrink-0">
              <button
                type="button"
                onClick={() => setIsQuickQuoteOpen(true)}
                className="flex-1 lg:flex-initial px-5 sm:px-6 py-3 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Nhận Tư Vấn Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <Phone className="w-4 h-4 text-brand-400" />
                <span className="hidden sm:inline">{BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
