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
    <section className="relative bg-white text-slate-900 pt-6 sm:pt-10 pb-10 sm:pb-16 overflow-hidden border-b border-slate-200">
      {/* Subtle gold ambient glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-10 left-10 w-60 sm:w-80 h-60 sm:h-80 bg-slate-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* =============================================
            GRID — Cột chữ 7/12, cột ảnh 5/12 (rộng hơn)
            ============================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center">
          {/* =============================================
              LEFT COLUMN — Cột chữ
              ============================================= */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Top Badge — lockup đẹp hơn */}
            <div className="inline-flex items-center gap-2 px-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[11px] sm:text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="uppercase tracking-wider">HDC GROUP VN</span>
              </span>
              <span className="w-px h-4 bg-amber-400/50" />
              <span className="pr-3 pl-1 py-1.5 text-slate-500">
                Thương hiệu HUNI Uniform
              </span>
            </div>

            {/* =============================================
                MAIN TITLE — fix ngắt dòng "THƯƠNG HIỆU"
                ============================================= */}
            <h1 className="text-[28px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#071b34]">
              {/* Dòng 1: 2 từ giữ liền — dùng inline-block + whitespace-nowrap */}
              <span className="block">
                Nâng tầm{" "}
                <span className="text-gold-gradient whitespace-nowrap">
                  thương hiệu
                </span>
              </span>
              {/* Dòng 2 */}
              <span className="block mt-1">
                cùng HUNI Uniform
              </span>
            </h1>

            {/* Slogan + đường kẻ vàng */}
            <div className="space-y-2.5">
              <p className="text-slate-600 font-medium text-sm sm:text-base italic">
                &ldquo;{BRAND_INFO.slogan}&rdquo;
              </p>
              <div className="h-0.5 w-16 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent rounded-full" />
            </div>

            {/* Description */}
            <p className="text-slate-600 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-2xl">
              Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục cao cấp cho hơn{" "}
              <strong className="text-[#071b34] font-bold">
                50.000+ doanh nghiệp, tổ chức và trường học
              </strong>
              . Sản xuất trực tiếp tại xưởng 2.500m² — cam kết chất lượng vượt trội,
              giá gốc tận xưởng và may mẫu duyệt form 0đ.
            </p>

            {/* Checklist — 2 cột, khoảng cách đều */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-1 text-[12px] sm:text-sm font-medium text-slate-700">
              {[
                "Thiết kế 3D miễn phí",
                "May mẫu thử 0 đồng",
                "Hỗ trợ đo tận nơi",
                "Chiết khấu sỉ cực cao",
                "Bảo hành 1 đổi 1 trong 30 ngày",
                "Giao hàng toàn quốc"
              ].map((txt) => (
                <div key={txt} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{txt}</span>
                </div>
              ))}
            </div>

            {/* =============================================
                CTA cluster — layout gọn hơn
                ============================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 sm:pt-3">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-6 sm:px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-extrabold text-[13px] sm:text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Nhận Báo Giá &amp; May Mẫu 0đ</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href="#catalog-section"
                className="px-5 sm:px-6 py-3.5 bg-transparent hover:bg-slate-50 text-[#071b34] font-bold text-[13px] sm:text-sm rounded-2xl border-2 border-[#071b34]/80 hover:border-[#071b34] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Xem Bộ Sưu Tập</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-2 py-2 text-[#071b34] hover:text-amber-600 font-bold text-[13px] sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">
                  {BRAND_INFO.contact.hotline}
                </span>
              </a>
            </div>

            {/* =============================================
                Stats bar — có đường phân cách visual
                ============================================= */}
            <div className="pt-5 sm:pt-7 mt-2 border-t border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {BRAND_INFO.stats.map((stat, idx) => (
                  <div key={idx} className="relative">
                    <div className="text-xl sm:text-2xl font-black text-amber-600 leading-none tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-xs font-bold text-[#071b34] leading-tight mt-1.5">
                      {stat.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 leading-snug mt-0.5">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =============================================
              RIGHT COLUMN — Showcase Slider
              ============================================= */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b34]/80 via-[#071b34]/20 to-transparent" />

                  {/* Top badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-[#071b34] font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-full shadow-lg">
                    {slides[activeSlide].badge}
                  </div>

                  {/* Slide details */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#071b34] leading-tight">
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-amber-700 font-semibold mt-1">
                      {slides[activeSlide].sub}
                    </p>
                  </div>
                </div>

                {/* Bottom bar — dots + CEO link */}
                <div className="px-3 py-2.5 bg-slate-50 flex items-center justify-between border-t border-slate-200 gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          activeSlide === idx
                            ? "w-6 bg-amber-500"
                            : "w-1.5 bg-slate-300 hover:bg-slate-400"
                        }`}
                        title={`Xem slide ${idx + 1}`}
                        aria-label={`Xem slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <a
                    href="#ceo-letter-section"
                    className="flex items-center gap-2 text-slate-600 hover:text-[#071b34] text-[10px] sm:text-xs font-medium min-w-0 transition-colors"
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
                    <span className="truncate hidden sm:inline">
                      Thư ngỏ CEO Nguyễn Thị Thương
                    </span>
                    <span className="truncate sm:hidden">CEO HUNI</span>
                    <ArrowRight className="w-3 h-3 text-amber-500 shrink-0" />
                  </a>
                </div>
              </div>

              {/* =============================================
                  Floating tag "May Đo Tận Nơi"
                  → Chuyển xuống DƯỚI ảnh, căn trái, không đè ảnh
                  ============================================= */}
              <div className="mt-4 sm:mt-5 flex items-center gap-3 px-3.5 py-3 bg-white rounded-2xl border border-slate-200 shadow-lg max-w-fit">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="pr-1">
                  <div className="text-[11px] sm:text-xs font-extrabold text-[#071b34] leading-tight">
                    May Đo Tận Nơi
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
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