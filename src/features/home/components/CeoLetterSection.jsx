"use client";

import React from "react";
import Image from "next/image";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Award,
  Scissors,
  Truck,
  HeartHandshake
} from "lucide-react";

export default function CeoLetterSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="ceo-letter-section"
      className="py-14 sm:py-20 bg-white text-slate-900 relative overflow-hidden border-t border-b border-slate-200"
    >
      {/* Ambient gold glow */}
      <div className="absolute top-1/4 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-amber-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-slate-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* =============================================
            BANNER tmht.jpg
            ============================================= */}
        <div className="max-w-6xl mx-auto mb-10 sm:mb-14">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-2xl sm:rounded-3xl blur-md opacity-20 pointer-events-none" />

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
              <Image
                src={BRAND_INFO.ceo.banner}
                alt="Thư mời hợp tác - HUNI UNIFORM"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* =============================================
            Section Header
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            Lời Ngỏ Từ Nhà Sáng Lập
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#071b34]">
            THƯ MỜI HỢP TÁC
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gold-gradient">
            Nâng tầm thương hiệu cùng HUNI UNIFORM
          </p>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mt-2" />
        </div>

        {/* =============================================
            Main Card — 2 columns
            ============================================= */}
        <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* =========================================
                Left: CEO Portrait — hiển thị đầy đủ 100% ảnh
                ========================================= */}
            <div className="lg:col-span-5">
              <div className="relative group w-full max-w-md mx-auto">
                <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />

                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl bg-white">
                  <Image
                    src={BRAND_INFO.ceo.image}
                    alt={BRAND_INFO.ceo.name}
                    width={600}
                    height={750}
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="w-full h-auto block"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* =========================================
                Right: Letter Content
                ========================================= */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="text-[#071b34] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Về HUNI UNIFORM:</span>
                </div>
                <p className="text-slate-700 text-[13px] sm:text-sm md:text-base leading-relaxed text-justify">
                  {BRAND_INFO.ceo.bio}
                </p>
                <p className="text-slate-600 text-[13px] sm:text-sm italic font-medium border-l-4 border-amber-400 pl-3 sm:pl-4 py-1">
                  &ldquo;Chúng tôi tin rằng, mỗi bộ đồng phục không chỉ là trang phục công sở đơn thuần,
                  mà còn là niềm tự hào, đại diện cho bản sắc văn hóa và đẳng cấp của một tập thể.&rdquo;
                </p>
              </div>

              {/* 5 Commitments row */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-2 text-[11px] sm:text-xs text-slate-700">
                  <span className="flex items-center gap-1.5 text-[#071b34] font-bold">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Chất lượng
                  </span>
                  <span className="flex items-center gap-1.5 text-[#071b34] font-bold">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Thiết kế
                  </span>
                  <span className="flex items-center gap-1.5 text-[#071b34] font-bold">
                    <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> May đo
                  </span>
                  <span className="flex items-center gap-1.5 text-[#071b34] font-bold">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Giao hàng
                  </span>
                  <span className="flex items-center gap-1.5 text-[#071b34] font-bold">
                    <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Đồng hành
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => setIsQuickQuoteOpen(true)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <span>Nhận Báo Giá & Mẫu Vải Miễn Phí</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-[#071b34] border-2 border-[#071b34] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Phone className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                  <span>Kết nối CEO</span>
                </a>
              </div>
            </div>
          </div>

          {/* =========================================
              Contact info — full width, 3 cột
              ========================================= */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="flex items-start gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Hotline / Zalo
                </div>
                <div className="font-extrabold text-[#071b34] text-xs sm:text-sm mt-0.5">
                  {BRAND_INFO.contact.hotline}
                </div>
              </div>
            </a>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Trụ sở chính
                </div>
                <div className="font-bold text-[#071b34] text-[11px] sm:text-xs mt-0.5 leading-snug">
                  {BRAND_INFO.contact.headquarters}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Chi nhánh Hà Nội
                </div>
                <div className="font-bold text-[#071b34] text-[11px] sm:text-xs mt-0.5 leading-snug">
                  {BRAND_INFO.contact.branchHanoi}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}