"use client";

import React from "react";
import Image from "next/image";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  Scissors,
  Truck,
  HeartHandshake
} from "lucide-react";

export default function CeoLetterSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section id="ceo-letter-section" className="py-14 sm:py-20 bg-white text-slate-900 relative overflow-hidden border-t border-b border-slate-200">
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
            Main Card
            ============================================= */}
        <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* =========================================
                Left: CEO Portrait
                ========================================= */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />

                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl w-full bg-white aspect-[3/4]">
                  <Image
                    src={BRAND_INFO.ceo.image}
                    alt={BRAND_INFO.ceo.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#071b34] via-[#071b34]/95 to-transparent p-4 sm:p-5 text-white">
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-amber-300 tracking-wide uppercase">
                      {BRAND_INFO.ceo.name}
                    </h3>
                    <div className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider mt-0.5">
                      {BRAND_INFO.ceo.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact card */}
              <div className="mt-4 sm:mt-6 w-full max-w-sm space-y-2 text-left bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm text-[11px] sm:text-xs">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="flex items-center gap-2.5 sm:gap-3 text-[#071b34] hover:text-amber-600 font-extrabold text-xs sm:text-sm transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
                  </div>
                  <span className="truncate">Hotline: {BRAND_INFO.contact.hotline}</span>
                </a>

                <div className="flex items-start gap-2.5 sm:gap-3 text-slate-600 pt-2 border-t border-slate-200">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 flex items-center justify-center text-amber-600 shrink-0">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <strong className="text-[#071b34]">Trụ sở:</strong>{" "}
                    <span className="text-slate-600">{BRAND_INFO.contact.headquarters}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 text-slate-600 pt-2 border-t border-slate-200">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 flex items-center justify-center text-amber-600 shrink-0">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <strong className="text-[#071b34]">VP Hà Nội:</strong>{" "}
                    <span className="text-slate-600">{BRAND_INFO.contact.branchHanoi}</span>
                  </div>
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

              {/* 4 Benefits */}
              <div>
                <div className="text-[#071b34] font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>LỢI ÍCH HỢP TÁC VÀNG:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors flex items-start gap-2.5 sm:gap-3 shadow-sm hover:shadow-md">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#071b34] text-xs sm:text-sm">Chất Lượng Vượt Trội</h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                        Vải dệt công nghệ mới, kháng khuẩn, co giãn 4 chiều.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors flex items-start gap-2.5 sm:gap-3 shadow-sm hover:shadow-md">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#071b34] text-xs sm:text-sm">Thiết Kế Độc Quyền</h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                        Miễn phí phác thảo 3D và may mẫu áo thật duyệt form.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors flex items-start gap-2.5 sm:gap-3 shadow-sm hover:shadow-md">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#071b34] text-xs sm:text-sm">Giá Cả Cạnh Tranh</h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                        Sản xuất khép kín tại xưởng 2.500m², giá gốc tận tay.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors flex items-start gap-2.5 sm:gap-3 shadow-sm hover:shadow-md">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#071b34] text-xs sm:text-sm">Dịch Vụ Tận Tâm</h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                        Bảo hành 1 đổi 1 trong 30 ngày, hỗ trợ may bổ sung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Commitments */}
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
        </div>
      </div>
    </section>
  );
}