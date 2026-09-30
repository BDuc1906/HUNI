// ==================================================
// src/app/blog/page.jsx
// Content Hub Blog & Kiến Thức May Mặc HDC Fashion (Priority: 0.8)
// ==================================================

import React from "react";
import Link from "next/link";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import { BRAND_INFO } from "@/shared/data";
import {
  BookOpen,
  ChevronRight,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Phone,
  Ruler,
  Tag,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "Blog & Cẩm Nang Đồng Phục Doanh Nghiệp | HDC FASHION",
  description:
    "Chuyên mục kiến thức thời trang công sở, bảng size áo sơ mi nam, cẩm nang chọn vải may đồng phục và xu hướng thiết kế 2026 bởi HDC Fashion.",
  openGraph: {
    title: "Blog & Cẩm Nang Đồng Phục Doanh Nghiệp | HDC FASHION",
    description:
      "Cập nhật xu hướng đồng phục, bảng size chuẩn và báo giá may đo công ty từ chuyên gia HDC.",
    type: "website",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const blogs = SITE_HIERARCHY.blogs;
  const keyArticles = blogs.filter((b) => b.isKeyArticle);
  const otherArticles = blogs.filter((b) => !b.isKeyArticle);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-semibold">Blog Kiến Thức</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>HDC Knowledge Hub 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              CẨM NANG &amp; KINH NGHIỆM{" "}
              <span className="text-brand-300">MAY ĐO ĐỒNG PHỤC DOANH NGHIỆP</span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
              Tổng hợp kiến thức chuyên sâu về bảng size chuẩn, kỹ thuật dệt may, đánh giá chất liệu vải và kinh nghiệm tối ưu chi phí đặt may đồng phục cho công ty.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Bài viết tiêu điểm nổi bật */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Bài Viết Tiêu Điểm Cần Đọc
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={article.url}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-brand-400 hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 bg-brand-50 text-brand-800 border border-brand-200 rounded-full text-xs font-bold">
                        {article.categoryBadge}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Tác giả: {article.author}
                    </span>
                    <span className="text-brand-700 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Đọc chi tiết <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Toàn bộ danh sách bài viết */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Tất Cả Bài Viết ({blogs.length})
              </h2>
              <span className="text-xs text-slate-500">
                Cập nhật thường xuyên
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((article) => (
                <Link
                  key={article.slug}
                  href={article.url}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                        {article.categoryBadge}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#004f5e] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-700 font-bold">
                    <span>Xem bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Banner Báo giá & Tư vấn trực tiếp */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#003843] to-[#005a6b] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Hỗ Trợ Tư Vấn Tận Nơi 24/7
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Cần Tư Vấn Thiết Kế &amp; Báo Giá May Đồng Phục?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Đội ngũ chuyên viên may đo HDC sẵn sàng mang bảng vải thực tế và mẫu áo đến tận văn phòng công ty của bạn.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-brand-400 hover:bg-brand-300 text-[#003843] font-extrabold text-xs sm:text-sm text-center shadow-lg transition-all"
              >
                Hotline: {BRAND_INFO.contact.hotline}
              </a>
              <Link
                href="/lien-he"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm text-center border border-white/20 transition-all"
              >
                Liên hệ showroom
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
