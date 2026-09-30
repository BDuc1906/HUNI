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
} from "lucide-react";

// ============================================================
// TIN TỨC / BLOG — Hiển thị 3 bài viết mới nhất
// Data từ SITE_HIERARCHY.blogs → tự cập nhật khi thêm bài mới
// ============================================================

const FEATURED_BLOG_COUNT = 3;

export default function NewsSection() {
  const blogs = SITE_HIERARCHY?.blogs || [];

  // Nếu chưa có blog → ẩn section
  if (blogs.length === 0) {
    return null;
  }

  // Lấy 3 bài mới nhất (đảo ngược thứ tự)
  const latestBlogs = [...blogs]
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);
      return dateB - dateA;
    })
    .slice(0, FEATURED_BLOG_COUNT);

  return (
    <section
      id="news-section"
      className="py-14 sm:py-20 bg-white border-t border-slate-200"
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
            GRID 3 BÀI VIẾT
            ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {latestBlogs.map((article) => (
            <Link
              key={article.slug}
              href={article.url}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Body */}
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
                  <h3 className="font-extrabold text-[#004f5e] text-sm sm:text-base leading-snug mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{article.publishedAt}</span>
                  </div>
                  <span className="text-brand-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Đọc tiếp
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ============================================
            CTA mobile — Xem tất cả
            ============================================ */}
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
      </div>
    </section>
  );
}