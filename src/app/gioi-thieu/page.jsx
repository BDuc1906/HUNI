import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Award, Users, Factory } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import CulturalHeritageSection from "@/features/home/components/CulturalHeritageSection";
import TestimonialsSection from "@/features/home/components/TestimonialsSection";
import TrustBar from "@/features/home/components/TrustBar";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Giới Thiệu HDC FASHION - Phong Cách Tạo Thành Công",
  description:
    "HDC GROUP VN - Thương hiệu HDC Fashion do CEO Nguyễn Thị Thương sáng lập. Hành trình kiến tạo phong cách đồng phục chuyên nghiệp cho hơn 50.000 doanh nghiệp trên toàn quốc.",
};

export default function GioiThieuPage() {
  return (
    <>
      {/* Page Header / Hero Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-semibold">Giới Thiệu</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Về HDC Fashion — HDC GROUP VN
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              NÂNG TẦM DIỆN MẠO{" "}
              <span className="text-brand-300">DOANH NGHIỆP VIỆT NAM</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Khởi nguồn từ vùng Đất Tổ Hùng Vương, HDC Fashion tự hào là đơn vị tiên phong trong lĩnh vực tư vấn, thiết kế độc quyền và may đo đồng phục cao cấp cho hơn 50.000+ tập đoàn, doanh nghiệp, trường học và các giải thể thao trên toàn quốc.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Factory className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xl sm:text-2xl font-black text-white">2.500m²</div>
                <div className="text-[11px] text-slate-300">Xưởng sản xuất trực tiếp</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Users className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xl sm:text-2xl font-black text-white">50.000+</div>
                <div className="text-[11px] text-slate-300">Khách hàng tin tưởng</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Award className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] text-slate-300">May mẫu thử 0đ</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Sparkles className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xl sm:text-2xl font-black text-white">30 Ngày</div>
                <div className="text-[11px] text-slate-300">Bảo hành 1 đổi 1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Thư mời hợp tác">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      <ErrorBoundary name="Họa tiết văn hóa">
        <CulturalHeritageSection />
      </ErrorBoundary>

      <ErrorBoundary name="Đánh giá khách hàng">
        <TestimonialsSection />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
