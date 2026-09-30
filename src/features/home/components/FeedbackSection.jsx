"use client";

import React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/shared/data/testimonials";
import { Star, Quote, Award, Building2 } from "lucide-react";

// ============================================================
// FEEDBACK KHÁCH HÀNG — Hiển thị khi có data thật
// Nếu TESTIMONIALS rỗng → return null (ẩn section)
// Khi thêm data vào testimonials.js → section tự hiện
// ============================================================

export default function FeedbackSection() {
  // Nếu chưa có feedback → ẩn section
  if (!TESTIMONIALS || TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section
      id="feedback-section"
      className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Khách Hàng Nói Về HDC
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            FEEDBACK TỪ ĐỐI TÁC
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Những đánh giá thật từ khách hàng doanh nghiệp, tổ chức đã đồng hành
            cùng HDC FASHION.
          </p>
        </div>

        {/* ============================================
            GRID FEEDBACK — 2-3 cột
            ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top: Rating + Quote */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-200" />
                </div>

                {/* Count badge */}
                {item.count && (
                  <div className="inline-block mb-3 px-2.5 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full border border-brand-200">
                    {item.count}
                  </div>
                )}

                {/* Content */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-4">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Bottom: Author */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                {/* Avatar */}
                {item.avatar ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-400 shadow-sm shrink-0 bg-slate-100">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-brand-400">
                    {(item.name || "K").charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name + Role */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-[#004f5e] text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.role}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-brand-700 font-semibold">
                    <Building2 className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{item.company || item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}