"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/shared/providers/ShopProvider";
import { ArrowRight } from "lucide-react";

// ============================================================
// CẤU HÌNH SLIDER — ÍT CHỮ, KIỂU CHỮ ĐIỆU ĐÀ, BỐ CỤC NGHỆ THUẬT
// ============================================================
const SLIDE_DURATION = 5500; // 5.5 giây tự động chuyển mượt mà

const SLIDES = [
  {
    id: "suits",
    image: "/images/hero_slider_suits.jpg",
    ctaLink: "/dong-phuc-may-do",
    title: "May Đo Doanh Nhân",
    highlight: "Bespoke Thượng Hạng",
    subtitle: "Chuẩn phom dáng Châu Âu • Tôn vinh đẳng cấp",
    ctaPrimary: "Nhận Báo Giá 0đ",
    ctaSecondary: "Khám Phá May Đo",
    highlightColor: "from-amber-200 via-amber-100 to-rose-200",
  },
  {
    id: "polo",
    image: "/images/hero_slider_polo.jpg",
    ctaLink: "/dong-phuc-doanh-nghiep",
    title: "Áo Polo Doanh Nghiệp",
    highlight: "Cotton Compact 4 Chiều",
    subtitle: "Kháng khuẩn Ion Bạc • Mềm mịn & Bền bỉ",
    ctaPrimary: "Báo Giá Polo",
    ctaSecondary: "Xem Bảng Màu",
    highlightColor: "from-teal-200 via-cyan-100 to-emerald-200",
  },
  {
    id: "golf",
    image: "/images/hero_slider_golf.jpg",
    ctaLink: "/dong-phuc-the-thao",
    title: "Thời Trang Thể Thao",
    highlight: "Golf & Dynamic Motion",
    subtitle: "Hạ nhiệt cơ thể 3°C • Tự do mọi cú swing",
    ctaPrimary: "Đặt May Golf",
    ctaSecondary: "Xem Bộ Sưu Tập",
    highlightColor: "from-emerald-200 via-teal-100 to-amber-200",
  },
  {
    id: "school",
    image: "/images/hero_slider_school.jpg",
    ctaLink: "/dong-phuc-truong-hoc",
    title: "Đồng Phục Học Đường",
    highlight: "Thanh Lịch Chuẩn Quốc Tế",
    subtitle: "Sợi tự nhiên lành tính • Năng động & Chuẩn mực",
    ctaPrimary: "Báo Giá Trường Học",
    ctaSecondary: "Xem Mẫu Thiết Kế",
    highlightColor: "from-amber-100 via-rose-100 to-teal-200",
  },
];

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Navigation Handlers
  const goToSlide = useCallback((index) => {
    setCurrentSlide(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-play liên tục 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      }
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const activeSlide = SLIDES[currentSlide];

  return (
    <section
      className="relative w-full h-[calc(100svh-5.5rem)] min-h-[440px] max-h-[700px] overflow-hidden bg-slate-950 select-none"
      aria-label="Hero Banner Slider"
    >
      {/* ============================================================
          1. BACKGROUND ẢNH SLIDE (Ken Burns Zoom + Cross-Fade)
          ============================================================ */}
      <div className="absolute inset-0">
        {SLIDES.map((s, idx) => {
          const isActive = idx === currentSlide;

          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Ảnh nền có zoom chậm rãi tạo chiều sâu */}
              <div
                className={`relative w-full h-full transform transition-transform duration-[6500ms] ease-out ${
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

              {/* Lớp phủ gradient mềm mại bảo vệ độ tương phản chữ */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/10 sm:via-slate-950/40 sm:to-transparent lg:w-[60%]" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* ============================================================
          2. NỘI DUNG CHỮ ÍT, ĐIỆU ĐÀ, SẮP XẾP THANH LỊCH
          ============================================================ */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 h-full flex flex-col justify-center pb-8 sm:pb-12">
        <div className="max-w-xl lg:max-w-2xl">
          {/* HEADLINE: Phối hợp Sans thanh thoát + Serif Italic Điệu Đà */}
          <div
            key={`headline-${currentSlide}`}
            className="animate-in fade-in duration-600 delay-75"
          >
            <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-slate-100/90 tracking-[0.06em] uppercase whitespace-normal break-keep">
              {activeSlide.title}
            </h1>
            <div className={`font-editorial italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-wide leading-[1.14] mt-1 text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.highlightColor} whitespace-normal break-keep drop-shadow-lg`}>
              {activeSlide.highlight}
            </div>
          </div>

          {/* SUBTITLE: Ngắn gọn, 1 câu duy nhất */}
          <p
            key={`subtitle-${currentSlide}`}
            className="text-slate-200/90 text-xs sm:text-sm font-light tracking-wide mt-3 mb-6 sm:mb-8 drop-shadow animate-in fade-in duration-500 delay-100 whitespace-normal break-keep max-w-md leading-relaxed"
          >
            {activeSlide.subtitle}
          </p>

          {/* VỊ TRÍ CÁC NÚT BẤM: 2 nút Pill cân đối, sang trọng */}
          <div
            key={`cta-${currentSlide}`}
            className="flex flex-wrap items-center gap-3 sm:gap-4 animate-in fade-in duration-500 delay-150"
          >
            {/* Primary CTA (Nút gradient thanh mảnh) */}
            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-brand-500 via-brand-600 to-teal-600 hover:from-brand-400 hover:to-teal-500 shadow-lg shadow-teal-950/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <span>{activeSlide.ctaPrimary}</span>
            </button>

            {/* Secondary CTA (Nút kính mờ viền sáng thanh lịch) */}
            <Link
              href={activeSlide.ctaLink}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-normal text-xs sm:text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 backdrop-blur-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 whitespace-nowrap inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>{activeSlide.ctaSecondary}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-white/80" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. DẤU CHẤM TRẮNG TỰ NHIÊN (Pure White Dots — No wrapper)
          ============================================================ */}
      <div className="absolute bottom-5 sm:bottom-6 inset-x-0 z-30 pointer-events-none flex justify-center items-center">
        <div className="pointer-events-auto flex items-center gap-2.5">
          {SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;

            return (
              <button
                key={s.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Chuyển tới slide ${idx + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-2.5 h-2.5 bg-white shadow-md shadow-white/40 scale-125"
                    : "w-2 h-2 bg-white/40 hover:bg-white/80"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}