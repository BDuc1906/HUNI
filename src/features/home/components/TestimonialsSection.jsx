"use client";

import React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/shared/data";
import { Star, Quote, Award } from "lucide-react";

export default function TestimonialsSection() {
  const partnerLogos = [
    "VIETCOMBANK",
    "TECHCOMBANK",
    "MB BANK",
    "VINCITY",
    "SUN GROUP",
    "FPT TELECOM",
    "HỌC VIỆN TƯ PHÁP",
    "TRƯỜNG ĐH QUỐC GIA"
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =============================================
            Partner Logos Banner
            ============================================= */}
        <div className="mb-12 sm:mb-16 text-center">
          <p className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-4 sm:mb-6 px-2">
            ĐỒNG HÀNH CÙNG HƠN 50.000+ TẬP ĐOÀN, NGÂN HÀNG & TỔ CHỨC TRÊN TOÀN QUỐC
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 lg:gap-6 opacity-80">
            {partnerLogos.map((partner, idx) => (
              <div
                key={idx}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs font-extrabold text-[10px] sm:text-xs lg:text-sm text-slate-700 tracking-wider hover:text-amber-700 hover:border-amber-400 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* =============================================
            Header
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
            Đánh Giá Khách Hàng
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#071b34]">
            KHÁCH HÀNG NÓI GÌ VỀ HUNI?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            Sự hài lòng của quý đối tác chính là thước đo giá trị cao nhất cho chất lượng và dịch vụ của chúng tôi.
          </p>
        </div>

        {/* =============================================
            Testimonial Cards
            ============================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3 sm:space-y-4">
                {/* Stars + Quote */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 sm:w-7 sm:h-7 text-amber-200" />
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[#071b34] text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.role}
                  </p>
                  <span className="text-[10px] sm:text-[10px] text-amber-700 font-semibold">
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}