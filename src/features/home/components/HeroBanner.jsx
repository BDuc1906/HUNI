"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Scissors
} from "lucide-react";

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const slides = [
    {
      title: "Đồng Phục Doanh Nhân & Doanh Nghiệp",
      sub: "Vest may đo cao cấp & Sơ mi form chuẩn Ý",
      image: "/images/uniform_corporate_suits.jpg",
      badge: "Đẳng Cấp Lãnh Đạo"
    },
    {
      title: "Áo Polo Doanh Nghiệp HUNI Classic",
      sub: "Vải cá sấu Cotton Compact 4 chiều kháng khuẩn",
      image: "/images/uniform_polo_corporate.jpg",
      badge: "Bán Chạy Nhất"
    },
    {
      title: "Đồng Phục Các Giải Thể Thao",
      sub: "Golf, Pickleball, Marathon, Teambuilding năng động",
      image: "/images/uniform_sport_golf.jpg",
      badge: "Công Nghệ AeroCool"
    },
    {
      title: "Đồng Phục Học Sinh & Giáo Viên",
      sub: "Chuẩn form quốc tế, thanh lịch và bền bỉ",
      image: "/images/uniform_school_students.jpg",
      badge: "Trường Học Chuẩn Quốc Tế"
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative bg-white text-slate-900 pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden border-b border-slate-200">
      {/* Subtle gold ambient glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-10 left-10 w-60 sm:w-80 h-60 sm:h-80 bg-slate-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* =============================================
              LEFT COLUMN
              ============================================= */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] sm:text-xs md:text-sm font-semibold">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span className="truncate">HDC GROUP VN • THƯƠNG HIỆU HUNI UNIFORM</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-[26px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#071b34]">
                NÂNG TẦM{" "}
                <span className="text-gold-gradient">THƯƠNG HIỆU</span>
                <br />
                CÙNG HUNI UNIFORM
              </h1>
              <p className="text-slate-600 font-medium text-sm sm:text-base lg:text-lg italic">
                &ldquo;{BRAND_INFO.slogan}&rdquo;
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-2xl">
              Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục cao cấp cho hơn{" "}
              <strong className="text-[#071b34] font-bold">
                50.000+ doanh nghiệp, tổ chức và trường học
              </strong>
              . Sản xuất trực tiếp tại xưởng với quy mô 2.500m², cam kết chất lượng vượt trội,
              giá gốc tận xưởng và may mẫu duyệt form 0đ.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1 sm:pt-2 text-[11px] sm:text-xs md:text-sm font-medium text-slate-700">
              {[
                "Thiết kế 3D miễn phí",
                "May mẫu thử 0 đồng",
                "Hỗ trợ đo tận nơi",
                "Chiết khấu sỉ cực cao",
                "Bảo hành 1 đổi 1 30 ngày",
                "Giao hàng toàn quốc"
              ].map((txt) => (
                <div key={txt} className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{txt}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-2 sm:pt-3">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-extrabold text-[13px] sm:text-sm md:text-base rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 sm:gap-2.5 transition-all transform hover:-translate-y-1 active:scale-[0.98]"
              >
                <span>Nhận Báo Giá &amp; May Mẫu 0đ</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>

              <a
                href="#catalog-section"
                className="px-5 sm:px-6 py-3 sm:py-4 bg-transparent hover:bg-slate-50 text-[#071b34] font-semibold text-[13px] sm:text-sm md:text-base rounded-2xl border-2 border-[#071b34] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Xem Bộ Sưu Tập</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-3 sm:px-4 py-2.5 sm:py-4 text-[#071b34] hover:text-amber-600 font-bold text-[13px] sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-amber-500 animate-bounce shrink-0" />
                <span>{BRAND_INFO.contact.hotline}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-200">
              {BRAND_INFO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200"
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-amber-600 leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#071b34] leading-tight mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =============================================
              RIGHT COLUMN — Showcase Slider
              ============================================= */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Gold frame glow */}
              <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl blur-md opacity-25" />

              <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
                {/* Slider */}
                <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={slides[activeSlide].image}
                    alt={slides[activeSlide].title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top transition-all duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b34]/70 via-transparent to-transparent" />

                  {/* Top badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-[#071b34] font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-full shadow-lg">
                    {slides[activeSlide].badge}
                  </div>

                  {/* Slide details */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#071b34] leading-tight">
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-amber-700 font-semibold mt-0.5">
                      {slides[activeSlide].sub}
                    </p>
                  </div>
                </div>

                {/* Indicators + CEO link */}
                <div className="p-2.5 sm:p-3 bg-slate-50 flex items-center justify-between border-t border-slate-200 text-xs gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all ${
                          activeSlide === idx
                            ? "w-5 sm:w-6 bg-amber-500"
                            : "w-1.5 sm:w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                        title={`Xem slide ${idx + 1}`}
                        aria-label={`Xem slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <a
                    href="#ceo-letter-section"
                    className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-[#071b34] text-[10px] sm:text-xs font-medium min-w-0"
                  >
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-amber-400 shrink-0">
                      <Image
                        src={BRAND_INFO.ceo.image}
                        alt={BRAND_INFO.ceo.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate hidden sm:inline">Thư ngỏ CEO Nguyễn Thị Thương</span>
                    <span className="truncate sm:hidden">CEO HUNI</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Floating tag */}
              <div className="absolute -bottom-3 sm:-bottom-5 left-2 sm:left-4 bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 shadow-2xl flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-[#071b34]">May Đo Tận Nơi</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    Thợ may 15 năm kinh nghiệm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}