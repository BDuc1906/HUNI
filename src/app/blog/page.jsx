import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/shared/data/blogData";
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Ruler,
  Calculator,
  Search,
} from "lucide-react";

export const metadata = {
  title: "Cẩm Nang Đồng Phục & Thời Trang Doanh Nghiệp 2026 | HDC FASHION",
  description: "Tổng hợp kiến thức may mặc, bảng size áo sơ mi nam chuẩn, báo giá may đồng phục công ty tận xưởng và xu hướng thời trang doanh nghiệp mới nhất 2026.",
  openGraph: {
    title: "Cẩm Nang Đồng Phục & Thời Trang Doanh Nghiệp 2026 | HDC FASHION",
    description: "Tổng hợp kiến thức may mặc, bảng size chuẩn và báo giá đồng phục tận xưởng.",
    url: "https://hdcfashion.vn/blog",
    images: ["/images/05_bestseller_shirts_01.jpg"],
  },
};

export default function BlogIndexPage() {
  const featuredPosts = BLOG_POSTS.filter((p) => p.isKey);
  const remainingPosts = BLOG_POSTS.filter((p) => !p.isKey);

  return (
    <div className="bg-[#f6f8ff] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 border-b border-brand-400/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-bold">Cẩm Nang & Tin Tức</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              Content Hub • 10 Bài Viết Chuyên Sâu
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              CẨM NANG ĐỒNG PHỤC &amp; <br />
              <span className="text-brand-300">THỜI TRANG CÔNG SỞ 2026</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Tổng hợp hướng dẫn chọn size chuẩn, bảng so sánh chất liệu vải, cập nhật báo giá sỉ tận xưởng và dự báo các xu hướng đồng phục doanh nghiệp dẫn đầu hiện nay.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Featured Posts (Highlight Box) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Bài Viết Trọng Tâm
              </h2>
            </div>
            <span className="text-xs text-brand-600 font-bold bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Khuyên đọc trước khi đặt may
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-brand-400 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                      {post.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-300" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-300" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Tác giả: {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-1 transition-all"
                    >
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All Remaining Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Tất Cả Bài Viết ({BLOG_POSTS.length})
            </h2>
            <span className="text-xs text-slate-500">
              Kiến thức &amp; Xu hướng dệt may
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200 hover:border-brand-400 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-600/90 backdrop-blur-xs text-white font-bold text-[10px] uppercase tracking-wider">
                      {post.badge || post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                      {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 bg-gradient-to-r from-[#003843] via-[#004f5e] to-[#00677a] rounded-3xl text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-brand-400/20">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-brand-300 uppercase tracking-widest block mb-2">
              Tư Vấn Thiết Kế &amp; May Mẫu 0đ
            </span>
            <h3 className="text-2xl font-black text-white mb-2">
              Bạn chưa tìm thấy thông tin cần thiết?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Liên hệ ngay ban chuyên viên dệt may HDC để được giải đáp thắc mắc về bảng size, chất liệu và phác thảo phối màu 3D miễn phí cho doanh nghiệp.
            </p>
          </div>
          <Link
            href="/lien-he"
            className="px-6 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg shrink-0"
          >
            Liên Hệ Ngay Với HDC
          </Link>
        </div>
      </main>
    </div>
  );
}
