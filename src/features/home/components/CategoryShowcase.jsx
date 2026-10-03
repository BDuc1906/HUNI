"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Crown,
  Activity,
  GraduationCap,
  PackageCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ============================================================
// 5 DANH MỤC CHÍNH — Dẫn link tới 5 trang con
// Ảnh phụ kiện đã sửa: dùng 04_culture_accessories_01.jpg
// ============================================================
const CATEGORIES_DATA = [
  {
    id: "corporate",
    name: "Đồng Phục Doanh Nghiệp",
    shortName: "Doanh Nghiệp",
    desc: "Polo, sơ mi, áo thun, đồng phục công sở chuẩn form",
    image: "/images/06_polo_01.jpg",
    icon: Briefcase,
    href: "/dong-phuc-doanh-nghiep",
    color: "from-brand-400 to-brand-600",
    badge: "Phổ Biến",
    count: "12 mẫu",
  },
  {
    id: "bespoke",
    name: "Đồng Phục May Đo Cao Cấp",
    shortName: "May Đo",
    desc: "Vest doanh nhân, đầm công sở, đo ni từng nhân sự",
    image: "/images/uniform_corporate_suits.jpg",
    icon: Crown,
    href: "/dong-phuc-may-do",
    color: "from-amber-500 to-amber-700",
    badge: "Đẳng Cấp",
    count: "3 mẫu",
  },
  {
    id: "sport",
    name: "Đồng Phục Thể Thao & Golf",
    shortName: "Thể Thao",
    desc: "Golf, Pickleball, Marathon, Team building năng động",
    image: "/images/08_golf_event_01.jpg",
    icon: Activity,
    href: "/dong-phuc-the-thao",
    color: "from-emerald-400 to-emerald-600",
    badge: "Xu Hướng",
    count: "3 mẫu",
  },
  {
    id: "school",
    name: "Đồng Phục Trường Học",
    shortName: "Trường Học",
    desc: "Học sinh các cấp, sinh viên, giáo viên chuẩn nề nếp",
    image: "/images/09_kids_school_03.jpg",
    icon: GraduationCap,
    href: "/dong-phuc-truong-hoc",
    color: "from-blue-500 to-blue-700",
    badge: "Chuẩn QT",
    count: "2 mẫu",
  },
  {
    id: "accessories",
    name: "Phụ Kiện Doanh Nghiệp",
    shortName: "Phụ Kiện",
    desc: "Mũ nón, cặp da, cà vạt, túi quà tặng thương hiệu",
    // ✅ ĐÃ SỬA: từ uniform_accessories.jpg → 04_culture_accessories_01.jpg
    image: "/images/04_culture_accessories_01.jpg",
    icon: PackageCheck,
    href: "/phu-kien-doanh-nghiep",
    color: "from-purple-500 to-purple-700",
    badge: "Quà Tặng",
    count: "2 mẫu",
  },
];

export default function CategoryShowcase() {
  return (
    <section
      id="category-showcase"
      className="py-14 sm:py-20 bg-gradient-to-b from-white via-brand-50/20 to-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            5 Dòng Sản Phẩm Chính
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            KHÁM PHÁ DANH MỤC ĐỒNG PHỤC HDC
          </h2>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Chọn dòng sản phẩm phù hợp với doanh nghiệp, tổ chức của bạn — mỗi
            danh mục có thiết kế riêng, bảng giá sỉ riêng.
          </p>
        </div>

        {/* ============================================
            GRID 5 DANH MỤC
            ============================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORIES_DATA.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 active:scale-[0.98]"
              >
                {/* ==========================================
                    Image + Gradient Overlay
                    ========================================== */}
                <div className="relative h-36 sm:h-44 lg:h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    quality={85}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Icon badge — góc trên phải */}
                  <div
                    className={`absolute top-2.5 right-2.5 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-xl ring-2 ring-white/40 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Badge — góc trên trái */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#004f5e] shadow-md">
                    {cat.badge}
                  </div>

                  {/* Short name — góc dưới */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white text-xs sm:text-sm font-black uppercase tracking-wider leading-tight line-clamp-2 drop-shadow-lg">
                      {cat.shortName}
                    </div>
                    <div className="text-brand-200 text-[10px] font-semibold mt-0.5">
                      {cat.count}
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    Content
                    ========================================== */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-[#004f5e] text-xs sm:text-sm lg:text-base leading-tight line-clamp-2 group-hover:text-brand-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 leading-snug line-clamp-2 hidden sm:block">
                      {cat.desc}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold">
                    <span className="text-brand-700 group-hover:text-brand-800 transition-colors whitespace-nowrap">
                      Xem danh mục
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-500 group-hover:translate-x-1 group-hover:text-brand-700 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ============================================
            BOTTOM CTA
            ============================================ */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href="#catalog-section"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transform hover:-translate-y-1 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Xem Tất Cả Sản Phẩm</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}