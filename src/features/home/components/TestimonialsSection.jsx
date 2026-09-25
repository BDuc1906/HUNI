"use client";

import React from "react";
import { TESTIMONIALS } from "@/shared/data";
import { Star, Quote, Building2, Award } from "lucide-react";

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
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Partner Logos Banner */}
        <div className="mb-16 text-center">
          <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-6">
            ĐỒNG HÀNH CÙNG HƠN 50.000+ TẬP ĐOÀN, NGÂN HÀNG & TỔ CHỨC TRÊN TOÀN QUỐC
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
            {partnerLogos.map((partner, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs font-extrabold text-xs sm:text-sm text-slate-700 tracking-wider hover:text-cyan-700 hover:border-cyan-400 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-cyan-600" />
            Đánh Giá Khách Hàng
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071b34]">
            KHÁCH HÀNG NÓI GÌ VỀ ĐỒNG PHỤC HUNI?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Sự hài lòng của quý đối tác chính là thước đo giá trị cao nhất cho chất lượng và dịch vụ của chúng tôi.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-cyan-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-cyan-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-cyan-200" />
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-[#071b34] text-sm">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.role}</p>
                  <span className="text-[10px] text-cyan-700 font-semibold">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}