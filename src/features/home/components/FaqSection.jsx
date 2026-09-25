"use client";

import React, { useState } from "react";
import { FAQS, BRAND_INFO } from "@/shared/data";
import { ChevronDown, HelpCircle, PhoneCall } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Giải Đáp Thắc Mắc
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#071b34]">
            CÂU HỎI THƯỜNG GẶP (FAQ)
          </h2>
          <p className="text-slate-600 text-sm">
            Tất cả những điều bạn cần biết khi đặt may đồng phục cho doanh nghiệp, tổ chức và trường học.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="font-bold text-[#071b34] text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "rotate-180 bg-amber-500 text-white border-amber-500" : "text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 text-[#071b34] rounded-3xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-[#071b34]">
              Bạn vẫn còn câu hỏi thắc mắc riêng về đơn hàng?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Đội ngũ chuyên viên tư vấn của HUNI luôn sẵn sàng giải đáp 24/7.
            </p>
          </div>

          <a
            href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi Ngay: {BRAND_INFO.contact.hotline}</span>
          </a>
        </div>
      </div>
    </section>
  );
}