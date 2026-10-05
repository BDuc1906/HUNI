"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/shared/providers/ShopProvider";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// ============================================================
// CẤU HÌNH SLIDER CHUẨN XƯỞNG MAY HDC
// ============================================================
const SLIDE_DURATION = 4000; // 4 giây tự động chuyển mượt mà

const SLIDES = [
  {
    id: "suits",
    image: "/images/hero_slider_suits.jpg",
    ctaLink: "/dong-phuc-may-do",
    tabTitle: "May Đo Bespoke",
    title: "May Đo Doanh Nhân",
    highlight: "Bespoke Thượng Hạng",
    subtitle: "Chuẩn phom dáng Châu Âu • Đo ni từng nhân sự • Tôn vinh đẳng cấp",
    ctaPrimary: "Nhận Báo Giá 0đ",
    ctaSecondary: "Khám Phá May Đo",
    highlightColor: "from-amber-200 via-amber-100 to-rose-200",
  },
  {
    id: "polo",
    image: "/images/hero_slider_polo.jpg",
    ctaLink: "/dong-phuc-doanh-nghiep",
    tabTitle: "Polo Doanh Nghiệp",
    title: "Áo Polo Doanh Nghiệp",
    highlight: "Cotton Compact 4 Chiều",
    subtitle: "Kháng khuẩn Ion Bạc • Giữ form đứng dáng • Mềm mịn & bền bỉ",
    ctaPrimary: "Báo Giá Polo",
    ctaSecondary: "Xem Bảng Màu",
    highlightColor: "from-teal-200 via-cyan-100 to-emerald-200",
  },
  {
    id: "golf",
    image: "/images/hero_slider_golf.jpg",
    ctaLink: "/dong-phuc-the-thao",
    tabTitle: "Thể Thao & Golf",
    title: "Thời Trang Thể Thao",
    highlight: "Golf & Dynamic Motion",
    subtitle: "Thoát ẩm siêu tốc • Hạ nhiệt cơ thể 3°C • Tự do mọi cú swing",
    ctaPrimary: "Đặt May Golf",
    ctaSecondary: "Xem Bộ Sưu Tập",
    highlightColor: "from-emerald-200 via-teal-100 to-amber-200",
  },
  {
    id: "school",
    image: "/images/hero_slider_school.jpg",
    ctaLink: "/dong-phuc-truong-hoc",
    tabTitle: "Đồng Phục Học Đường",
    title: "Đồng Phục Học Đường",
    highlight: "Thanh Lịch Chuẩn Quốc Tế",
    subtitle: "Sợi tự nhiên lành tính cho làn da • Năng động, thanh lịch & chuẩn mực",
    ctaPrimary: "Báo Giá Trường Học",
    ctaSecondary: "Xem Mẫu Thiết Kế",
    highlightColor: "from-amber-100 via-rose-100 to-teal-200",
  },
];

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Điều hướng chuyển slide
  const goToSlide = useCallback((index) => {
    setCurrentSlide(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Bộ đếm thời gian tự động chạy slide liên tục (4s)
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Điều khiển bằng phím mũi tên
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // Hỗ trợ vuốt chạm trên thiết bị di động
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <section
      className="relative w-full h-[calc(100svh-5rem)] min-h-[460px] max-h-[720px] overflow-hidden bg-slate-950 select-none group"
      aria-label="Hero Banner Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ============================================================
          1. ẢNH NỀN SLIDER (Cross-Fade + Ken Burns Zoom)
          ============================================================ */}
      <div className="absolute inset-0">
        {SLIDES.map((s, idx) => {
          const isActive = idx === currentSlide;

          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div
                className={`relative w-full h-full transform transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={s.image}
                  alt={`${s.title} ${s.highlight}`}
                  fill
                  priority={idx === 0}
                  unoptimized
                  className="object-cover object-center"
                />
              </div>

              {/* Lớp phủ gradient để tôn vinh chữ rõ nét */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20 sm:via-slate-950/45 sm:to-transparent lg:w-[65%]" />
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* ============================================================
          2. THANH TIẾN ĐỘ THỜI GIAN CHẠY SLIDE (TOP PROGRESS BAR)
          ============================================================ */}
      <div className="absolute top-0 inset-x-0 z-30 h-1 bg-white/15">
        <div
          className="h-full bg-gradient-to-r from-[#0097b2] via-teal-300 to-amber-300 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ============================================================
          3. NỘI DUNG CHỮ TRÊN SLIDE HIỆN TẠI
          ============================================================ */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 h-full flex flex-col justify-center pb-12 sm:pb-16">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Badge nhỏ uy tín */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Xưởng May HDC • May Mẫu 0Đ Toàn Quốc</span>
          </div>

          {/* HEADLINE */}
          <div key={`headline-${currentSlide}`} className="animate-in fade-in duration-500">
            <h1 className="text-base sm:text-xl font-light text-slate-200 tracking-wider uppercase">
              {activeSlide.title}
            </h1>
            <div
              className={`font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-wide leading-[1.12] mt-1.5 text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.highlightColor} drop-shadow-md`}
            >
              {activeSlide.highlight}
            </div>
          </div>

          {/* SUBTITLE */}
          <p
            key={`subtitle-${currentSlide}`}
            className="text-slate-300 text-xs sm:text-sm font-light mt-3 mb-6 sm:mb-8 drop-shadow max-w-md leading-relaxed animate-in fade-in duration-500 delay-100"
          >
            {activeSlide.subtitle}
          </p>

          {/* NÚT BẤM KÊU GỌI HÀNH ĐỘNG (CTA) */}
          <div
            key={`cta-${currentSlide}`}
            className="flex flex-wrap items-center gap-3 sm:gap-4 animate-in fade-in duration-500 delay-150"
          >
            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="px-6 sm:px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0097b2] to-[#006e82] hover:from-[#00a8c6] hover:to-[#008199] shadow-lg shadow-[#0097b2]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{activeSlide.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href={activeSlide.ctaLink}
              className="px-5 sm:px-6 py-3 rounded-full font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 backdrop-blur-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{activeSlide.ctaSecondary}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          4. NÚT MŨI TÊN CHUYỂN SLIDE TRÁI & PHẢI (PREV / NEXT ARROWS)
          ============================================================ */}
      <button
        onClick={prevSlide}
        aria-label="Slide trước"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#0097b2] text-white/90 hover:text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide kế tiếp"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#0097b2] text-white/90 hover:text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* ============================================================
          5. THANH TAB & ĐIỀU HƯỚNG SLIDE GÓC DƯỚI (SLIDE TABS)
          ============================================================ */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex justify-center items-center px-4">
        <div className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
          {SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;

            return (
              <button
                key={s.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Chuyển tới slide ${s.tabTitle}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-[#0097b2] text-white shadow-md shadow-[#0097b2]/40 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-white" : "bg-white/40"
                  }`}
                />
                <span className="hidden sm:inline">{s.tabTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}