import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Layers, ShieldCheck, Flame, Droplets } from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import FabricGuideSection from "@/features/home/components/FabricGuideSection";
import SeamlessTechSection from "@/features/home/components/SeamlessTechSection";
import TrustBar from "@/features/home/components/TrustBar";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";

export const metadata = {
  title: "Bảng So Sánh Chất Liệu Vải May Đồng Phục Cao Cấp | HDC FASHION",
  description:
    "Khám phá các chất liệu vải may đồng phục cao cấp tại HDC Fashion: Cotton Compact, CVC 65/35, Dry-fit thể thao, Bamboo kháng khuẩn, công nghệ ép seam không đường may.",
};

export default function BangVaiPage() {
  return (
    <>
      {/* Page Header / Hero Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Tiêu chuẩn nguyên vật liệu 2026
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              BẢNG SO SÁNH <br />
              <span className="text-brand-300">CHẤT LIỆU VẢI MAY ĐỒNG PHỤC</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              HDC Fashion cam kết 100% dòng vải sử dụng đều được kiểm định an toàn dệt may, xử lý kháng khuẩn, chống xù lông và giữ phom dáng bền đẹp suốt nhiều năm sử dụng.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Droplets className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-base sm:text-lg font-bold text-white">Thấm Hút Cực Nhanh</div>
                <div className="text-[11px] text-slate-300">Dry-fit & Cotton Compact</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Layers className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-base sm:text-lg font-bold text-white">Co Giãn 4 Chiều</div>
                <div className="text-[11px] text-slate-300">Vận động thoải mái 24/7</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <ShieldCheck className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-base sm:text-lg font-bold text-white">Kháng Khuẩn Ion Bạc</div>
                <div className="text-[11px] text-slate-300">Khử mùi, ngừa ẩm mốc</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Flame className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-base sm:text-lg font-bold text-white">Bền Màu 100+ Lần</div>
                <div className="text-[11px] text-slate-300">Công nghệ nhuộm reactive</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary name="Bảng vải">
        <FabricGuideSection />
      </ErrorBoundary>

      <ErrorBoundary name="Công nghệ Seamless">
        <SeamlessTechSection />
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
