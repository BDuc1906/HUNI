"use client";

import React, { useState, useEffect } from "react";
import { BRAND_INFO } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import {
  Sparkles,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Award,
  Users,
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
    <section className="relative bg-gradient-to-b from-[#071b34] via-[#092448] to-[#0a192f] text-white pt-8 pb-16 overflow-hidden border-b border-amber-500/20">
      {/* Decorative Golden Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Statement & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>HDC GROUP VN • THƯƠNG HIỆU HUNI UNIFORM</span>
            </div>

            {/* Main Title matching Image 1 & Image 3 */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                NÂNG TẦM <span className="text-gold-gradient">THƯƠNG HIỆU</span>
                <br />
                CÙNG HUNI UNIFORM
              </h1>
              <p className="text-amber-200/90 font-medium text-base sm:text-lg italic">
                &ldquo;{BRAND_INFO.slogan}&rdquo;
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Chuyên tư vấn, thiết kế độc quyền và may đo đồng phục cao cấp cho hơn{" "}
              <strong className="text-white font-semibold">50.000+ doanh nghiệp, tổ chức và trường học</strong>.
              Sản xuất trực tiếp tại xưởng với quy mô 2.500m², cam kết chất lượng vượt trội, giá gốc tận xưởng và may mẫu duyệt form 0đ.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs sm:text-sm font-medium text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Thiết kế 3D miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>May mẫu thử 0 đồng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Hỗ trợ đo tận nơi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Chiết khấu sỉ cực cao</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bảo hành 1 đổi 1 30 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-1"
              >
                <span>Nhận Báo Giá & May Mẫu 0đ</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#catalog-section"
                className="px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base rounded-2xl border border-slate-700 hover:border-amber-400/50 flex items-center justify-center gap-2 transition-all"
              >
                <span>Xem Bộ Sưu Tập</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="px-4 py-4 text-amber-400 hover:text-amber-300 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-4 h-4 animate-bounce text-amber-400" />
                <span>{BRAND_INFO.contact.hotline}</span>
              </a>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
              {BRAND_INFO.stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-xl sm:text-2xl font-black text-amber-400">{stat.value}</div>
                  <div className="text-xs font-semibold text-white">{stat.label}</div>
                  <div className="text-[11px] text-slate-400 truncate">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Golden Frame Accent */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl blur-md opacity-30 animate-pulse" />

              <div className="relative bg-[#0d274c] rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl">
                {/* Image Slide */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <img
                    src={slides[activeSlide].image}
                    alt={slides[activeSlide].title}
                    className="w-full h-full object-cover object-center transition-all duration-700 transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b34] via-[#071b34]/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-[#071b34] font-black text-xs uppercase tracking-wider rounded-full shadow-lg">
                    {slides[activeSlide].badge}
                  </div>

                  {/* Slide details */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#071b34]/90 backdrop-blur-md rounded-2xl border border-amber-400/30">
                    <h3 className="text-lg font-bold text-white">{slides[activeSlide].title}</h3>
                    <p className="text-xs text-amber-300 font-medium">{slides[activeSlide].sub}</p>
                  </div>
                </div>

                {/* Slider indicators */}
                <div className="p-3 bg-[#081f3d] flex items-center justify-between border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all ${
                          activeSlide === idx ? "w-6 bg-amber-400" : "w-2 bg-slate-600 hover:bg-slate-400"
                        }`}
                        title={`Xem slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <a
                    href="#ceo-letter-section"
                    className="flex items-center gap-2 text-slate-300 hover:text-amber-300 text-xs font-medium"
                  >
                    <img
                      src={BRAND_INFO.ceo.image}
                      alt={BRAND_INFO.ceo.name}
                      className="w-6 h-6 rounded-full object-cover border border-amber-400"
                    />
                    <span>Thư ngỏ CEO Nguyễn Thị Thương</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                </div>
              </div>

              {/* Floating Mini Guarantee Tag */}
              <div className="absolute -bottom-5 -left-4 sm:left-4 bg-gradient-to-br from-[#071b34] to-[#0e2c56] p-3.5 rounded-2xl border border-amber-400/40 shadow-2xl flex items-center gap-3 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">May Đo Tận Nơi</div>
                  <div className="text-[11px] text-amber-300">Đội ngũ thợ may 15 năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
