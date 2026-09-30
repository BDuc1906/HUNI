"use client";

import React from "react";
import { BRAND_INFO } from "@/shared/data";
import {
  ShieldCheck,
  Sparkles,
  Scissors,
  BadgePercent,
  Truck,
  HeartHandshake,
  RefreshCw
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
  return (
    <section id="why-choose-us" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Vì Sao Chọn HDC
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            VÌ SAO DOANH NGHIỆP CHỌN HDC?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Chúng tôi không chỉ may đồng phục — chúng tôi đồng hành xây dựng
            bản sắc thương hiệu cho doanh nghiệp của bạn.
          </p>
        </div>

        {/* 7 USP Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {BRAND_INFO.commitments.map((item) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={item.id}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
