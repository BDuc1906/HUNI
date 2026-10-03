"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import { Sparkles, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";

// ============================================================
// SLIDES DATA — 5 slides gốc
// ============================================================
const SLIDES = [
  {
    image: "/images/02_materials_01.jpg",
    focusMobile: "center center",
    focusDesktop: "center center",
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
    image: "/images/08_golf_event_01.jpg",
    focusMobile: "60% 45%",
    focusDesktop: "center 40%",
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
    image: "/images/06_polo_01.jpg",
    focusMobile: "center 20%",
    focusDesktop: "center 22%",
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
    image: "/images/09_kids_school_03.jpg",
    focusMobile: "center 22%",
    focusDesktop: "center 25%",
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
  {
    image: "/images/10_kids_why_02.jpg",
    focusMobile: "center 22%",
    focusDesktop: "center 25%",
    eyebrow: "Dòng Sản Phẩm Trẻ Em",
    title: "ĐỒNG PHỤC HDC KIDS",
    titleHighlight: "VUI NHỘN & AN TOÀN",
    subtitle: "Điểm đến chất lượng cho học sinh",
    description:
      "Vải cotton mềm mại an toàn cho làn da trẻ nhỏ. Bền màu sau 100 lần giặt, thấm hút mồ hôi tốt, thoải mái vận động cả ngày dài.",
    ctaPrimary: "Báo Giá Kids",
    ctaSecondary: "Xem Mẫu",
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
const SWIPE_THRESHOLD = 60;

const N = SLIDES.length;
// ✅ 3 bộ slide liên tiếp → cuộn vòng vô hạn
const SLIDES_TRIPLED = [...SLIDES, ...SLIDES, ...SLIDES];

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  // virtualIndex chạy trong [0, 3N-1], khởi đầu ở đầu bộ giữa (index = N)
  const [virtualIndex, setVirtualIndex] = useState(N);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);

  const sectionRef = useRef(null);
  const virtualIndexRef = useRef(N);
  const isDraggingRef = useRef(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingRef = useRef(false);

  const dragStartXRef = useRef(0);

  const isPausedRef = useRef(false);

  // Slide hiển thị cho content (0..N-1)
  const currentSlide = ((virtualIndex % N) + N) % N;

  // ============================================================
  // ✅ Sync virtualIndex vào ref — luôn có giá trị mới nhất
  // ============================================================
  useEffect(() => {
    virtualIndexRef.current = virtualIndex;
  }, [virtualIndex]);

  // ============================================================
  // ✅ WRAP SILENT — chỉ chạy SAU KHI TRANSITION THỰC SỰ XONG
  // Được gọi từ onTransitionEnd của slides wrapper.
  // Điều kiện: virtualIndex nằm ngoài bộ giữa [N, 2N).
  // ============================================================
  const handleTransitionEnd = useCallback((e) => {
    if (e.propertyName !== "transform") return;
    if (isDraggingRef.current) return;

    const vi = virtualIndexRef.current;
    // Đang trong bộ giữa → không cần wrap
    if (vi >= N && vi < 2 * N) return;

    // Bật noTransition, nhảy silent về bộ giữa
    setNoTransition(true);
    setVirtualIndex((prev) => {
      if (prev < N) return prev + N;
      if (prev >= 2 * N) return prev - N;
      return prev;
    });

    // Tắt noTransition sau khi browser đã paint vị trí mới (2 RAF để chắc)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNoTransition(false));
    });
  }, []);

  // ============================================================
  // NAVIGATION HANDLERS
  // ============================================================
  const goToSlide = useCallback((targetIndex) => {
    // Nhảy tới slide targetIndex trong bộ giữa
    setVirtualIndex(N + targetIndex);
    setDragOffset(0);
  }, []);

  const nextSlide = useCallback(() => {
    setVirtualIndex((prev) => Math.min(prev + 1, 3 * N - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setVirtualIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // ============================================================
  // AUTO-PLAY
  // ============================================================
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current && !isDraggingRef.current) {
        setVirtualIndex((prev) => Math.min(prev + 1, 3 * N - 1));
      }
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // KEYBOARD
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
  // TOUCH SWIPE — mobile
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
        setDragOffset(dx);
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
      setDragOffset(0);

      setTimeout(() => {
        isPausedRef.current = false;
      }, 2500);
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

  // ============================================================
  // MOUSE DRAG — desktop
  // ============================================================
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handlePointerDown = (e) => {
      if (e.pointerType !== "mouse") return;
      if (e.button !== 0) return;

      const target = e.target;
      if (
        target.closest("button, a, input, textarea, select, [role='button']")
      ) {
        return;
      }

      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartXRef.current = e.clientX;
      setDragOffset(0);
      isPausedRef.current = true;

      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      if (e.pointerType !== "mouse") return;

      const offset = e.clientX - dragStartXRef.current;
      setDragOffset(offset);
    };

    const handlePointerUp = (e) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      const offset = e.clientX - dragStartXRef.current;

      if (Math.abs(offset) > SWIPE_THRESHOLD) {
        if (offset < 0) nextSlide();
        else prevSlide();
      }

      setDragOffset(0);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      setTimeout(() => {
        isPausedRef.current = false;
      }, 2000);
    };

    el.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[currentSlide];
  const translateX = `calc(-${virtualIndex * 100}% + ${dragOffset}px)`;
  const disableTransition = isDragging || noTransition;

  return (
    <section
      ref={sectionRef}
      className={`
        relative w-full h-[100svh] min-h-[540px] sm:min-h-[600px] max-h-[900px]
        overflow-hidden bg-[#00222a] select-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
      `}
      style={{ touchAction: "pan-y", maxWidth: "1920px", margin: "0 auto" }}
    >
      {/* ============================================
          SLIDES WRAPPER — 15 slides (3 bộ) chạy vô hạn
          ✅ onTransitionEnd → wrap silent sau khi animation xong
          ============================================ */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className="absolute inset-0 flex"
        style={{
          transform: `translateX(${translateX})`,
          transitionProperty: "transform",
          transitionDuration: disableTransition
            ? "0ms"
            : `${TRANSITION_DURATION}ms`,
          transitionTimingFunction: "ease-out",
          willChange: "transform",
        }}
      >
        {SLIDES_TRIPLED.map((s, idx) => (
          <div
            key={idx}
            className="relative w-full h-full flex-shrink-0 bg-[#00222a]"
            aria-hidden={idx !== virtualIndex}
          >
            <div
              className="absolute inset-0 lg:left-[32%]"
              style={{
                "--pos-m": s.focusMobile,
                "--pos-d": s.focusDesktop,
              }}
            >
              <Image
                src={s.image}
                alt={s.title + " " + s.titleHighlight}
                fill
                sizes="(min-width: 1920px) 68vw, (min-width: 1024px) 68vw, (min-width: 640px) 100vw, 100vw"
                quality={92}
                priority={idx === N}
                loading={idx === N ? undefined : "lazy"}
                draggable={false}
                className="object-cover [object-position:var(--pos-m)] lg:[object-position:var(--pos-d)] pointer-events-none"
              />

              <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[#00222a]/90 via-[#00222a]/45 to-[#00222a]/25 pointer-events-none" />
              <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#00222a] via-[#00222a]/55 to-transparent to-[55%] pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 hidden lg:block h-40 bg-gradient-to-t from-[#00222a]/70 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* ============================================
          CONTENT OVERLAY
          ============================================ */}
      <div className="relative z-10 h-full flex flex-col pointer-events-none justify-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-64 sm:pb-56 md:pb-48 lg:pb-44 pointer-events-auto">
          <div className="max-w-3xl">
            <div
              key={`eyebrow-${currentSlide}`}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5 animate-in fade-in slide-in-from-left-4 duration-500 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-300 shrink-0" />
              <span>{slide.eyebrow}</span>
            </div>

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

            <p
              key={`sub-${currentSlide}`}
              className="text-brand-200 font-medium text-sm sm:text-base italic mb-3 sm:mb-5 animate-in fade-in slide-in-from-left-4 duration-500 delay-100 text-balance drop-shadow-md"
            >
              &ldquo;{slide.subtitle}&rdquo;
            </p>

            <p
              key={`desc-${currentSlide}`}
              className="text-slate-100 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-xl mb-5 sm:mb-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 text-pretty drop-shadow-md"
            >
              {slide.description}
            </p>

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

        {/* STATS BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00222a]/95 to-transparent pt-8 pb-5 sm:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto flex items-center justify-center gap-0.5 mb-3">
              {SLIDES.map((_, idx) => {
                const active = idx === currentSlide;

                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Đến slide ${idx + 1}`}
                    className="p-3 -m-1 flex items-center justify-center rounded-full transition-transform active:scale-90"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        active
                          ? "w-10 sm:w-14 bg-brand-400 shadow-[0_0_12px_rgba(51,176,203,0.6)]"
                          : "w-2 sm:w-3 bg-white/50"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

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
    </section>
  );
}