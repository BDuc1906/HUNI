"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
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
// SLIDES DATA — mỗi slide có ảnh + text + CTA riêng
// ============================================================
const SLIDES = [
  {
    image: "/images/uniform_corporate_suits.jpg",
    eyebrow: "Đẳng Cấp Lãnh Đạo",
    title: "NÂNG TẦM THƯƠNG HIỆU",
    titleHighlight: "CÙNG HDC FASHION",
    subtitle: "Vest doanh nhân may đo chuẩn Ý",
    description:
      "Bộ sưu tập Vest & Sơ mi cao cấp dành riêng cho Ban lãnh đạo, cấp quản lý. Đo ni tận nơi bởi đội ngũ thợ may 15+ năm kinh nghiệm.",
    highlight: "Vest doanh nhân",
    ctaPrimary: "Nhận Báo Giá & May Mẫu 0đ",
    ctaSecondary: "Xem Bộ Sưu Tập Vest",
    ctaLink: "/dong-phuc-may-do",
  },
  {
    image: "/images/uniform_polo_corporate.jpg",
    eyebrow: "Bán Chạy Nhất 2026",
    title: "ÁO POLO DOANH NGHIỆP",
    titleHighlight: "HDC CLASSIC",
    subtitle: "Vải cá sấu Cotton Compact 4 chiều",
    description:
      "Dòng áo Polo đồng phục chủ lực được hơn 50.000+ doanh nghiệp tin dùng. Vải kháng khuẩn ion bạc, co giãn 4 chiều, bền màu sau 100 lần giặt.",
    highlight: "Polo Classic",
    ctaPrimary: "Đặt Polo Doanh Nghiệp",
    ctaSecondary: "Xem Bảng Màu & Size",
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
    ctaPrimary: "Đặt Đồng Phục Golf",
    ctaSecondary: "Xem Ảnh Giải Đấu",
    ctaLink: "/dong-phuc-the-thao",
  },
  {
    image: "/images/uniform_school_students.jpg",
    eyebrow: "Chuẩn Quốc Tế",
    title: "ĐỒNG PHỤC",
    titleHighlight: "TRƯỜNG HỌC CAO CẤP",
    subtitle: "Học sinh các cấp, sinh viên, giáo viên",
    description:
      "Chuẩn phom dáng quốc tế, vải mềm mại an toàn cho làn da học sinh. Váy xếp ly có quần lót an toàn. Huy hiệu trường thêu Tajima sắc sảo.",
    highlight: "Trường học",
    ctaPrimary: "Nhận Báo Giá Trường Học",
    ctaSecondary: "Xem Album Thực Tế",
    ctaLink: "/dong-phuc-truong-hoc",
  },
];

// ============================================================
// CHECKLIST — điểm mạnh chung cho mọi slide
// ============================================================
const CHECKLIST = [
  "Thiết kế 3D miễn phí",
  "May mẫu thử 0 đồng",
  "Hỗ trợ đo tận nơi",
  "Chiết khấu sỉ cực cao",
  "Bảo hành 1 đổi 1",
  "Giao hàng toàn quốc",
];

// ============================================================
// SLIDE DURATION (ms)
// ============================================================
const SLIDE_DURATION = 5500;
const TRANSITION_DURATION = 700; // phải khớp với duration-700 trong className

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch handling
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // ============================================================
  // NAVIGATION
  // ============================================================
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

  // ============================================================
  // AUTO-PLAY + PROGRESS BAR
  // ============================================================
  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const tickInterval = 50; // update progress mỗi 50ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(percent);

      if (elapsed >= SLIDE_DURATION) {
        nextSlide();
      }
    }, tickInterval);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, nextSlide]);

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // ============================================================
  // TOUCH / SWIPE HANDLERS
  // ============================================================
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
    const SWIPE_THRESHOLD = 50;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }

    setTimeout(() => setIsPaused(false), 3000);
  };

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden bg-slate-900">
      {/* ============================================
          SLIDES — TRƯỢT NGANG (translateX)
          Container chứa tất cả slides xếp hàng ngang
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
            {/* Background Image */}
            <Image
              src={s.image}
              alt={s.title + " " + s.titleHighlight}
              fill
              sizes="100vw"
              quality={90}
              priority={idx === 0}
              className="object-cover object-center"
            />

            {/* Gradient Overlay — tối 2 bên, sáng giữa */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00222a]/95 via-[#00222a]/70 to-[#00222a]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00222a]/80 via-transparent to-[#00222a]/40" />
          </div>
        ))}
      </div>

      {/* ============================================
          CONTENT OVERLAY — Text + CTA
          ============================================ */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <div
              key={`eyebrow-${currentSlide}`}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 animate-in fade-in slide-in-from-left-4 duration-500"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>{slide.eyebrow}</span>
            </div>

            {/* Title */}
            <div
              key={`title-${currentSlide}`}
              className="space-y-1 mb-3 sm:mb-5 animate-in fade-in slide-in-from-left-4 duration-500 delay-75"
            >
              <h1 className="text-[32px] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
                {slide.title}
              </h1>
              <h1 className="text-[32px] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-brand-gradient">
                {slide.titleHighlight}
              </h1>
            </div>

            {/* Subtitle */}
            <p
              key={`sub-${currentSlide}`}
              className="text-brand-300 font-medium text-sm sm:text-base lg:text-lg italic mb-4 sm:mb-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-100"
            >
              &ldquo;{slide.subtitle}&rdquo;
            </p>

            {/* Description */}
            <p
              key={`desc-${currentSlide}`}
              className="text-slate-200 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-xl mb-6 sm:mb-8 animate-in fade-in slide-in-from-left-4 duration-500 delay-150"
            >
              {slide.description}
            </p>

            {/* Checklist — desktop only */}
            <div
              key={`check-${currentSlide}`}
              className="hidden md:grid grid-cols-2 gap-x-6 gap-y-2 mb-8 max-w-xl animate-in fade-in slide-in-from-left-4 duration-500 delay-200"
            >
              {CHECKLIST.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs lg:text-sm text-slate-100 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              key={`cta-${currentSlide}`}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-300"
            >
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-5 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-[13px] sm:text-sm rounded-2xl shadow-2xl shadow-brand-500/40 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-[0.98] transition-all"
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={slide.ctaLink}
                className="px-5 sm:px-7 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-[13px] sm:text-sm rounded-2xl border border-white/30 hover:border-white/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span>{slide.ctaSecondary}</span>
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-3 sm:px-4 py-3 text-white hover:text-brand-300 font-bold text-[13px] sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-brand-400 animate-pulse shrink-0" />
                <span className="hidden sm:inline">
                  {BRAND_INFO.contact.hotline}
                </span>
                <span className="sm:hidden">Gọi ngay</span>
              </a>
            </div>
          </div>
        </div>

        {/* ============================================
            STATS BAR — Gắn đáy màn hình
            ============================================ */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00222a] to-transparent pt-8 pb-6 sm:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {BRAND_INFO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-brand-400/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 transition-colors"
                >
                  <div className="text-lg sm:text-2xl lg:text-3xl font-black text-brand-400 leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-white mt-1 leading-tight">
                    {stat.label}
                  </div>
                  <div className="hidden sm:block text-[10px] lg:text-xs text-slate-400 truncate mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          ARROWS NAVIGATION — Chỉ hiện trên desktop
          ============================================ */}
      <button
        onClick={prevSlide}
        aria-label="Slide trước"
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 text-white items-center justify-center transition-all active:scale-95 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide sau"
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 text-white items-center justify-center transition-all active:scale-95 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ============================================
          BOTTOM CONTROLS — Dots + Play/Pause + Counter
          ============================================ */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? "Tiếp tục slideshow" : "Tạm dừng slideshow"}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all active:scale-95"
        >
          {isPaused ? (
            <Play className="w-4 h-4 fill-current" />
          ) : (
            <Pause className="w-4 h-4 fill-current" />
          )}
        </button>

        {/* Counter */}
        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tabular-nums">
          {String(currentSlide + 1).padStart(2, "0")}{" "}
          <span className="text-white/50">/</span>{" "}
          {String(SLIDES.length).padStart(2, "0")}
        </div>
      </div>

      {/* Dots — Căn giữa, phía trên stats bar */}
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
                  ? "w-10 sm:w-14 bg-white/30"
                  : "w-2 sm:w-3 bg-white/40 hover:bg-white/60"
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

      {/* ============================================
          Slide label — góc dưới trái, hiện trên desktop
          ============================================ */}
      <div className="hidden lg:block absolute bottom-28 left-4 sm:left-6 z-20 max-w-xs">
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">
          Đang xem
        </div>
        <div className="text-white text-sm font-bold leading-tight">
          {slide.highlight}
        </div>
      </div>
    </section>
  );
}