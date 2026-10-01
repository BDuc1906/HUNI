import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Factory,
  CheckCircle2,
  FileDown,
  PhoneCall,
  ShieldCheck,
  Building2
} from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { BRAND_INFO } from "@/shared/data";

import BrandStorySection from "@/features/about/components/BrandStorySection";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import FactoryCapacitySection from "@/features/about/components/FactoryCapacitySection";
import EnterpriseClientsSection from "@/features/about/components/EnterpriseClientsSection";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import CulturalHeritageSection from "@/features/home/components/CulturalHeritageSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Giới Thiệu HDC FASHION - Năng Lực Sản Xuất & Câu Chuyện Thương Hiệu",
  description:
    "HDC GROUP VN - Thương hiệu HDC Fashion do CEO Nguyễn Thị Thương sáng lập. Hành trình kiến tạo phong cách đồng phục chuyên nghiệp cho hơn 50.000 doanh nghiệp trên toàn quốc. Xưởng may 2.500m² tại KCN Thụy Vân, Phú Thọ.",
};

export default function GioiThieuPage() {
  return (
    <>
      {/* ============================================================
          PAGE HERO / EXECUTIVE SUMMARY CHO KHÁCH HÀNG B2B
          ============================================================ */}
      <section className="bg-gradient-to-br from-[#00222a] via-[#003843] to-[#004f5e] text-white py-14 sm:py-20 border-b border-brand-400/20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Hồ Sơ Năng Lực Doanh Nghiệp — HDC GROUP VN
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                NÂNG TẦM DIỆN MẠO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-white">
                  DOANH NGHIỆP VIỆT NAM
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                Khởi nguồn từ vùng Đất Tổ Hùng Vương, <strong>HDC FASHION</strong> là đơn vị tiên phong cung cấp giải pháp đồng phục doanh nghiệp may đo công nghiệp cao cấp. Với hệ thống xưởng may khép kín 2.500m², máy thêu vi tính Tajima Nhật Bản và công nghệ may Seamless độc quyền, chúng tôi tự hào đồng hành cùng <strong>hơn 50.000 tập đoàn, ngân hàng và tổ chức hàng đầu</strong> trên khắp 63 tỉnh thành.
              </p>

              {/* Action Buttons for B2B Procurement */}
              <div className="flex flex-wrap items-center gap-3 pt-2 mb-8">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  Hotline Dự Thầu: {BRAND_INFO.contact.hotline}
                </a>
                <a
                  href="/2023-12-28_Catalogue%20%C4%91%E1%BB%93ng%20ph%E1%BB%A5c_1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  <FileDown className="w-4 h-4 text-brand-300" />
                  Tải Catalogue B2B 2026 (.PDF)
                </a>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/15 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0 border border-brand-400/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Pháp nhân chủ quản</div>
                    <div className="text-sm font-bold text-white">HDC GROUP VN</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-lg sm:text-xl font-black text-brand-300">2.500m²</div>
                    <div className="text-[11px] text-slate-300">Xưởng KCN Thụy Vân</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-lg sm:text-xl font-black text-brand-300">50.000+</div>
                    <div className="text-[11px] text-slate-300">Khách hàng tin chọn</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-lg sm:text-xl font-black text-brand-300">50K sp</div>
                    <div className="text-[11px] text-slate-300">Công suất / Tháng</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <div className="text-lg sm:text-xl font-black text-emerald-400">100%</div>
                    <div className="text-[11px] text-slate-300">Hóa đơn VAT hợp lệ</div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-300 shrink-0" />
                  Bảo hành 1 đổi 1 trong 30 ngày &amp; May mẫu thử 0đ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PHẦN 1: CÂU CHUYỆN THƯƠNG HIỆU & HỆ GIÁ TRỊ CỐT LÕI
          ============================================================ */}
      <ErrorBoundary name="Câu chuyện thương hiệu">
        <BrandStorySection />
      </ErrorBoundary>

      {/* ============================================================
          THƯ MỜI HỢP TÁC TỪ CEO NGUYỄN THỊ THƯƠNG
          ============================================================ */}
      <ErrorBoundary name="Thư mời hợp tác">
        <CeoLetterSection />
      </ErrorBoundary>

      {/* ============================================================
          PHẦN 2: NĂNG LỰC SẢN XUẤT & CƠ SỞ VẬT CHẤT (2.500M²)
          ============================================================ */}
      <ErrorBoundary name="Năng lực sản xuất">
        <FactoryCapacitySection />
      </ErrorBoundary>

      {/* ============================================================
          PHẦN 3: KHÁCH HÀNG & ĐỐI TÁC TIÊU BIỂU (B2B SOCIAL PROOF)
          ============================================================ */}
      <ErrorBoundary name="Khách hàng tiêu biểu">
        <EnterpriseClientsSection />
      </ErrorBoundary>

      {/* ============================================================
          CAM KẾT DOANH NGHIỆP & VÌ SAO CHỌN HDC
          ============================================================ */}
      <ErrorBoundary name="Vì sao chọn HDC">
        <WhyChooseUs />
      </ErrorBoundary>

      {/* ============================================================
          HỌA TIẾT DI SẢN VĂN HÓA ĐẤT TỔ
          ============================================================ */}
      <ErrorBoundary name="Họa tiết văn hóa">
        <CulturalHeritageSection />
      </ErrorBoundary>

      {/* ============================================================
          CTA CUỐI TRANG
          ============================================================ */}
      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
