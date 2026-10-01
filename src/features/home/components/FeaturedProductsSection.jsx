"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import {
  Sparkles,
  ArrowRight,
  Award,
  Briefcase,
  Crown,
  Activity,
  GraduationCap,
  PackageCheck,
} from "lucide-react";

// ============================================================
// FEATURED PRODUCTS — Sản phẩm theo từng loại đồng phục
//
// 📐 LAYOUT MỚI:
//   - Chia thành 5 hàng (5 categories chính)
//   - Mỗi hàng: tiêu đề loại + 5 sản phẩm/hàng trên desktop
//   - Mobile: 2 SP/hàng, Tablet: 3 SP/hàng
//
// 🎯 NGUỒN DỮ LIỆU:
//   - Lấy trực tiếp từ PRODUCTS theo category
//   - Mỗi category lấy tối đa 5 SP đầu tiên
// ============================================================

const SP_PER_ROW = 5;

// Cấu hình 5 nhóm sản phẩm hiển thị
const CATEGORY_GROUPS = [
  {
    id: "corporate",
    label: "Đồng Phục Doanh Nghiệp",
    desc: "Polo, sơ mi, áo thun công sở chuẩn form",
    icon: Briefcase,
    href: "/dong-phuc-doanh-nghiep",
    color: "from-brand-400 to-brand-600",
  },
  {
    id: "bespoke_suit",
    label: "May Đo Cao Cấp",
    desc: "Vest doanh nhân, đầm công sở đo ni",
    icon: Crown,
    href: "/dong-phuc-may-do",
    color: "from-amber-500 to-amber-700",
  },
  {
    id: "sport_golf",
    label: "Thể Thao & Golf",
    desc: "Golf, Pickleball, Marathon năng động",
    icon: Activity,
    href: "/dong-phuc-the-thao",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "school",
    label: "Đồng Phục Trường Học",
    desc: "Học sinh các cấp, sinh viên, giáo viên",
    icon: GraduationCap,
    href: "/dong-phuc-truong-hoc",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "accessories",
    label: "Phụ Kiện Doanh Nghiệp",
    desc: "Mũ nón, cặp da, cà vạt, túi quà tặng",
    icon: PackageCheck,
    href: "/phu-kien-doanh-nghiep",
    color: "from-purple-500 to-purple-700",
  },
];

export default function FeaturedProductsSection() {
  // ============================================================
  // NHÓM SẢN PHẨM THEO CATEGORY — MỖI NHÓM LẤY 5 SP
  // ============================================================
  const groupedProducts = CATEGORY_GROUPS.map((group) => ({
    ...group,
    products: PRODUCTS.filter((p) => p.category === group.id).slice(
      0,
      SP_PER_ROW
    ),
  })).filter((group) => group.products.length > 0); // Bỏ nhóm rỗng

  const hasData = groupedProducts.length > 0;

  return (
    <section
      id="featured-products-section"
      className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            Bán Chạy Nhất
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
            SẢN PHẨM NỔI BẬT
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Những mẫu đồng phục được khách hàng doanh nghiệp lựa chọn nhiều
            nhất — phân theo từng loại sản phẩm.
          </p>
        </div>

        {/* ============================================
            NỘI DUNG — 5 NHÓM, MỖI NHÓM 1 HÀNG 5 SP
            ============================================ */}
        {hasData ? (
          <div className="space-y-10 sm:space-y-14">
            {groupedProducts.map((group) => {
              const Icon = group.icon;

              return (
                <div key={group.id}>
                  {/* ==========================================
                      Header nhóm — Tiêu đề loại + CTA xem thêm
                      ========================================== */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6 pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white shadow-md shrink-0`}
                      >
                        <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#004f5e] leading-tight">
                          {group.label}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {group.desc}
                        </p>
                      </div>
                    </div>

                    {/* CTA xem thêm */}
                    <Link
                      href={group.href}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors whitespace-nowrap shrink-0 group/link"
                    >
                      <span>Xem tất cả</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* ==========================================
                      Grid 5 sản phẩm / hàng (desktop)
                      Mobile: 2 cột | Tablet: 3 cột | Desktop: 5 cột
                      ========================================== */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                    {group.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}

                    {/* Nếu nhóm thiếu SP so với 5, không cần filler — grid tự co */}
                  </div>
                </div>
              );
            })}

            {/* ==========================================
                CTA tổng — Xem tất cả sản phẩm
                ========================================== */}
            <div className="pt-4 text-center">
              <Link
                href="/dong-phuc-doanh-nghiep"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transform hover:-translate-y-1 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Xem Tất Cả Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <p className="mt-3 text-xs text-slate-500">
                Hơn 40+ mẫu đồng phục đang chờ bạn khám phá
              </p>
            </div>
          </div>
        ) : (
          /* ============================================
              PLACEHOLDER — khi chưa có sản phẩm nào
              ============================================ */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#004f5e] mb-2">
              Danh Sách Đang Được Cập Nhật
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-5">
              HDC đang tổng hợp và cập nhật danh sách sản phẩm nổi bật. Vui lòng
              quay lại sau hoặc xem toàn bộ sản phẩm ngay bây giờ.
            </p>

            <Link
              href="/dong-phuc-doanh-nghiep"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Xem Tất Cả Sản Phẩm</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}