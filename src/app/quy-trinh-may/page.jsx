import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, CheckCircle2, ShieldCheck, Clock, Scissors } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import ProcessSection from "@/features/home/components/ProcessSection";
import TrustBar from "@/features/home/components/TrustBar";
import CeoLetterSection from "@/features/home/components/CeoLetterSection";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Quy Trình May Đồng Phục Chuẩn 5 Bước | HDC FASHION",
  description:
    "Tìm hiểu quy trình đặt may đồng phục chuyên nghiệp tại HDC Fashion: Tiếp nhận tư vấn, thiết kế 3D miễn phí, may mẫu thử 0đ, sản xuất công nghiệp và bảo hành 1 đổi 1 trong 30 ngày.",
};

export default function QuyTrinhMayPage() {
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
            <span className="text-white font-semibold">Quy Trình</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Tiêu chuẩn sản xuất công nghiệp ISO
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              QUY TRÌNH MAY ĐỒNG PHỤC{" "}
              <span className="text-brand-300">CHUẨN HÓA 5 BƯỚC</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Mỗi sản phẩm tại HDC Fashion đều trải qua quy trình kiểm soát chất lượng khắt khe từ khâu chọn sợi dệt, cắt may rập 3D, in thêu vi tính Tajima đến kiểm tra KCS từng mũi chỉ trước khi đóng gói.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Clock className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xs sm:text-base lg:text-lg font-bold text-white leading-tight">Tư Vấn 15 Phút</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Báo giá & gợi ý vải chuẩn</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Scissors className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xs sm:text-base lg:text-lg font-bold text-white leading-tight">Thiết Kế 3D Free</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Phác thảo độc quyền</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <CheckCircle2 className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xs sm:text-base lg:text-lg font-bold text-white leading-tight">Mẫu Thử 0đ</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Duyệt form dáng tận tay</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <ShieldCheck className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-xs sm:text-base lg:text-lg font-bold text-white leading-tight">Bảo Hành 30 Ngày</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Đổi trả 1-1 miễn phí</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Quy trình">
        <ProcessSection />
      </ErrorBoundary>

      <ErrorBoundary name="Trust Bar">
        <TrustBar />
      </ErrorBoundary>

      <ErrorBoundary name="Thư mời hợp tác">
        <CeoLetterSection />
      </ErrorBoundary>

      <ErrorBoundary name="CTA cuối">
        <FinalCtaSection />
      </ErrorBoundary>
    </>
  );
}
