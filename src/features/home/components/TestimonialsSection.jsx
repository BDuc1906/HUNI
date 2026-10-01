"use client";

import React from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  Quote,
  Phone,
  ArrowRight,
  Award,
  Pencil,
  Scissors,
  Truck,
  HeartHandshake,
} from "lucide-react";

// ============================================================
// CEO QUOTE + 5 CAM KẾT VÀNG
// Style giống banner HUNI: nền navy, icon tròn viền vàng
// ============================================================

const COMMITMENTS = [
  { icon: Award, label: "CHẤT LƯỢNG", label2: "CAM KẾT" },
  { icon: Pencil, label: "THIẾT KẾ", label2: "ĐỘC QUYỀN" },
  { icon: Scissors, label: "MAY ĐO", label2: "CHUYÊN NGHIỆP" },
  { icon: Truck, label: "GIAO HÀNG", label2: "ĐÚNG HẸN" },
  { icon: HeartHandshake, label: "ĐỒNG HÀNH", label2: "LÂU DÀI" },
];

export default function TestimonialsSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="ceo-quote-section"
      className="py-14 sm:py-20 bg-white border-t border-slate-200 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 relative z-10">
        {/* ============================================
            CEO QUOTE CARD
            ============================================ */}
        <div className="relative bg-gradient-to-br from-[#001a3d] via-[#00284f] to-[#001a3d] rounded-3xl p-6 sm:p-10 md:p-12 border border-amber-400/30 shadow-2xl overflow-hidden mb-8 sm:mb-10">
          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            {/* Quote icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mx-auto mb-6">
              <Quote className="w-7 h-7 text-white" />
            </div>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-relaxed mb-8 max-w-3xl mx-auto">
              &ldquo;HUNI —{" "}
              <span className="text-amber-300">
                Đồng hành cùng doanh nghiệp
              </span>
              , nâng tầm thương hiệu qua từng bộ đồng phục!&rdquo;
            </p>

            {/* Author */}
            <div className="inline-flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shrink-0 border-2 border-white/20">
                TT
              </div>
              <div className="text-left">
                <div className="font-extrabold text-white text-base sm:text-lg">
                  {BRAND_INFO.ceo.name}
                </div>
                <div className="text-amber-300 text-xs sm:text-sm font-semibold">
                  Founder &amp; CEO HDC GROUP VN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            5 CAM KẾT VÀNG — Style giống banner HUNI
            ============================================ */}
        <div className="bg-gradient-to-br from-[#001a3d] via-[#00284f] to-[#001a3d] rounded-3xl p-5 sm:p-7 border border-amber-400/30 shadow-2xl overflow-hidden relative">
          {/* Glow effects */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Grid 5 cam kết */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-3 md:gap-4">
              {COMMITMENTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left"
                  >
                    {/* Icon tròn viền vàng */}
                    <div className="relative w-14 h-14 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0 bg-[#001a3d]/50">
                      <Icon
                        className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Text 2 dòng */}
                    <div className="min-w-0">
                      <div className="text-white font-black text-[11px] sm:text-[11px] md:text-xs leading-tight uppercase tracking-wide">
                        {item.label}
                      </div>
                      <div className="text-white font-black text-[11px] sm:text-[11px] md:text-xs leading-tight uppercase tracking-wide">
                        {item.label2}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================
            CTA — Liên hệ CEO
            ============================================ */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Nhận Báo Giá Miễn Phí</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <a
            href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-[#004f5e] border-2 border-[#004f5e] font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-brand-600 animate-pulse shrink-0" />
            <span>Hotline: {BRAND_INFO.contact.hotline}</span>
          </a>
        </div>
      </div>
    </section>
  );
}