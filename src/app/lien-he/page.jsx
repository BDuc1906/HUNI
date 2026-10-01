import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Phone, Mail, MapPin, Clock } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { BRAND_INFO } from "@/shared/data";

import MapSection from "@/features/home/components/MapSection";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import FaqSection from "@/features/home/components/FaqSection";

export const metadata = {
  title: "Liên Hệ & Hệ Thống Showroom, Xưởng May | HDC FASHION",
  description:
    "Thông tin liên hệ thương hiệu HDC Fashion - HDC GROUP VN. Trụ sở Phú Thọ, văn phòng Hà Nội, xưởng sản xuất 2.500m2. Hotline 24/7: 0984.959.586.",
};

export default function LienHePage() {
  return (
    <>
      {/* Page Header / Hero Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-semibold">Liên Hệ</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Tư vấn &amp; Chăm sóc khách hàng 24/7
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              KẾT NỐI VỚI <br />
              <span className="text-brand-300">ĐỘI NGŨ CHUYÊN GIA HDC</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Bạn cần tư vấn chất liệu, nhận báo giá sỉ cho doanh nghiệp hoặc đặt lịch may áo mẫu thử miễn phí? Chúng tôi luôn sẵn sàng hỗ trợ bạn nhanh chóng nhất.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <a
                href="#map-section"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-brand-300/40 transition-all group"
              >
                <MapPin className="w-5 h-5 text-brand-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-brand-200 font-bold uppercase tracking-wider">VP Công ty (Hà Nội)</div>
                <div className="text-sm sm:text-base font-extrabold text-white">Số 6, Kim Đồng, Hoàng Mai, Hà Nội</div>
              </a>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 transition-all group"
              >
                <Phone className="w-5 h-5 text-brand-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-slate-300">Hotline / Zalo 24/7</div>
                <div className="text-base sm:text-lg font-bold text-white">{BRAND_INFO.contact.hotline}</div>
              </a>

              <a
                href={`mailto:${BRAND_INFO.contact.email}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 transition-all group"
              >
                <Mail className="w-5 h-5 text-brand-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-slate-300">Email doanh nghiệp</div>
                <div className="text-base font-bold text-white truncate">{BRAND_INFO.contact.email}</div>
              </a>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <Clock className="w-5 h-5 text-brand-300 mb-2" />
                <div className="text-xs text-slate-300">Thời gian làm việc</div>
                <div className="text-base font-bold text-white">08:00 - 18:00 (T2 - T7)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Bản đồ">
        <MapSection />
      </ErrorBoundary>

      <ErrorBoundary name="Báo giá nhanh">
        <QuickQuoteSection />
      </ErrorBoundary>

      <ErrorBoundary name="FAQ">
        <FaqSection />
      </ErrorBoundary>
    </>
  );
}
