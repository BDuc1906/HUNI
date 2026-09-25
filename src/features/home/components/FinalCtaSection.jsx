"use client";

import React from "react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  PhoneCall,
  ArrowRight,
  MessageCircle,
  Clock,
  ShieldCheck,
  Award,
  TrendingUp
} from "lucide-react";

export default function FinalCtaSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="final-cta-section"
      className="relative py-14 sm:py-20 bg-gradient-to-br from-[#071b34] via-[#0a2540] to-[#04121f] overflow-hidden border-t border-amber-400/20"
    >
      {/* Ambient gold glows */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 relative z-10">
        {/* Top badge */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sẵn Sàng Nâng Tầm Thương Hiệu?
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white">
            ĐỒNG HÀNH CÙNG HUNI
            <br />
            <span className="text-gold-gradient">NGAY HÔM NAY</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Nhận báo giá chi tiết & may mẫu thử <strong className="text-amber-300">MIỄN PHÍ 0Đ</strong>{" "}
            trong vòng <strong className="text-amber-300">5 phút</strong>. Chuyên viên HUNI sẽ
            tư vấn riêng cho doanh nghiệp bạn.
          </p>
        </div>

        {/* 3 CTA buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-8 sm:mb-12">
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="group px-5 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-sm rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Nhận Báo Giá Ngay</span>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
            className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-400/60 font-bold text-sm rounded-2xl backdrop-blur-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <PhoneCall className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>Gọi Hotline</span>
          </a>

          <a
            href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 sm:px-6 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/30"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Chat Zalo</span>
          </a>
        </div>

        {/* 4 Trust mini-badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Phản hồi 5 phút</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Chuyên viên gọi lại</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Mẫu thử 0đ</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Duyệt trước khi may</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
            <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Bảo hành 30 ngày</div>
            <div className="text-[10px] text-slate-400 mt-0.5">1 đổi 1 miễn phí</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">50.000+ KH</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Đã tin dùng</div>
          </div>
        </div>
      </div>
    </section>
  );
}