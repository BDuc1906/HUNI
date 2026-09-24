"use client";

import React, { useState, useEffect } from "react";
import { BRAND_INFO } from "@/data/products";
import { useShop } from "@/hooks/useShop";
import {
  ArrowRight,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function HeroBanner() {
  const { setIsQuickQuoteOpen } = useShop();

  const slides = [
    {
      title: "Đồng Phục Doanh Nhân & Doanh Nghiệp",
      sub: "Vest may đo lãnh đạo & Sơ mi form chuẩn Ý",
      image: "/images/uniform_corporate_suits.jpg",
      badge: "May Đo Cao Cấp"
    },
    {
      title: "Áo Polo Doanh Nghiệp HUNI Classic",
      sub: "Vải cá sấu Cotton Compact 4 chiều kháng khuẩn",
      image: "/images/uniform_polo_corporate.jpg",
      badge: "Bán Chạy Nhất"
    },
    {
      title: "Đồng Phục Các Giải Thể Thao",
      sub: "Golf, Pickleball, Marathon, Teambuilding thoáng mát",
      image: "/images/uniform_sport_golf.jpg",
      badge: "AeroCool Dry-Fit"
    },
    {
      title: "Đồng Phục Học Sinh & Giáo Viên",
      sub: "Chuẩn form quốc tế, thanh lịch và bền bỉ",
      image: "/images/uniform_school_students.jpg",
      badge: "Trường Học Quốc Tế"
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-12 lg:py-16 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Brand Statement & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
              <span>HDC GROUP VN • THƯƠNG HIỆU HUNI UNIFORM</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-neutral-950 dark:text-white">
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
              <strong className="text-neutral-900 dark:text-white font-semibold">50.000+ doanh nghiệp, tổ chức và trường học</strong>.
              Sản xuất trực tiếp tại xưởng với quy mô 2.500m², cam kết chất lượng vượt trội, giá gốc tận xưởng và may mẫu duyệt form 0đ.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                <span>Thiết kế 3D miễn phí</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                <span>May mẫu thử 0 đồng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                <span>Hỗ trợ đo tận nơi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                <span>Chiết khấu sỉ trực tiếp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                <span>Bảo hành 1 đổi 1 30 ngày</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Nhận Báo Giá & May Mẫu 0đ</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#catalog-section"
                className="px-5 py-3.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Xem Sản Phẩm</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-4 py-3.5 text-neutral-900 dark:text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:underline"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{BRAND_INFO.contact.hotline}</span>
              </a>
            </div>

            {/* 4 Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {BRAND_INFO.stats.map((stat, idx) => (
                <div key={idx} className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="text-xl font-extrabold text-neutral-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{stat.label}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-lg">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <img
                  src={slides[activeSlide].image}
                  alt={slides[activeSlide].title}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-900/90 text-white dark:bg-white/90 dark:text-neutral-900 text-xs font-bold backdrop-blur-xs">
                  {slides[activeSlide].badge}
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{slides[activeSlide].title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{slides[activeSlide].sub}</p>
                </div>
              </div>

              {/* Slide indicators */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-xs">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === idx ? "w-6 bg-neutral-900 dark:bg-white" : "w-2 bg-neutral-300 dark:bg-neutral-700"
                      }`}
                      title={`Xem mẫu ${idx + 1}`}
                    />
                  ))}
                </div>

                <a
                  href="#ceo-letter-section"
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  <span>Thư ngỏ CEO Nguyễn Thị Thương</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
