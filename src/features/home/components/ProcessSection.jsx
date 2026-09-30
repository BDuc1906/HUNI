"use client";

import React from "react";
import { PROCESS_STEPS } from "@/shared/data";
import { PhoneCall, Palette, Ruler, Factory, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function ProcessSection() {
  const iconMap = {
    PhoneCall,
    Palette,
    Ruler,
    Factory,
    CheckCircle2
  };

  const stepBadges = [
    "Tư vấn 24/7",
    "Thiết kế 3D 0đ",
    "May mẫu thử",
    "KCS nghiêm ngặt",
    "Giao toàn quốc"
  ];

  return (
    <section id="process-section" className="py-16 sm:py-20 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Quy Trình Khép Kín 5 Bước
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            5 BƯỚC MAY ĐỒNG PHỤC CHUYÊN NGHIỆP TẠI HDC
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            Quy trình chuẩn hóa khép kín từ khâu tư vấn, thiết kế, may mẫu thử đến sản xuất hàng loạt —
            đảm bảo chính xác từng đường kim mũi chỉ và chuẩn tiến độ hợp đồng.
          </p>
        </div>

        {/* Process Steps Timeline */}
        <div className="relative">
          {/* Desktop Flow Connecting Line */}
          <div className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
            {PROCESS_STEPS.map((item, idx) => {
              const Icon = iconMap[item.icon] || CheckCircle2;
              const badge = stepBadges[idx];

              return (
                <div
                  key={idx}
                  className="relative bg-slate-50 hover:bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 hover:border-brand-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl transform hover:-translate-y-1.5"
                >
                  <div>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#004f5e] to-brand-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                        {item.step}
                      </div>

                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 group-hover:border-brand-400 group-hover:bg-brand-50 text-slate-700 group-hover:text-brand-700 flex items-center justify-center shadow-xs transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="inline-block px-2 py-0.5 rounded-full bg-brand-100/70 text-brand-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                      {badge}
                    </div>

                    <h3 className="font-extrabold text-[#004f5e] text-sm sm:text-base mb-2 group-hover:text-brand-800 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 text-[11px] text-brand-700 font-bold flex items-center justify-between">
                    <span>Cam kết chuẩn mẫu</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
