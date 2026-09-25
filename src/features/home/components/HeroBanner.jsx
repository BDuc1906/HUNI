"use client";

import React, { useState, useEffect } from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/context/ShopContext";
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
    <section className="relative bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pt-8 pb-16 overflow-hidden border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Decorative neutral glows (no color) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-neutral-100 dark:bg-neutral-900 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neutral-100 dark:bg-neutral-900 rounded-full blur-3xl pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>HDC GROUP VN • THƯƠNG HIỆU HUNI UNIFORM</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-neutral-900 dark:text-white">
                NÂNG TẦM THƯƠNG HIỆU
                <br />
                CÙNG HUNI UNIFORM
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 font-medium text-base sm:text-lg italic">
                &ldquo;{BRAND_INFO.slogan}&rdquo;
              </p>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục cao cấp cho hơn{" "}
              <strong className="text-neutral-900 dark:text-white font-semibold">
                50.000+ doanh nghiệp, tổ chức và trường học
              </strong>
              . Sản xuất trực tiếp tại xưởng với quy mô 2.500m², cam kết chất lượng vượt trội,
              giá gốc tận xưởng và may mẫu duyệt form 0đ.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {[
                "Thiết kế 3D miễn phí",
                "May mẫu thử 0 đồng",
                "Hỗ trợ đo tận nơi",
                "Chiết khấu sỉ cực cao",
                "Bảo hành 1 đổi 1 30 ngày",
                "Giao hàng toàn quốc"
              ].map((txt) => (
                <div key={txt} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-extrabold text-sm sm:text-base rounded-2xl shadow-lg flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-1"
              >
                <span>Nhận Báo Giá &amp; May Mẫu 0đ</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#catalog-section"
                className="px-6 py-4 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white font-semibold text-sm sm:text-base rounded-2xl border-2 border-neutral-900 dark:border-white flex items-center justify-center gap-2 transition-all"
              >
                <span>Xem Bộ Sưu Tập</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-4 py-4 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{BRAND_INFO.contact.hotline}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              {BRAND_INFO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-500 truncate">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-3xl blur-md opacity-40" />

              <div className="relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                {/* Slider */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={slides[activeSlide].image}
                    alt={slides[activeSlide].title}
                    className="w-full h-full object-cover object-center transition-all duration-700 transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/10 to-transparent" />

                  <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black text-xs uppercase tracking-wider rounded-full shadow-lg">
                    {slides[activeSlide].badge}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {slides[activeSlide].title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                      {slides[activeSlide].sub}
                    </p>
                  </div>
                </div>

                {/* Indicators */}
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all ${activeSlide === idx
                            ? "w-6 bg-neutral-900 dark:bg-white"
                            : "w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                          }`}
                        title={`Xem slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <a
                    href="#ceo-letter-section"
                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium"
                  >
                    <img
                      src={BRAND_INFO.ceo.image}
                      alt={BRAND_INFO.ceo.name}
                      className="w-6 h-6 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                    />
                    <span>Thư ngỏ CEO Nguyễn Thị Thương</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Floating tag */}
              <div className="absolute -bottom-5 -left-4 sm:left-4 bg-white dark:bg-neutral-900 p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    May Đo Tận Nơi
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Đội ngũ thợ may 15 năm kinh nghiệm
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