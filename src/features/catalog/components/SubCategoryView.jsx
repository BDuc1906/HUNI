"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/shared/providers/ShopProvider";
import { SITE_TREE } from "@/shared/data/siteArchitecture";
import { PRODUCTS } from "@/shared/data/products";
import ProductCard from "./ProductCard";
import WhyChooseUs from "@/features/home/components/WhyChooseUs";
import QuickQuoteSection from "@/features/quote/components/QuickQuoteSection";
import {
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Ruler,
  Layers,
  ArrowRight,
  Award,
  Zap,
} from "lucide-react";

export default function SubCategoryView({ fullPath, hubSlug, hubTitle, initialCategory }) {
  const { setIsQuickQuoteOpen } = useShop();

  // Tìm node trong cây kiến trúc
  const currentItem =
    SITE_TREE.find((item) => item.path === fullPath) || {
      label: hubTitle,
      desc: "Bộ sưu tập đồng phục cao cấp chuẩn nhận diện thương hiệu",
      priority: 0.8,
    };

  // Các anh chị em (siblings hoặc sub-categories) cùng nhóm
  const relatedItems = SITE_TREE.filter(
    (item) =>
      item.path !== fullPath &&
      (item.parentPath === fullPath ||
        item.parentPath === currentItem.parentPath ||
        (item.path.startsWith(hubSlug) && item.path !== hubSlug))
  ).slice(0, 6);

  // Lọc sản phẩm phù hợp
  const subSlug = fullPath.split("/").pop();
  const relevantProducts = PRODUCTS.filter((p) => {
    // 1. Theo category chính
    if (initialCategory && p.category === initialCategory) return true;
    // 2. Theo từ khóa trong slug (polo, so-mi, vest, golf, hoc-sinh...)
    const pathLower = fullPath.toLowerCase();
    if (pathLower.includes("so-mi") || pathLower.includes("seamless")) {
      return (
        p.title.toLowerCase().includes("sơ mi") ||
        p.material.toLowerCase().includes("bamboo") ||
        p.material.toLowerCase().includes("kate")
      );
    }
    if (pathLower.includes("polo")) {
      return (
        p.title.toLowerCase().includes("polo") ||
        p.material.toLowerCase().includes("cá sấu") ||
        p.material.toLowerCase().includes("compact")
      );
    }
    if (pathLower.includes("vest") || pathLower.includes("dam")) {
      return (
        p.category === "bespoke_suit" ||
        p.title.toLowerCase().includes("vest") ||
        p.title.toLowerCase().includes("đầm")
      );
    }
    if (pathLower.includes("golf") || pathLower.includes("pickleball") || pathLower.includes("marathon")) {
      return p.category === "sport_golf";
    }
    if (pathLower.includes("school") || pathLower.includes("hoc-sinh") || pathLower.includes("giao-vien")) {
      return p.category === "school";
    }
    if (pathLower.includes("phu-kien") || pathLower.includes("mu-non") || pathLower.includes("cap-da") || pathLower.includes("ca-vat")) {
      return p.category === "accessories";
    }
    return true;
  });

  const displayProducts = relevantProducts.length > 0 ? relevantProducts : PRODUCTS.slice(0, 6);

  // Xây dựng breadcrumbs
  const pathParts = fullPath.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Trang Chủ", href: "/" },
  ];
  let accumulated = "";
  pathParts.forEach((part, index) => {
    accumulated += `/${part}`;
    const matched = SITE_TREE.find((t) => t.path === accumulated);
    breadcrumbs.push({
      label: matched?.label || part,
      href: accumulated,
      isCurrent: index === pathParts.length - 1,
    });
  });

  return (
    <>
      {/* ============================================================
          HERO BANNER
          ============================================================ */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 sm:mb-6 flex-wrap">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.href}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                {bc.isCurrent ? (
                  <span className="text-white font-bold">{bc.label}</span>
                ) : (
                  <Link href={bc.href} className="hover:text-white transition-colors">
                    {bc.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                {hubTitle}
              </span>

              {currentItem.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/40 shadow-sm animate-pulse">
                  {currentItem.badge}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-[11px] text-brand-200/80 bg-white/10 px-2.5 py-0.5 rounded-full">
                Ưu tiên SEO: [{currentItem.priority}]
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              {currentItem.label.toUpperCase()} <br />
              <span className="text-brand-300 font-extrabold">HDC FASHION CHUẨN FORM CHÂU ÂU</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              {currentItem.desc}. Sản xuất trực tiếp tại xưởng may 2.500m² với công nghệ dệt may tân tiến, mang đến sự đẳng cấp, bền bỉ và bản sắc văn hóa riêng cho quý tổ chức.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200 pt-2 border-t border-brand-400/20">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Thiết kế 3D độc quyền nhận diện</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>Thêu Tajima sắc sảo từng đường kim</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>May áo mẫu thử tận nơi 0đ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          QUICK SUB-NAVIGATION PILLS
          ============================================================ */}
      {relatedItems.length > 0 && (
        <section className="bg-white border-b border-slate-200 py-3 sticky top-[60px] sm:top-[72px] z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 text-[11px]">
                Xem thêm:
              </span>
              <Link
                href={hubSlug}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-semibold border border-slate-200 transition-colors shrink-0"
              >
                Tất cả {hubTitle}
              </Link>
              {relatedItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-1.5 rounded-full font-semibold border transition-all shrink-0 flex items-center gap-1.5 ${
                    item.path === fullPath
                      ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                      : "bg-white text-slate-700 hover:border-brand-400 hover:text-brand-600 border-slate-200"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-black">
                      ★
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          PRODUCT GRID
          ============================================================ */}
      <section className="py-12 sm:py-16 bg-[#f6f8ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Danh mục sản phẩm đề xuất</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900">
                Mẫu {currentItem.label} Tiêu Biểu ({displayProducts.length} mẫu)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/bang-vai"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-600 text-xs font-bold transition-colors shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-brand-500" />
                <span>Bảng So Sánh Vải</span>
              </Link>
              <Link
                href="/blog/size-ao-so-mi-nam"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-600 text-xs font-bold transition-colors shadow-xs"
              >
                <Ruler className="w-3.5 h-3.5 text-brand-500" />
                <span>Bảng Size Chuẩn</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Quick CTA Card */}
          <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-[#004f5e] via-[#00677a] to-[#007f96] rounded-2xl sm:rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-brand-400/30">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-400/20 text-brand-200 text-xs font-bold uppercase tracking-wider mb-2 border border-brand-400/30">
                Ưu đãi may đo theo hợp đồng doanh nghiệp
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-2">
                Cần đặt may {currentItem.label} số lượng lớn?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Đăng ký ngay hôm nay để nhận chiết khấu trực tiếp tại xưởng lên tới 40%, miễn phí may áo mẫu thử duyệt chất liệu và vận chuyển tận nơi 63 tỉnh thành.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => setIsQuickQuoteOpen(true)}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-brand-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Đăng Ký Báo Giá Nhanh</span>
              </button>
              <a
                href="tel:0984959586"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors text-center flex items-center justify-center gap-2 border border-brand-300/40"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline: 0984.959.586</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & PROCESS */}
      <WhyChooseUs />

      {/* QUICK QUOTE FORM */}
      <QuickQuoteSection />
    </>
  );
}
