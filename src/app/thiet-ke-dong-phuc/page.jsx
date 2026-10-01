import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Shirt,
  Award,
  HelpCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import CustomDesignStudio from "@/features/customize/components/CustomDesignStudio";
import TrustBar from "@/features/home/components/TrustBar";
import FinalCtaSection from "@/features/home/components/FinalCtaSection";
import { BRAND_INFO } from "@/shared/data";

export const metadata = {
  title: "Thiết Kế Đồng Phục Theo Yêu Cầu | Studio Phối Màu 2D & Gửi Mẫu Bản Vẽ | HDC FASHION",
  description:
    "Tự phối màu áo đồng phục trực quan 2D, chọn vị trí thêu logo Tajima Nhật Bản, dự toán giá sỉ tự động hoặc gửi file thiết kế có sẵn nhận áo mẫu 0đ từ HDC Fashion.",
  keywords: [
    "thiết kế đồng phục",
    "tự thiết kế áo polo",
    "gửi mẫu đồng phục",
    "phối màu đồng phục công ty",
    "may mẫu áo đồng phục 0đ",
    "xưởng may áo thun đồng phục HDC",
  ],
  openGraph: {
    title: "Studio Thiết Kế Đồng Phục Trực Quan & Báo Giá Tức Thì | HDC FASHION",
    description:
      "Tự thiết kế áo polo, sơ mi, áo thun doanh nghiệp 2D trực quan. Nhận bản vẽ 3D và may mẫu thử thực tế 0đ.",
    type: "website",
    url: "https://hdcfashion.vn/thiet-ke-dong-phuc",
  },
};

export default function ThietKeDongPhucPage() {
  return (
    <>
      {/* ====================================================
          PAGE HERO / BANNER
          ==================================================== */}
      <section className="bg-gradient-to-br from-[#002f38] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Công nghệ Studio 2D & May Mẫu Thực Tế 0đ
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              THIẾT KẾ ĐỒNG PHỤC <br />
              <span className="text-brand-300">THEO NHẬN DIỆN THƯƠNG HIỆU</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              Tự phối màu thân áo, thử vị trí logo thương hiệu trực quan trên mô hình 2D chuẩn xưởng. Hoặc tải trực tiếp file đồ họa có sẵn (AI, PSD, PDF) để nhận demo 3D và báo giá chiết khấu tới 28% trong 15 phút.
            </p>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Palette className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-sm sm:text-base font-bold text-white">
                  Phối Màu 2D Chuẩn
                </div>
                <div className="text-[11px] text-slate-300">Theo Pantone công ty</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Shirt className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-sm sm:text-base font-bold text-white">
                  May Mẫu Thử 0đ
                </div>
                <div className="text-[11px] text-slate-300">Đơn hàng từ 50 áo</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Award className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-sm sm:text-base font-bold text-white">
                  Thêu Tajima 3D
                </div>
                <div className="text-[11px] text-slate-300">Bền vĩnh viễn</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <Clock className="w-5 h-5 text-brand-300 mb-1" />
                <div className="text-sm sm:text-base font-bold text-white">
                  Báo Giá 15 Phút
                </div>
                <div className="text-[11px] text-slate-300">Chiết khấu tận xưởng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          STUDIO TƯƠNG TÁC THIẾT KẾ CHÍNH
          ==================================================== */}
      <section className="py-10 sm:py-14 bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ErrorBoundary name="CustomDesignStudio">
            <CustomDesignStudio />
          </ErrorBoundary>
        </div>
      </section>

      {/* ====================================================
          QUY TRÌNH 5 BƯỚC SẢN XUẤT TỪ BẢN VẼ ĐẾN ÁO MẪU
          ==================================================== */}
      <section className="py-14 sm:py-20 bg-slate-900 border-t border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cam kết chất lượng chuẩn xưởng ISO
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Quy Trình Hiện Thực Hóa Thiết Kế Của Bạn
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              HDC Fashion đồng hành từ bản phác thảo ý tưởng đến khi toàn bộ nhân sự công ty bạn mặc lên chiếc áo đồng phục tự hào nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                title: "Phối Màu & Gửi File",
                desc: "Bạn tự phối màu trên studio hoặc tải file thiết kế, chuyên viên HDC tiếp nhận ngay trong 15 phút.",
              },
              {
                step: "02",
                title: "Dựng Phối Cảnh 3D",
                desc: "Designer HDC lên maket 3D chi tiết với kích thước logo chuẩn mm và gửi bảng màu vải mẫu.",
              },
              {
                step: "03",
                title: "May Áo Mẫu Thử 0đ",
                desc: "Xưởng may 01 áo mẫu hoàn thiện để khách hàng tận tay cảm nhận chất vải, đường may và hình thêu.",
              },
              {
                step: "04",
                title: "Sản Xuất Hàng Loạt",
                desc: "Hệ thống máy cắt tự động Gerber và chuyền may khép kín 2.500m² đảm bảo đúng 100% áo mẫu.",
              },
              {
                step: "05",
                title: "KCS & Giao Tận Nơi",
                desc: "Kiểm tra chất lượng từng chiếc, đóng gói cao cấp và miễn phí giao hàng toàn quốc kèm bảo hành 30 ngày.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 relative hover:border-brand-400/60 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-black text-brand-400/30 font-mono mb-2">
                  {item.step}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          FAQ — CÂU HỎI THƯỜNG GẶP
          ==================================================== */}
      <section className="py-14 sm:py-20 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Câu Hỏi Thường Gặp Về Tự Thiết Kế Đồng Phục
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Mọi thắc mắc của bạn đều có giải pháp tối ưu tại HDC Fashion
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Doanh nghiệp tôi chưa có file vector logo thì HDC có hỗ trợ không?",
                a: "Có! Bạn chỉ cần gửi ảnh chụp logo hoặc hình ảnh có sẵn (kể cả ảnh chụp card visit hay ảnh mờ). Đội ngũ thiết kế của HDC sẽ vẽ lại (redesign) hoàn toàn miễn phí sang định dạng vector chuẩn in/thêu.",
              },
              {
                q: "Thời gian may mẫu thử và hoàn thành sản xuất mất bao lâu?",
                a: "Bản vẽ 3D được hoàn thiện trong vòng 15 - 30 phút. Áo mẫu thực tế may trong 2 - 3 ngày làm việc. Thời gian sản xuất đơn hàng lớn từ 5 - 10 ngày (HDC có hỗ trợ may gấp 3 - 5 ngày cho các sự kiện khai trương, hội nghị).",
              },
              {
                q: "Số lượng tối thiểu nhận may theo yêu cầu là bao nhiêu?",
                a: "HDC Fashion nhận đơn đặt may chỉ từ 10 áo đối với các dòng polo, áo thun, sơ mi tiêu chuẩn. Với các đơn hàng từ 50 áo trở lên, quý khách được MIỄN PHÍ may áo mẫu thực tế trước khi may hàng loạt.",
              },
              {
                q: "HDC có may đo theo số đo từng nhân viên hay theo bảng size chuẩn?",
                a: "Chúng tôi hỗ trợ cả 2 hình thức: Cung cấp bộ áo mẫu đủ size (S, M, L, XL, 2XL, 3XL...) để nhân sự mặc thử chọn size chuẩn nhất, hoặc cử chuyên viên may đo tận nơi đối với các gói vest và đồng phục bespoke cao cấp.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Hotline CTA Box */}
          <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-brand-800/30 to-brand-900/40 border border-brand-500/30 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">
              Cần trao đổi trực tiếp với giám đốc kỹ thuật may HDC?
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ quý khách về phối màu, chất liệu vải phù hợp ngân sách và bảng size tiêu chuẩn.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Hotline: {BRAND_INFO.contact.hotline}
              </a>
              <a
                href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Chat Zalo Tư Vấn Nhanh
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TrustBar & Final CTA */}
      <TrustBar />
      <FinalCtaSection />
    </>
  );
}
