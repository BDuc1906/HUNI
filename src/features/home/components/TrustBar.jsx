"use client";

import React from "react";
import Image from "next/image";
import { Camera, ShieldCheck, Award, CheckCircle2 } from "lucide-react";

// ==================================================
// ĐỐI TÁC & KHÁCH HÀNG — Grid logo, không album ảnh
// Logo lưu tại: public/images/partners/
// ==================================================

const PARTNERS = [
  { name: "Vietcombank", logo: "/images/partners/vietcombank.png" },
  { name: "Techcombank", logo: "/images/partners/techcombank.png" },
  { name: "Kienlong Bank", logo: "/images/partners/kienlong-bank.png" },
  { name: "MB Bank", logo: "/images/partners/mb-bank.png" },
  { name: "Herbalife", logo: "/images/partners/herbalife.png" },
  { name: "Circle K", logo: "/images/partners/circle-k.png" },
  { name: "TKG Taekwang", logo: "/images/partners/tkg-taekwang.png" },
  { name: "Pharmacity", logo: "/images/partners/pharmacity.png" },
  { name: "Nhà thuốc Long Châu", logo: "/images/partners/long-chau.png" },
  { name: "Honda", logo: "/images/partners/honda.png" },
  { name: "Mitsubishi Motors", logo: "/images/partners/mitsubishi.png" },
  { name: "Đang cập nhật", logo: "/images/partners/placeholder.png" },
];

export default function TrustBar() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER — Style giống GallerySection
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Đối Tác &amp; Khách Hàng
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            ĐỐI TÁC &amp; KHÁCH HÀNG NỔI BẬT
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Đồng hành cùng nhiều thương hiệu, doanh nghiệp và tổ chức trên toàn
            quốc.
          </p>
        </div>

        {/* ============================================
            LOGO GRID — 3 cột mobile, 6 cột desktop
            ============================================ */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="group aspect-[2/1] flex items-center justify-center bg-white rounded-xl border border-slate-200/80 hover:border-brand-400 hover:shadow-md transition-all duration-300 p-3 sm:p-4"
              title={partner.name}
            >
              <div className="relative w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ============================================
            Trust badges
            ============================================ */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Xuất VAT 100%
          </span>
          <span className="inline-flex items-center gap-1.5 text-brand-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> May mẫu thử 0đ
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700">
            <Award className="w-3.5 h-3.5" /> Bảo hành 30 ngày
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5" /> Đối tác tin cậy
          </span>
        </div>
      </div>
    </section>
  );
}