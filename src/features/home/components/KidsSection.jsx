"use client";

import React from "react";
import Image from "next/image";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  ArrowRight,
  Palette,
  RefreshCw,
  Layers,
  Shapes,
  Ruler,
  Wallet,
  Heart,
  Smile
} from "lucide-react";

// ==================================================
// 6 LÝ DO CHỌN HDC KIDS
// ==================================================
const KIDS_REASONS = [
  {
    icon: Palette,
    title: "Thiết Kế Phù Hợp Tập Thể",
    desc: "Tư vấn, thiết kế MIỄN PHÍ phù hợp với hình ảnh và giá trị của tập thể trường học.",
  },
  {
    icon: RefreshCw,
    title: "Sửa Mẫu Không Giới Hạn",
    desc: "Không giới hạn số lần sửa chữa mẫu cho đến khi nhà trường hoàn toàn hài lòng.",
  },
  {
    icon: Layers,
    title: "Đa Dạng Mẫu Đồng Phục",
    desc: "Vest, sơ mi, polo sử dụng chất liệu cao cấp, bền đẹp, thân thiện môi trường và an toàn cho làn da.",
  },
  {
    icon: Palette,
    title: "Đa Dạng Chất Liệu & Màu Sắc",
    desc: "Chất liệu và màu sắc phong phú, đáp ứng mọi yêu cầu thiết kế của nhà trường.",
  },
  {
    icon: Ruler,
    title: "Đa Dạng Form Áo",
    desc: "Nhiều form áo khác nhau phù hợp với mọi vóc dáng của học sinh các lứa tuổi.",
  },
  {
    icon: Wallet,
    title: "Giá Thành Phù Hợp",
    desc: "Các sản phẩm có giá thành phù hợp với nhiều phân khúc khách hàng khác nhau.",
  }
];

// ==================================================
// ẢNH HỌC SINH (dùng ảnh có sẵn)
// ==================================================
const KIDS_GALLERY = [
  { img: "/images/09_kids_school_03.jpg", label: "Học sinh tiểu học" },
  { img: "/images/10_kids_why_02.jpg", label: "Hoạt động lớp học" },
  { img: "/images/06_polo_01.jpg", label: "Polo Kids" },
  { img: "/images/09_kids_school_01.jpg", label: "Đồng phục Kids" },
];

export default function KidsSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="kids-section"
      className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 border-t border-slate-200 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* =============================================
            Header
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Smile className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            Dòng Sản Phẩm Cho Trẻ Em
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            ĐỒNG PHỤC HDC KIDS
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-gradient">
            Điểm Đến Chất Lượng Cho Học Sinh
          </p>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full mt-2" />
        </div>

        {/* =============================================
            Đoạn intro
            ============================================= */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-14 p-5 sm:p-7 bg-white rounded-2xl sm:rounded-3xl border border-emerald-200 shadow-md">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <strong className="text-[#004f5e]">HDC Fashion</strong> — điểm đến chất lượng cho đồng phục học sinh,
                nơi bạn tìm thấy sự hoàn hảo giữa phong cách và chất lượng.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-3">
                Chúng tôi tự hào mang đến cho bạn những giải pháp đồng phục độc đáo,
                phù hợp với hình ảnh và giá trị của tập thể trường học, cam kết mang đến
                sự hài lòng tuyệt đối cho khách hàng.
              </p>
            </div>
          </div>
        </div>

        {/* =============================================
            6 Lý do chọn HDC Kids
            ============================================= */}
        <div className="mb-10 sm:mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Tại Sao Chọn HDC Kids?
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#004f5e] mt-3">
              6 Lý Do Nhà Trường Tin Chọn
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {KIDS_REASONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-[#004f5e] text-base sm:text-lg mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =============================================
            Gallery ảnh Kids
            ============================================= */}
        <div className="mb-10 sm:mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Hình Ảnh Thực Tế
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#004f5e] mt-3">
              Các Em Học Sinh Trong Bộ Đồng Phục HDC
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KIDS_GALLERY.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    quality={85}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#004f5e]/70 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white text-xs sm:text-sm font-bold">
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =============================================
            CTA
            ============================================= */}
        <div className="text-center">
          <button
            onClick={() => setIsQuickQuoteOpen(true)}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Nhận Báo Giá Đồng Phục Kids</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            Hotline tư vấn:{" "}
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="font-bold text-emerald-700 hover:underline"
            >
              {BRAND_INFO.contact.hotline}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
