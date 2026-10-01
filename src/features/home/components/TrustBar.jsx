"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

// ============================================================
// DANH SÁCH 12 LOGO CHÍNH THỨC CỦA CÁC TẬP ĐOÀN & TỔ CHỨC
// Lưu trữ trực tiếp tại /images/partners/ chuẩn xác 100%
// ============================================================
const PARTNER_LOGOS = [
  {
    name: "Vietcombank",
    sub: "Ngân hàng Ngoại thương",
    logo: "/images/partners/vietcombank.svg",
    alt: "Logo Vietcombank",
    width: 140,
    height: 38,
  },
  {
    name: "MB Bank",
    sub: "Ngân hàng Quân Đội",
    logo: "/images/partners/mbbank.png",
    alt: "Logo MB Bank",
    width: 110,
    height: 36,
  },
  {
    name: "Techcombank",
    sub: "Ngân hàng Kỹ Thương",
    logo: "/images/partners/techcombank.png",
    alt: "Logo Techcombank",
    width: 135,
    height: 36,
  },
  {
    name: "Viettel",
    sub: "Tập đoàn Viễn thông Quân đội",
    logo: "/images/partners/viettel.svg",
    alt: "Logo Viettel",
    width: 110,
    height: 34,
  },
  {
    name: "FPT Telecom",
    sub: "Tập đoàn FPT",
    logo: "/images/partners/fpt.svg",
    alt: "Logo FPT Telecom",
    width: 105,
    height: 36,
  },
  {
    name: "VNPT",
    sub: "Tập đoàn Bưu chính Viễn thông",
    logo: "/images/partners/vnpt.svg",
    alt: "Logo VNPT",
    width: 110,
    height: 34,
  },
  {
    name: "VinFast / VinGroup",
    sub: "Tập đoàn Vingroup",
    logo: "/images/partners/vinfast.svg",
    alt: "Logo VinFast Vingroup",
    width: 115,
    height: 36,
  },
  {
    name: "Sun Group",
    sub: "Tập đoàn Mặt Trời",
    logo: "/images/partners/sungroup.png",
    alt: "Logo Sun Group",
    width: 120,
    height: 38,
  },
  {
    name: "BIDV",
    sub: "Ngân hàng Đầu tư & Phát triển",
    logo: "/images/partners/bidv.png",
    alt: "Logo BIDV",
    width: 120,
    height: 38,
  },
  {
    name: "Agribank",
    sub: "Ngân hàng Nông nghiệp",
    logo: "/images/partners/agribank.svg",
    alt: "Logo Agribank",
    width: 145,
    height: 38,
  },
  {
    name: "Vietnam Airlines",
    sub: "Hãng Hàng không Quốc gia",
    logo: "/images/partners/vietnamairlines.png",
    alt: "Logo Vietnam Airlines",
    width: 155,
    height: 38,
  },
  {
    name: "Petrovietnam",
    sub: "Tập đoàn Dầu khí Quốc gia",
    logo: "/images/partners/petrovietnam.svg",
    alt: "Logo Petrovietnam",
    width: 150,
    height: 38,
  },
];

export default function TrustBar() {
  return (
    <section className="py-6 sm:py-9 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =========================================================
            BO GÓC CONTAINER CHÍNH (THEO YÊU CẦU: CHO BO GÓC LẠI)
            ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-50 via-brand-50/40 to-slate-50 border border-brand-200/70 p-5 sm:p-7 shadow-xs relative overflow-hidden">
          
          {/* Header & Subtitle */}
          <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-200 text-brand-700 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              ĐỐI TÁC TIÊU BIỂU TOÀN QUỐC
            </div>

            <h3 className="text-sm sm:text-base md:text-lg font-black text-[#004f5e] uppercase tracking-wide">
              ĐỒNG HÀNH CÙNG HƠN 50.000+ DOANH NGHIỆP &amp; TỔ CHỨC
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Tin chọn sản xuất đồng phục cao cấp, may mẫu thử 0đ chuẩn nhận diện thương hiệu tại xưởng HDC 2.500m².
            </p>
          </div>

          {/* =========================================================
              LOGO THỰC TẾ CHẠY LIÊN TỤC (MARQUEE INFINITE TICKER)
              ========================================================= */}
          <div className="relative w-full overflow-hidden py-1">
            {/* Gradient mask trái */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />

            {/* Gradient mask phải */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

            {/* Dải marquee chạy vô tận */}
            <div className="animate-marquee-infinite flex items-center gap-3 sm:gap-4 select-none">
              {/* Vòng 1 */}
              {PARTNER_LOGOS.map((partner, idx) => (
                <div
                  key={`partner-1-${idx}`}
                  className="rounded-2xl bg-white border border-slate-200/90 hover:border-brand-400 p-2.5 sm:p-3 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[170px] sm:min-w-[200px] h-[68px] sm:h-[76px] px-4 group cursor-default shrink-0 overflow-hidden"
                  title={`${partner.name} - ${partner.sub}`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-h-7.5 sm:max-h-9 w-auto max-w-[130px] sm:max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}

              {/* Vòng 2 nhân đôi để loop liên tục vô tận */}
              {PARTNER_LOGOS.map((partner, idx) => (
                <div
                  key={`partner-2-${idx}`}
                  className="rounded-2xl bg-white border border-slate-200/90 hover:border-brand-400 p-2.5 sm:p-3 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[170px] sm:min-w-[200px] h-[68px] sm:h-[76px] px-4 group cursor-default shrink-0 overflow-hidden"
                  title={`${partner.name} - ${partner.sub}`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-h-7.5 sm:max-h-9 w-auto max-w-[130px] sm:max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cam kết chân thanh */}
          <div className="mt-4 pt-3 border-t border-brand-200/50 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Miễn phí thiết kế 2D/3D &amp; May áo mẫu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Hỗ trợ chuyên viên mang mẫu tận văn phòng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Chiết khấu sỉ trực tiếp tận xưởng HDC</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
