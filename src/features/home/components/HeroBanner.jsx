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
} from "lucide-react";

// ============================================================
// SLIDES DATA — Ảnh phân giải cao, sắc nét, không bị vỡ ảnh
// ============================================================
const SLIDES = [
  {
    image: "/images/01_portraits_01.jpg",
    fallbackImage: "/images/uniform_corporate_suits.jpg",
    eyebrow: "BỘ SƯU TẬP 2026 • ĐẲNG CẤP LÃNH ĐẠO",
    title: "SƠ MI & VEST CÔNG SỞ",
    titleHighlight: "CHUẨN PHOM DOANH NHÂN",
    subtitle: "Vải Bamboo sợi tre & Kate Ý cao cấp chống nhăn tuyệt đối",
    description:
      "Dòng sơ mi nam công sở và vest lãnh đạo may đo bespoke chuẩn phom dáng châu Âu. Hỗ trợ chuyên viên mang thước đo và mẫu vải đến tận văn phòng.",
    highlight: "Sơ mi & Vest Lãnh Đạo",
    tags: ["Form Regular & Slimfit", "Chống nhăn 100 giặt", "Bamboo kháng khuẩn"],
    ctaPrimary: "Nhận Báo Giá & May Mẫu 0đ",
    ctaSecondary: "Xem Sơ Mi Doanh Nghiệp",
    ctaLink: "/dong-phuc-doanh-nghiep/ao-so-mi",
  },
  {
    image: "/images/06_polo_01.jpg",
    fallbackImage: "/images/05_bestseller_shirts_01.jpg",
    eyebrow: "BÁN CHẠY NHẤT 2026 • 50.000+ DOANH NGHIỆP TIN DÙNG",
    title: "ÁO POLO ĐỒNG PHỤC",
    titleHighlight: "CÁ SẤU COMPACT 4C",
    subtitle: "Vải cá sấu dệt sợi Cotton Compact co giãn 4 chiều",
    description:
      "Dòng Polo chủ lực bền màu, giữ phom cổ áo sau 100 lần giặt. Kháng khuẩn ion bạc khử mùi hôi cơ thể, thêu logo vi tính Tajima chuẩn xác từng milimet.",
    highlight: "Áo Polo Cao Cấp",
    tags: ["Cotton Compact 100%", "Co giãn 4 chiều", "Thêu logo 3D"],
    ctaPrimary: "Đặt Polo Doanh Nghiệp",
    ctaSecondary: "Xem Bảng Màu & Bảng Size",
    ctaLink: "/dong-phuc-doanh-nghiep/ao-polo",
  },
  {
    image: "/images/07_corporate_golf_03.jpg",
    fallbackImage: "/images/08_golf_event_03.jpg",
    eyebrow: "CÔNG NGHỆ AEROCOOL • CHỐNG TIA UV UPF 50+",
    title: "ĐỒNG PHỤC CÁC GIẢI",
    titleHighlight: "THỂ THAO & GOLF 2026",
    subtitle: "Golf, Pickleball, Marathon & Teambuilding năng động",
    description:
      "Vải Dry-fit dệt tổ ong làm mát cơ thể tức thì, thấm hút mồ hôi siêu tốc. Tự tin bứt phá trong mọi cú swing và giải chạy phong trào doanh nghiệp.",
    highlight: "Golf & Thể Thao Doanh Nghiệp",
    tags: ["Công nghệ AeroCool", "Hạ nhiệt 3°C", "Co giãn tối đa"],
    ctaPrimary: "Đặt Đồng Phục Thể Thao",
    ctaSecondary: "Xem Mẫu Giải Đấu",
    ctaLink: "/dong-phuc-the-thao",
  },
  {
    image: "/images/tmht.jpg",
    fallbackImage: "/images/01_portraits_02.jpg",
    eyebrow: "TRỰC TIẾP TẬN XƯỞNG • QUY MÔ 2.500M²",
    title: "SẢN XUẤT TRỰC TIẾP",
    titleHighlight: "GIÁ SỈ TẬN GỐC HDC",
    subtitle: "Công suất 50.000 sản phẩm / tháng — Không qua trung gian",
    description:
      "Hệ thống chuyền may công nghiệp hiện đại cùng đội ngũ thợ lành nghề gần 10 năm kinh nghiệm. Cam kết đúng tiến độ 100%, bảo hành 1 đổi 1 trong 30 ngày.",
    highlight: "Xưởng Sản Xuất Trực Tiếp",
    tags: ["Xưởng may 2.500m²", "50.000 SP/tháng", "Bảo hành 1 đổi 1"],
    ctaPrimary: "Yêu Cầu Báo Giá Sỉ",
    ctaSecondary: "Xem Quy Trình Sản Xuất",
    ctaLink: "/quy-trinh-may",
  },
];

// Checklist điểm mạnh tinh gọn
const CHECKLIST = [
  "Thiết kế 2D/3D miễn phí",
  "May mẫu thử 0đ tận nơi",
  "Đo size tại văn phòng",
  "Chiết khấu sỉ cực cao",
  "Bảo hành 1 đổi 1 (30 ngày)",
  "Giao hàng toàn quốc",
];

const SLIDE_DURATION = 6000;
const TRANSITION_DURATION = 600;

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgSrcMap, setImgSrcMap] = useState({});

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

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const tickInterval = 50;

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

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // Touch handlers
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

  const handleImageError = (index) => {
    setImgSrcMap((prev) => ({
      ...prev,
      [index]: SLIDES[index].fallbackImage || "/images/tmht.jpg",
    }));
  };

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full min-h-[480px] lg:h-[calc(100vh-140px)] lg:max-h-[610px] lg:min-h-[500px] overflow-hidden bg-[#001c23] flex flex-col justify-between">
      {/* ============================================
          1. SLIDES BACKGROUND (translateX)
          ============================================ */}
      <div
        className="absolute inset-0 flex transition-transform ease-out z-0"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((s, idx) => {
          const currentSrc = imgSrcMap[idx] || s.image;
          return (
            <div
              key={idx}
              className="relative w-full h-full flex-shrink-0"
              aria-hidden={idx !== currentSlide}
            >
              <Image
                src={currentSrc}
                alt={s.title + " " + s.titleHighlight}
                fill
                sizes="100vw"
                quality={90}
                priority={idx === 0}
                onError={() => handleImageError(idx)}
                className="object-cover object-center sm:object-[center_30%]"
              />

              {/* Lớp phủ chuyển sắc thông minh: Đảm bảo chữ trắng đọc rõ 100%, không bị chìm */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#001c23]/95 via-[#001c23]/75 md:via-[#001c23]/55 to-[#001c23]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001c23] via-transparent to-[#001c23]/40" />
            </div>
          );
        })}
      </div>

      {/* ============================================
          2. CONTENT TRUNG TÂM (CÂN ĐỐI GỌN GÀNG, KHÔNG TRÀN)
          ============================================ */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center pt-2 sm:pt-4 md:pt-5 pb-1">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* TIÊU ĐỀ & NÚT HÀNH ĐỘNG */}
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <div
              key={`eyebrow-${currentSlide}`}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-2 animate-in fade-in slide-in-from-left-4 duration-500 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-300 shrink-0" />
              <span>{slide.eyebrow}</span>
            </div>

            {/* Title — Kích thước cân đối, không làm tràn trang */}
            <div
              key={`title-${currentSlide}`}
              className="space-y-0.5 mb-1.5 animate-in fade-in slide-in-from-left-4 duration-500 delay-75"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-black tracking-tight text-white leading-tight">
                {slide.title}
              </h1>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-black tracking-tight text-brand-gradient leading-tight">
                {slide.titleHighlight}
              </h1>
            </div>

            {/* Subtitle */}
            <p
              key={`sub-${currentSlide}`}
              className="text-brand-300 font-semibold text-xs sm:text-sm md:text-base italic mb-1.5 animate-in fade-in slide-in-from-left-4 duration-500 delay-100"
            >
              &ldquo;{slide.subtitle}&rdquo;
            </p>

            {/* Description */}
            <p
              key={`desc-${currentSlide}`}
              className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mb-2.5 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 line-clamp-2 sm:line-clamp-2"
            >
              {slide.description}
            </p>

            {/* Checklist tinh gọn */}
            <div
              key={`check-${currentSlide}`}
              className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 max-w-lg animate-in fade-in slide-in-from-left-4 duration-500 delay-200"
            >
              {CHECKLIST.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-100 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              key={`cta-${currentSlide}`}
              className="flex flex-wrap items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-300"
            >
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <Link
                href={slide.ctaLink}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/25 hover:border-white/45 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>{slide.ctaSecondary}</span>
              </Link>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-3 py-2 text-white hover:text-brand-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-brand-400 animate-pulse shrink-0" />
                <span className="hidden sm:inline">{BRAND_INFO.contact.hotline}</span>
                <span className="sm:hidden">Gọi ngay</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================
          3. PHẦN ĐÁY (Thanh Dots & Thanh số liệu Stats)
          ============================================ */}
      <div className="relative z-10 w-full mt-auto pb-3 sm:pb-3.5 pt-1 bg-gradient-to-t from-[#001c23] via-[#001c23]/80 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hàng 1: Nút Dots */}
          <div className="flex items-center justify-start mb-2 sm:mb-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SLIDES.map((_, idx) => {
                const active = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Đến slide ${idx + 1}`}
                    className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                      active ? "w-8 sm:w-12 bg-white/25" : "w-2 sm:w-3 bg-white/40 hover:bg-white/60"
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
          </div>

          {/* Hàng 2: Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
            {BRAND_INFO.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 sm:p-2.5 transition-colors flex items-center gap-2.5"
              >
                <div className="text-base sm:text-lg lg:text-xl font-black text-brand-300 shrink-0">
                  {stat.value}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold text-white truncate">
                    {stat.label}
                  </div>
                  <div className="hidden sm:block text-[10px] text-slate-400 truncate">
                    {stat.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}