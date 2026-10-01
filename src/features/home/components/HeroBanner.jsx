"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import { Sparkles, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";

// ============================================================
// SLIDES DATA — 5 slides
// ============================================================
const SLIDES = [
  {
    image: "/images/catalogue-2026-hero.jpg",
    position: "top",
    eyebrow: "Bộ Sưu Tập 2026",
    title: "CHẤT LIỆU XANH",
    titleHighlight: "BỀN VỮNG",
    subtitle: "Tinh hoa thiên nhiên Việt Nam",
    description:
      "5 chất liệu tự nhiên độc quyền: Modal, Bamboo, Sợi Bạc Hà, Sợi Sen, Sợi Chuối. Kết hợp công nghệ Seamless không đường may + họa tiết văn hóa Việt.",
    ctaPrimary: "Xem Bảng Vải",
    ctaSecondary: "Báo Giá Ngay",
    ctaLink: "/bang-vai",
  },
  {
    image: "/images/uniform_corporate_suits.jpg",
    position: "top",
    eyebrow: "Đẳng Cấp Lãnh Đạo",
    title: "NÂNG TẦM THƯƠNG HIỆU",
    titleHighlight: "CÙNG HDC FASHION",
    subtitle: "Vest doanh nhân may đo chuẩn Ý",
    description:
      "Bộ sưu tập Vest & Sơ mi cao cấp dành riêng cho Ban lãnh đạo, cấp quản lý. Đo ni tận nơi bởi đội ngũ thợ may nhiều năm kinh nghiệm.",
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

const TRANSITION_DURATION = 700;
const SLIDE_DURATION = 6000;
const SWIPE_THRESHOLD = 50;

const POSITION_CLASS = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);

  const sectionRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingRef = useRef(false);
  const isPausedRef = useRef(false);

  // ============================================================
  // NAVIGATION HANDLERS
  // ============================================================
  const goToSlide = useCallback((index) => {
    const total = SLIDES.length;
    setCurrentSlide(((index % total) + total) % total);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // ============================================================
  // AUTO-PLAY — Tự chuyển slide mỗi 6 giây
  // Tạm dừng khi user đang tương tác, resume sau 3 giây
  // ============================================================
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // KEYBOARD NAVIGATION — Desktop dùng ← →
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
  // TOUCH SWIPE — Native event listener với passive: false
  // ============================================================
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      isSwipingRef.current = false;
      isPausedRef.current = true;
    };

    const onTouchMove = (e) => {
      const dx = e.touches[0].clientX - touchStartXRef.current;
      const dy = e.touches[0].clientY - touchStartYRef.current;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isSwipingRef.current = true;
        if (e.cancelable) e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;

      if (isSwipingRef.current && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }

      isSwipingRef.current = false;

      setTimeout(() => {
        isPausedRef.current = false;
      }, 3000);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden bg-slate-900"
      style={{ touchAction: "pan-y" }}
    >
      {/* ============================================
          SLIDES — TRƯỢT NGANG
          ============================================ */}
      <div
        className="absolute inset-0 flex transition-transform ease-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      >
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className="relative w-full h-full flex-shrink-0"
            aria-hidden={idx !== currentSlide}
          >
            {s.fit === "contain" && (
              <Image
                src={s.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                quality={75}
                className="object-cover object-center scale-110 blur-2xl opacity-80"
              />
            )}

            <Image
              src={s.image}
              alt={s.title + " " + s.titleHighlight}
              fill
              sizes="100vw"
              quality={90}
              priority={idx === 0}
              className={`${
                s.fit === "contain" ? "object-contain" : "object-cover"
              } ${POSITION_CLASS[s.position || "center"]}`}
            />

            {!s.hideText && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#00222a]/55 via-[#00222a]/20 to-transparent" />
            )}
          </div>
        ))}
      </div>

      {/* ============================================
          CONTENT OVERLAY
          ============================================ */}
      <div
        className={`relative z-10 h-full flex flex-col pointer-events-none ${
          slide.hideText ? "justify-end" : "justify-center"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-40 sm:pb-48 lg:pb-44 pointer-events-auto">
          <div className="max-w-3xl">
            {!slide.hideText && (
              <>
                {/* Eyebrow */}
                <div
                  key={`eyebrow-${currentSlide}`}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5 animate-in fade-in slide-in-from-left-4 duration-500 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                  <span>{slide.eyebrow}</span>
                </div>

                {/* TITLE — 2 dòng */}
                <div
                  key={`title-${currentSlide}`}
                  className="mb-3 sm:mb-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-75"
                >
                  <h1 className="text-[28px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[60px] font-black tracking-tight text-white text-balance drop-shadow-lg">
                    {slide.title}
                  </h1>
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
              </>
            )}

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

      {/* ============================================
          DOTS NAVIGATION — Bấm để chuyển slide
          ============================================ */}
      <div className="absolute bottom-28 sm:bottom-32 lg:bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => {
          const active = idx === currentSlide;

          return (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Đến slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active
                  ? "w-10 sm:w-14 bg-brand-400"
                  : "w-2 sm:w-3 bg-white/50 hover:bg-white/70"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}