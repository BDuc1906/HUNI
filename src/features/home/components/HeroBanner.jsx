"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

// ============================================================
// SLIDES DATA — 5 slides
// Title tách 2 dòng: title (trắng) + titleHighlight (xanh)
// ============================================================
const SLIDES = [
  {
    image: "/images/catalogue-2026-hero.jpg",
    eyebrow: "Bộ Sưu Tập 2026",
    title: "CHẤT LIỆU XANH",
    titleHighlight: "BỀN VỮNG",
    subtitle: "Tinh hoa thiên nhiên Việt Nam",
    description:
      "5 chất liệu tự nhiên độc quyền: Modal, Bamboo, Sợi Bạc Hà, Sợi Sen, Sợi Chuối. Kết hợp công nghệ Seamless không đường may + họa tiết văn hóa Việt.",
    highlight: "BST Chất liệu xanh 2026",
    ctaPrimary: "Xem Bảng Vải",
    ctaSecondary: "Báo Giá Ngay",
    ctaLink: "/bang-vai",
  },
  {
    image: "/images/uniform_corporate_suits.jpg",
    eyebrow: "Đẳng Cấp Lãnh Đạo",
    title: "NÂNG TẦM THƯƠNG HIỆU",
    titleHighlight: "CÙNG HDC FASHION",
    subtitle: "Vest doanh nhân may đo chuẩn Ý",
    description:
      "Bộ sưu tập Vest & Sơ mi cao cấp dành riêng cho Ban lãnh đạo, cấp quản lý. Đo ni tận nơi bởi đội ngũ thợ may nhiều năm kinh nghiệm.",
    highlight: "Vest doanh nhân",
    ctaPrimary: "Nhận Báo Giá 0đ",
    ctaSecondary: "Xem BST Vest",
    ctaLink: "/dong-phuc-may-do",
  },
  {
    image: "/images/06_polo_01.jpg",
    eyebrow: "Bán Chạy Nhất 2026",
    title: "ÁO POLO DOANH NGHIỆP",
    titleHighlight: "HDC CLASSIC",
    subtitle: "Vải cá sấu Cotton Compact 4 chiều",
    description:
      "Dòng áo Polo đồng phục chủ lực được nhiều doanh nghiệp tin dùng. Vải kháng khuẩn ion bạc, co giãn 4 chiều, bền màu sau 100 lần giặt.",
    highlight: "Polo Classic",
    ctaPrimary: "Đặt Polo Ngay",
    ctaSecondary: "Xem Bảng Màu",
    ctaLink: "/dong-phuc-doanh-nghiep",
  },
  {
    image: "/images/uniform_sport_golf.jpg",
    eyebrow: "Công Nghệ AeroCool",
    title: "ĐỒNG PHỤC CÁC GIẢI",
    titleHighlight: "THỂ THAO & GOLF",
    subtitle: "Golf, Pickleball, Marathon, Team building",
    description:
      "Công nghệ làm mát AeroCool hạ nhiệt cơ thể 3°C. Chống tia UV UPF 50+. Co giãn 4 chiều cho cú swing chuẩn xác.",
    highlight: "Golf & Thể thao",
    ctaPrimary: "Đặt Golf Ngay",
    ctaSecondary: "Xem Ảnh Giải",
    ctaLink: "/dong-phuc-the-thao",
  },
  {
    image: "/images/uniform_school_students.jpg",
    eyebrow: "Chuẩn Quốc Tế",
    title: "ĐỒNG PHỤC TRƯỜNG HỌC",
    titleHighlight: "CAO CẤP",
    subtitle: "Học sinh các cấp, sinh viên, giáo viên",
    description:
      "Chuẩn phom dáng quốc tế, vải mềm mại an toàn cho làn da học sinh. Váy xếp ly có quần lót an toàn. Huy hiệu trường thêu Tajima sắc sảo.",
    highlight: "Trường học",
    ctaPrimary: "Báo Giá Trường",
    ctaSecondary: "Xem Album",
    ctaLink: "/dong-phuc-truong-hoc",
  },
];

const CHECKLIST = [
  "Thiết kế 3D free",
  "May mẫu thử 0đ",
  "Đo tận nơi",
  "Chiết khấu sỉ cao",
  "Bảo hành 30 ngày",
  "Giao toàn quốc",
];

const SLIDE_DURATION = 6000;
const TRANSITION_DURATION = 700;

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const goToSlide = useCallback((index) => {
    const total = SLIDES.length;
    setCurrentSlide(((index % total) + total) % total);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  // Auto-play + progress
  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(percent);

      if (elapsed >= SLIDE_DURATION) {
        nextSlide();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, nextSlide]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // Touch
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTimeout(() => setIsPaused(false), 3000);
  };

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden bg-slate-900">
      {/* ============================================
          SLIDES — TRƯỢT NGANG
          ============================================ */}
      <div
        className="absolute inset-0 flex transition-transform ease-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className="relative w-full h-full flex-shrink-0"
            aria-hidden={idx !== currentSlide}
          >
            <Image
              src={s.image}
              alt={s.title + " " + s.titleHighlight}
              fill
              sizes="100vw"
              quality={92}
              priority={idx === 0}
              className="object-cover object-center"
            />

            {/* Gradient overlay nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00222a]/75 via-[#00222a]/50 to-[#00222a]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00222a]/70 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* ============================================
          CONTENT OVERLAY
          ============================================ */}
      <div className="relative z-10 h-full flex flex-col justify-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-40 sm:pb-48 lg:pb-44 pointer-events-auto">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div
              key={`eyebrow-${currentSlide}`}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5 animate-in fade-in slide-in-from-left-4 duration-500 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-300 shrink-0" />
              <span>{slide.eyebrow}</span>
            </div>

            {/* ============================================
                TITLE — Tách 2 dòng: trắng trên, xanh dưới
                ============================================ */}
            <div
              key={`title-${currentSlide}`}
              className="mb-3 sm:mb-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-75"
            >
              {/* Dòng 1 — Trắng */}
              <h1 className="text-[28px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[60px] font-black tracking-tight text-white text-balance drop-shadow-lg">
                {slide.title}
              </h1>

              {/* Dòng 2 — Xanh */}
              <h2 className="text-[26px] leading-[1.15] sm:text-3xl md:text-4xl lg:text-[48px] xl:text-[54px] font-black tracking-tight text-brand-gradient text-balance drop-shadow-lg mt-1 sm:mt-1.5">
                {slide.titleHighlight}
              </h2>
            </div>

            {/* Subtitle */}
            <p
              key={`sub-${currentSlide}`}
              className="text-brand-200 font-medium text-sm sm:text-base italic mb-3 sm:mb-5 animate-in fade-in slide-in-from-left-4 duration-500 delay-100 text-balance drop-shadow-md"
            >
              &ldquo;{slide.subtitle}&rdquo;
            </p>

            {/* Description */}
            <p
              key={`desc-${currentSlide}`}
              className="text-slate-100 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-xl mb-5 sm:mb-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 text-pretty drop-shadow-md"
            >
              {slide.description}
            </p>

            {/* Checklist */}
            <div
              key={`check-${currentSlide}`}
              className="hidden md:grid grid-cols-3 gap-x-4 gap-y-2 mb-6 sm:mb-7 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500 delay-200"
            >
              {CHECKLIST.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs lg:text-sm text-white font-medium whitespace-nowrap drop-shadow"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-300 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              key={`cta-${currentSlide}`}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-300"
            >
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-5 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-[13px] sm:text-sm rounded-2xl shadow-2xl shadow-brand-500/40 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <Link
                href={slide.ctaLink}
                className="px-5 sm:px-7 py-3.5 sm:py-4 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-bold text-[13px] sm:text-sm rounded-2xl border border-white/35 hover:border-white/60 flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <span>{slide.ctaSecondary}</span>
              </Link>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-3 sm:px-4 py-3 text-white hover:text-brand-200 font-bold text-[13px] sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap drop-shadow"
              >
                <PhoneCall className="w-4 h-4 text-brand-300 animate-pulse shrink-0" />
                <span>{BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ============================================
            STATS BAR
            ============================================ */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00222a]/95 to-transparent pt-8 pb-5 sm:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {BRAND_INFO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/15 hover:border-brand-400/50 rounded-xl p-2.5 sm:p-3 transition-colors min-w-0"
                >
                  <div className="text-lg sm:text-xl lg:text-2xl font-black text-brand-300 leading-none whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white mt-1.5 leading-tight line-clamp-1">
                    {stat.label}
                  </div>
                  <div className="hidden sm:block text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows desktop */}
      <button
        onClick={prevSlide}
        aria-label="Slide trước"
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 hover:border-white/50 text-white items-center justify-center transition-all active:scale-95 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide sau"
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 hover:border-white/50 text-white items-center justify-center transition-all active:scale-95 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? "Tiếp tục slideshow" : "Tạm dừng slideshow"}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all active:scale-95"
        >
          {isPaused ? (
            <Play className="w-4 h-4 fill-current" />
          ) : (
            <Pause className="w-4 h-4 fill-current" />
          )}
        </button>

        <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold tabular-nums whitespace-nowrap">
          {String(currentSlide + 1).padStart(2, "0")}{" "}
          <span className="text-white/60">/</span>{" "}
          {String(SLIDES.length).padStart(2, "0")}
        </div>
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-28 sm:bottom-32 lg:bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => {
          const active = idx === currentSlide;

          return (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Đến slide ${idx + 1}`}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                active
                  ? "w-10 sm:w-14 bg-white/40"
                  : "w-2 sm:w-3 bg-white/50 hover:bg-white/70"
              }`}
            >
              {active && (
                <span
                  className="absolute inset-y-0 left-0 bg-brand-400 rounded-full"
                  style={{
                    width: `${progress}%`,
                    transition: isPaused ? "none" : "width 50ms linear",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Label góc dưới trái */}
      <div className="hidden lg:block absolute bottom-28 left-4 sm:left-6 z-20 max-w-xs">
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-1 whitespace-nowrap drop-shadow">
          Đang xem
        </div>
        <div className="text-white text-sm font-bold leading-tight drop-shadow">
          {slide.highlight}
        </div>
      </div>
    </section>
  );
}