"use client";

import React from "react";
import Image from "next/image";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  CheckCircle2,
  Sparkles,
  Ruler,
  Feather,
  Shirt,
  ArrowRight,
  Phone,
  Palette
} from "lucide-react";

const SEAMLESS_FEATURES = [
  {
    icon: Shirt,
    title: "Liền Mạch Không Đường May",
    desc: "Công nghệ liền mạch, không sử dụng đường may thường được áp dụng tại tay áo, nẹp áo và vai áo."
  },
  {
    icon: Ruler,
    title: "Co Giãn 4 Chiều Cao Cấp",
    desc: "Chất liệu vải cao cấp, co giãn 4 chiều và cực kỳ thoải mái khi vận động suốt cả ngày dài."
  },
  {
    icon: Feather,
    title: "Siêu Nhẹ - Siêu Mềm Mịn",
    desc: "Trọng lượng áo siêu nhẹ, cảm giác khó sờ vào — siêu mềm mịn như làn da thứ hai."
  }
];

const SEAMLESS_COLORS = [
  { name: "Xanh Dương Nhạt", code: "#93B7D9" },
  { name: "Xám Ghi", code: "#9CA3AF" },
  { name: "Hồng Pastel", code: "#F4C2C2" },
  { name: "Xanh Navy", code: "#1E3A8A" },
  { name: "Trắng Sữa", code: "#f6f8ff" },
  { name: "Xanh Sky", code: "#78A6C8" }
];

const SEAMLESS_IMAGES = [
  {
    img: "/images/05_bestseller_shirts_01.jpg",
    label: "Chất Liệu Cao Cấp",
    desc: "Co giãn 4 chiều, thoải mái"
  },
  {
    img: "/images/05_bestseller_shirts_05.jpg",
    label: "Đường Liền Mạch",
    desc: "Tay áo, nẹp, vai áo seamless"
  },
  {
    img: "/images/05_bestseller_shirts_09.jpg",
    label: "Siêu Nhẹ - Siêu Mềm",
    desc: "Trọng lượng nhẹ, mềm mịn"
  }
];

export default function SeamlessTechSection() {
  const { setIsQuickQuoteOpen } = useShop();

  return (
    <section
      id="seamless-tech-section"
      className="py-16 sm:py-20 bg-white border-t border-slate-200 relative overflow-hidden"
    >
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-slate-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Công Nghệ Độc Quyền HDC Fashion
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            CÔNG NGHỆ SEAMLESS
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-gradient">
            Sơ Mi Không Đường May
          </p>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2">
            Bước đột phá trong công nghệ dệt may — loại bỏ hoàn toàn đường may truyền thống,
            mang đến trải nghiệm mặc thoải mái tuyệt đối cho người mặc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {SEAMLESS_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <h3 className="font-extrabold text-[#004f5e] text-base sm:text-lg leading-tight group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-14">
          {SEAMLESS_IMAGES.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300"
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004f5e]/70 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className="text-[11px] text-brand-200 font-medium">{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-brand-600 shrink-0" />
              <h3 className="font-extrabold text-[#004f5e] text-sm sm:text-base">
                Bảng Màu Sơ Mi Seamless Có Sẵn
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SEAMLESS_COLORS.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-400 transition-colors"
                >
                  <span
                    className="w-7 h-7 rounded-full border-2 border-slate-300 shadow-sm shrink-0"
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] sm:text-xs text-slate-500 italic leading-relaxed">
              ★ Có thể tùy chỉnh màu theo mã nhận diện thương hiệu riêng của quý doanh nghiệp.
            </p>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-[#004f5e] via-[#00677a] to-[#003843] rounded-2xl border border-brand-500/30 p-5 sm:p-6 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-extrabold text-base sm:text-lg md:text-xl mb-2 relative z-10">
              Trải Nghiệm Công Nghệ Seamless
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed relative z-10">
              Nhận ngay mẫu vải Seamless và áo thử để cảm nhận sự khác biệt —
              miễn phí hoàn toàn cho doanh nghiệp.
            </p>

            <div className="space-y-2 relative z-10">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Nhận Báo Giá Seamless</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-brand-400/60 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Phone className="w-4 h-4 text-brand-400 animate-pulse shrink-0" />
                <span className="truncate">Hotline: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
