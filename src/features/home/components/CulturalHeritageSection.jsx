"use client";

import React from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  ArrowRight
} from "lucide-react";

// ==================================================
// 4 DI TÍCH VĂN HÓA — chỉ hiển thị ảnh pattern
// ==================================================
const CULTURAL_HERITAGES = [
  {
    id: "hang-xom-trai",
    name: "HÀNG XÓM TRẠI",
    desc: "Di tích khảo cổ văn hóa Hòa Bình",
    pattern: "/images/pattern_triangle.png",
  },
  {
    id: "nui-dau-rong",
    name: "NÚI ĐẦU RỒNG",
    desc: "Danh thắng thiên nhiên hùng vĩ",
    pattern: "/images/pattern_bird.png",
  },
  {
    id: "trong-dong",
    name: "TRỐNG ĐỒNG CỔ",
    desc: "Di sản văn hóa Đông Sơn",
    pattern: "/images/pattern_drum.png",
  },
  {
    id: "suoi-kim-boi",
    name: "SUỐI NƯỚC NÓNG KIM BÔI",
    desc: "Danh thắng suối khoáng tự nhiên",
    pattern: "/images/pattern_wave.png",
  },
];

export default function CulturalHeritageSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="cultural-heritage-section"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-brand-50/30 to-white border-t border-slate-200 relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Tinh Hoa Văn Hóa Việt
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            HÓA TIẾT VĂN HÓA
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-gradient">
            Tôn Vinh Bản Sắc Dân Tộc
          </p>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto rounded-full mt-2" />
        </div>

        {/* 4 Pattern cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {CULTURAL_HERITAGES.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-brand-400 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Label tên — căn giữa trên cùng */}
              <div className="bg-brand-700 px-4 py-2.5 text-center">
                <span className="text-[11px] sm:text-xs font-extrabold text-white uppercase tracking-wider">
                  {item.name}
                </span>
              </div>

              {/* Ảnh pattern — toàn bộ card */}
              <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.pattern}
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Mô tả */}
              <div className="p-3 sm:p-4 border-t border-slate-100">
                <p className="text-[11px] sm:text-xs text-slate-600 leading-snug text-center">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Đoạn mô tả văn hóa */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12 p-5 sm:p-7 bg-gradient-to-br from-[#004f5e] via-[#00677a] to-[#003843] rounded-2xl sm:rounded-3xl border border-brand-500/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
              <strong className="text-brand-300">HDC FASHION</strong> là thương hiệu thời trang độc đáo với tiếp cận sáng tạo đặc biệt,
              khai thác sâu vào yếu tố văn hóa, đưa các giá trị văn hóa vào thiết kế thời trang.
              Với mục tiêu <strong className="text-brand-300">tôn vinh giá trị văn hóa</strong>,
              nét đẹp độc đáo của Việt Nam, thể hiện <strong className="text-brand-300">tinh thần dân tộc</strong>.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/20 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Tư Vấn Thiết Kế Họa Tiết Riêng</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            Hotline tư vấn:{" "}
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="font-bold text-brand-700 hover:underline"
            >
              {BRAND_INFO.contact.hotline}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
