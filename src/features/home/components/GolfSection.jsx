"use client";

import React from "react";
import Image from "next/image";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Award,
  Sun,
  Wind,
  Droplets,
  Activity
} from "lucide-react";

// ==================================================
// 4 ĐẶC TÍNH VẢI GOLF
// ==================================================
const GOLF_FEATURES = [
  {
    icon: Sun,
    title: "Chống Tia UV UPF 50+",
    desc: "Bảo vệ làn da khi chơi golf ngoài trời nắng 18 hố liên tục."
  },
  {
    icon: Wind,
    title: "Công Nghệ AeroCool",
    desc: "Hạ nhiệt cơ thể 3°C, thoáng mát tức thì trong suốt ván golf."
  },
  {
    icon: Droplets,
    title: "Khô Nhanh 15 Phút",
    desc: "Thấm hút và bay hơi mồ hôi nhanh, không đọng bệt khó chịu."
  },
  {
    icon: Activity,
    title: "Co Giãn 4 Chiều",
    desc: "Độ đàn hồi siêu linh hoạt cho cú swing chuẩn xác không vướng víu."
  }
];

// ==================================================
// ẢNH SỰ KIỆN GOLF
// ==================================================
const GOLF_GALLERY = [
  { img: "/images/08_golf_event_01.jpg", label: "Giải Golf Doanh Nhân" },
  { img: "/images/08_golf_event_02.jpg", label: "Kỷ Niệm 30 Năm DNT" },
  { img: "/images/08_golf_event_03.jpg", label: "Tập Thể Golfers" },
];

export default function GolfSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="golf-section"
      className="py-16 sm:py-20 bg-gradient-to-b from-[#004f5e] via-[#00677a] to-[#003843] border-t border-brand-500/20 relative overflow-hidden text-white"
    >
      {/* Ambient brand glows */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* =============================================
            Header
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-400/15 border border-brand-400/30 text-brand-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-400" />
            Đồng Phục Golf Cao Cấp
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            ĐỒNG PHỤC GOLF HDC
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-gradient">
            Truyền Cảm Hứng Cho Mỗi Cú Swing
          </p>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full mt-2" />

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-3">
            Đồng phục Golf truyền cảm hứng thiết kế cho các thủ lĩnh tại giải Golf kỷ niệm
            30 năm phong trào Doanh nhân Trẻ Việt Nam.
          </p>
        </div>

        {/* =============================================
            Banner sự kiện
            ============================================= */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-14 p-5 sm:p-7 bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-brand-400/30">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-brand-300 mb-2">
                Giải Golf Kỷ Niệm 30 Năm Phong Trào DNT Việt Nam 🏆
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Giải Golf kỷ niệm 30 năm phong trào Doanh nhân Trẻ Việt Nam đã được tổ chức thành công
                tại sân Golf Long Biên. Với đồng đảo các Shark tham dự và sự góp mặt của các gương mặt
                quen thuộc — <strong className="text-brand-200">anh Đặng Hồng Anh</strong> (Chủ tịch Hội DNT Việt Nam),{" "}
                <strong className="text-brand-200">anh Đỗ Duy Liên</strong> (Phó Chủ tịch Hội DNT Việt Nam,{" "}
                Chủ tịch Hội DNT Hòa Bình)... Cùng hàng trăm các Shark trong Hội DNT Việt Nam.
              </p>
            </div>
          </div>
        </div>

        {/* =============================================
            4 Đặc tính vải Golf
            ============================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {GOLF_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-400/60 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm leading-tight mb-1.5 group-hover:text-brand-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* =============================================
            Gallery 3 ảnh sự kiện
            ============================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
          {GOLF_GALLERY.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-brand-400/20 hover:border-brand-400/60 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-800">
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004f5e]/80 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white text-xs sm:text-sm font-bold">
                    {item.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =============================================
            CTA
            ============================================= */}
        <div className="text-center">
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Đặt Đồng Phục Golf Doanh Nghiệp</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Hotline tư vấn:{" "}
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="font-bold text-brand-300 hover:underline"
            >
              {BRAND_INFO.contact.hotline}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
