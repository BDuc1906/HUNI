"use client";

import React from "react";
import { PROCESS_STEPS } from "@/shared/data";
import { PhoneCall, Palette, Ruler, Factory, CheckCircle2, ArrowRight } from "lucide-react";

export default function ProcessSection() {
  const iconMap = {
    PhoneCall: PhoneCall,
    Palette: Palette,
    Ruler: Ruler,
    Factory: Factory,
    CheckCircle2: CheckCircle2
  };

  return (
    <section id="process-section" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
            Quy Trình Khép Kín
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071b34]">
            5 BƯỚC MAY ĐỒNG PHỤC CHUYÊN NGHIỆP TẠI HUNI
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Quy trình chuẩn hóa giúp khách hàng hoàn toàn yên tâm về chất lượng mẫu thử,
            tiến độ giao hàng và dịch vụ hậu mãi.
          </p>
        </div>

        {/* Process Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {PROCESS_STEPS.map((item, idx) => {
            const Icon = iconMap[item.icon] || CheckCircle2;

            return (
              <div
                key={idx}
                className="relative bg-slate-50 hover:bg-amber-50/50 p-6 rounded-3xl border border-slate-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-xl transform hover:-translate-y-1"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-amber-500/80 group-hover:text-amber-600 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-[#071b34] text-slate-800 flex items-center justify-center shadow-sm transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-[#071b34] text-base mb-2 group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/80 text-[11px] text-amber-700 font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <span>Cam kết đúng tiến độ</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}