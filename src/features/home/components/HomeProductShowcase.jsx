"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS, BRAND_INFO } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Scissors,
  CheckCircle2,
  FileText,
  Phone,
  SlidersHorizontal,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "all", label: "Tất Cả Sản Phẩm" },
  { id: "so-mi", label: "Áo Sơ Mi Công Sở", isHot: true },
  { id: "polo", label: "Áo Polo Doanh Nghiệp" },
  { id: "vest", label: "May Đo & Vest Lãnh Đạo" },
  { id: "sport", label: "Thể Thao & Golf" },
  { id: "school", label: "Đồng Phục Trường Học" },
  { id: "accessories", label: "Phụ Kiện Doanh Nghiệp" },
];

export default function HomeProductShowcase() {
  const { setIsQuickQuoteOpen } = useShop();
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return PRODUCTS.slice(0, 12);

    return PRODUCTS.filter((item) => {
      const titleLower = item.title.toLowerCase();
      const catLower = item.category.toLowerCase();
      const matLower = item.material.toLowerCase();

      if (activeTab === "so-mi") {
        return titleLower.includes("sơ mi") || matLower.includes("bamboo") || matLower.includes("kate");
      }
      if (activeTab === "polo") {
        return titleLower.includes("polo") || matLower.includes("cá sấu") || matLower.includes("compact");
      }
      if (activeTab === "vest") {
        return catLower === "bespoke_suit" || titleLower.includes("vest") || titleLower.includes("đầm");
      }
      if (activeTab === "sport") {
        return catLower === "sport_golf" || titleLower.includes("golf") || titleLower.includes("marathon");
      }
      if (activeTab === "school") {
        return catLower === "school" || titleLower.includes("học sinh") || titleLower.includes("trường");
      }
      if (activeTab === "accessories") {
        return catLower === "accessories" || titleLower.includes("nón") || titleLower.includes("cặp") || titleLower.includes("cà vạt");
      }
      return true;
    }).slice(0, 12);
  }, [activeTab]);

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* =============================================
            1. SECTION HEADER TRANG CHỦ
            ============================================= */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2 sm:space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            BỘ SƯU TẬP ĐỒNG PHỤC DOANH NGHIỆP 2026
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] tracking-tight">
            SẢN PHẨM TIÊU BIỂU &amp; BÁN CHẠY NHẤT
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Các dòng đồng phục chủ lực được hơn 50.000+ doanh nghiệp toàn quốc tin dùng:
            Vải sợi tre kháng khuẩn tự nhiên, chống nhăn 100 lần giặt, may đo chuẩn phom dáng châu Âu.
          </p>
        </div>

        {/* =============================================
            2. BẢNG 4 CAM KẾT CHẤT LƯỢNG B2B
            ============================================= */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">Vải Kháng Khuẩn</div>
              <div className="text-[10px] text-slate-500 truncate">Bamboo &amp; Cotton Compact</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">May Mẫu Thử 0đ</div>
              <div className="text-[10px] text-slate-500 truncate">Duyệt form trước khi may loạt</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">Xưởng May 2.500m²</div>
              <div className="text-[10px] text-slate-500 truncate">50.000 sản phẩm / tháng</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-[#004f5e] truncate">Bảo Hành 1 Đổi 1</div>
              <div className="text-[10px] text-slate-500 truncate">Đổi mới trong 30 ngày</div>
            </div>
          </div>
        </div>

        {/* =============================================
            3. THANH TAB CHỌN NHANH (TABS NGANG RÕ RÀNG)
            ============================================= */}
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-1 -mx-3 sm:mx-0 px-3 sm:px-0">
          <div className="flex items-center gap-2 min-w-max justify-start md:justify-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#004f5e] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.isHot && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                      Hot
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =============================================
            4. LƯỚI SẢN PHẨM TRANG CHỦ 4 CỘT THÔNG THOÁNG
            (KHÔNG CÓ THANH LỌC SIDEBAR ÉP HẸP MÀN HÌNH)
            ============================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* =============================================
            5. CTA XEM TOÀN BỘ & ĐẾN TRANG CÓ BỘ LỌC ĐẦY ĐỦ
            ============================================= */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-50 via-brand-50/50 to-slate-50 border border-brand-200 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-700">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Cần tìm kiếm chi tiết theo chất liệu, màu sắc và mức giá sỉ?
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-[#004f5e]">
              Khám phá toàn bộ 37+ mẫu đồng phục tại trang danh mục đầy đủ
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Trang danh mục có đầy đủ bộ lọc bên trái (chất liệu sợi vải, bảng giá sỉ chi tiết, kiểu tay, form dáng)
              giúp quý doanh nghiệp chọn đúng mẫu chuẩn nhận diện nhanh chóng nhất.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/dong-phuc-doanh-nghiep"
              className="px-5 py-3 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-bold text-xs sm:text-sm rounded-xl shadow transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Xem Trang Danh Mục Đầy Đủ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Báo Giá Nhanh 5 Phút</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
