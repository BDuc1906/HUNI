"use client";

import React from "react";
import Link from "next/link";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import {
  Newspaper,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

// ============================================================
// NEWS SECTION — Blog / Tin tức trên trang chủ
// Tự động lấy 3 bài MỚI NHẤT từ SITE_HIERARCHY.blogs
// ============================================================

const FEATURED_BLOG_COUNT = 3;

export default function NewsSection() {
  const blogs = SITE_HIERARCHY?.blogs || [];

  // Lấy 3 bài mới nhất (sort theo publishedAt giảm dần)
  const latestBlogs = [...blogs]
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);
      return dateB - dateA;
    })
    .slice(0, FEATURED_BLOG_COUNT);

  const hasData = latestBlogs.length > 0;

  return (
    <section
      id="news-section"
      className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ============================================
            HEADER
            ============================================ */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
              <Newspaper className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
              Tin Tức & Kiến Thức
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e] text-balance">
              CẨM NANG ĐỒNG PHỤC
            </h2>

            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Kiến thức chọn vải, bảng size chuẩn, xu hướng đồng phục và kinh
              nghiệm đặt may cho doanh nghiệp.
            </p>
          </div>

          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-bold text-xs rounded-xl shadow-md transition-colors shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ============================================
            BLOG GRID hoặc PLACEHOLDER
            ============================================ */}
        {hasData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {latestBlogs.map((article) => (
                <Link
                  key={article.slug}
                  href={article.url}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Top gradient bar */}
                  <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Badge + Read time */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold">
                          {article.categoryBadge}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-[#004f5e] text-sm sm:text-base leading-snug mb-2 group-hover:text-brand-700 transition-colors line-clamp-2 min-h-[2.5em]">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-slate-400 min-w-0 truncate">
                        <User className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {article.author?.split("(")[0].trim() || "HDC"}
                        </span>
                      </div>
                      <span className="text-brand-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                        Đọc tiếp
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Xem tất cả bài viết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        ) : (
          /* Placeholder khi chưa có blog */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#004f5e] mb-2">
              Blog Đang Được Cập Nhật
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-5">
              Các bài viết về kiến thức đồng phục đang được chuẩn bị. Vui lòng
              quay lại sau.
            </p>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Vào trang Blog</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}