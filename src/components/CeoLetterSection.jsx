"use client";

import React from "react";
import { BRAND_INFO } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import {
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Truck,
  HeartHandshake
} from "lucide-react";

export default function CeoLetterSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section id="ceo-letter-section" className="py-20 bg-gradient-to-b from-[#071b34] to-[#040e1c] text-white relative overflow-hidden border-t border-b border-amber-500/20">
      {/* Background Decorative Gold Watermarks */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header Title matching Image 1 */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Thư Mời Hợp Tác Doanh Nghiệp
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            THƯ MỜI HỢP TÁC
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-gold-gradient">
            Nâng tầm thương hiệu cùng HUNI UNIFORM
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mt-2" />
        </div>

        {/* Main Content Card with Golden Border */}
        <div className="bg-[#0b2042]/90 backdrop-blur-md rounded-3xl border border-amber-400/30 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: CEO Portrait Card */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group">
                {/* Gold glowing border */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />

                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl max-w-sm w-full bg-slate-900">
                  <img
                    src={BRAND_INFO.ceo.image}
                    alt={BRAND_INFO.ceo.name}
                    className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                  />

                  {/* Golden Name Tag on Portrait */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#071b34] via-[#071b34]/90 to-transparent p-5 text-white">
                    <h3 className="text-xl font-black text-amber-300 tracking-wide uppercase">
                      {BRAND_INFO.ceo.name}
                    </h3>
                    <div className="text-xs font-bold text-white uppercase tracking-wider mt-0.5">
                      {BRAND_INFO.ceo.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Hotline badge */}
              <div className="mt-6 w-full max-w-sm space-y-2 text-left bg-[#071b34]/90 p-4 rounded-2xl border border-amber-400/20 text-xs">
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="flex items-center gap-3 text-amber-400 hover:text-amber-300 font-extrabold text-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400">
                    <Phone className="w-4 h-4 animate-bounce" />
                  </div>
                  <span>Hotline Trực Tiếp: {BRAND_INFO.contact.hotline}</span>
                </a>

                <div className="flex items-start gap-3 text-slate-300 pt-2 border-t border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white">Trụ sở xưởng:</strong> {BRAND_INFO.contact.headquarters}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300 pt-2 border-t border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white">VP Hà Nội:</strong> {BRAND_INFO.contact.branchHanoi}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Letter Content & 4 Partnership Benefits */}
            <div className="lg:col-span-7 space-y-6">
              {/* About HUNI Paragraph */}
              <div className="space-y-3">
                <div className="text-amber-400 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Về HUNI UNIFORM:</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
                  {BRAND_INFO.ceo.bio}
                </p>
                <p className="text-amber-200/90 text-sm italic font-medium">
                  &ldquo;Chúng tôi tin rằng, mỗi bộ đồng phục không chỉ là trang phục công sở đơn thuần,
                  mà còn là niềm tự hào, đại diện cho bản sắc văn hóa và đẳng cấp của một tập thể.&rdquo;
                </p>
              </div>

              {/* 4 Partnership Benefits matching Image 1 */}
              <div>
                <div className="text-amber-400 font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>LỢI ÍCH HỢP TÁC VÀNG:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#071b34]/90 p-4 rounded-2xl border border-slate-700/80 hover:border-amber-400/50 transition-colors flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Chất Lượng Vượt Trội</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Vải dệt công nghệ mới, kháng khuẩn, co giãn 4 chiều, không bai xù.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#071b34]/90 p-4 rounded-2xl border border-slate-700/80 hover:border-amber-400/50 transition-colors flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Thiết Kế Độc Quyền</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Miễn phí phác thảo 3D và may mẫu áo thật duyệt form trước khi may đồng loạt.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#071b34]/90 p-4 rounded-2xl border border-slate-700/80 hover:border-amber-400/50 transition-colors flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Giá Cả Cạnh Tranh</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Sản xuất khép kín tại xưởng 2.500m², giá gốc tận tay doanh nghiệp.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#071b34]/90 p-4 rounded-2xl border border-slate-700/80 hover:border-amber-400/50 transition-colors flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Dịch Vụ Tận Tâm</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Bảo hành 1 đổi 1 trong 30 ngày, hỗ trợ may bổ sung số lượng ít trọn đời.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Commitments matching Image 3 */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Award className="w-4 h-4" /> Chất lượng cam kết
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Sparkles className="w-4 h-4" /> Thiết kế độc quyền
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Scissors className="w-4 h-4" /> May đo chuyên nghiệp
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Truck className="w-4 h-4" /> Giao hàng đúng hẹn
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <HeartHandshake className="w-4 h-4" /> Đồng hành lâu dài
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => setIsQuickQuoteOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
                >
                  <span>Nhận Thư Báo Giá & Mẫu Vải Miễn Phí</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 animate-pulse" />
                  <span>Kết Nối Trực Tiếp CEO: {BRAND_INFO.contact.hotline}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
