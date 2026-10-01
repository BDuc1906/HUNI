import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug } from "@/shared/data/blogData";
import {
  ChevronRight,
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Phone,
  Ruler,
  HelpCircle,
} from "lucide-react";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Bài Viết Không Tồn Tại | HDC FASHION",
    };
  }

  return {
    title: `${post.title} | HDC FASHION`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://hdcfashion.vn/blog/${post.slug}`,
      images: [post.image],
    },
    alternates: {
      canonical: `https://hdcfashion.vn/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-[#f6f8ff] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/blog" className="hover:text-brand-600 transition-colors">
            Cẩm Nang
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold line-clamp-1 max-w-[280px]">
            {post.title}
          </span>
        </nav>

        {/* Article Header Card */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200 mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider border border-brand-200">
              {post.category}
            </span>
            {post.badge && (
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
                {post.badge}
              </span>
            )}
            <span className="text-xs text-slate-400">
              Độ ưu tiên SEO: [{post.priority}]
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-4 h-4 text-brand-600" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {post.readTime}
              </span>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-brand-600 font-bold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về danh sách bài viết</span>
            </Link>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md mb-8 border border-slate-200">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            className="object-cover"
          />
        </div>

        {/* Excerpt Box */}
        <div className="p-5 sm:p-6 bg-brand-50/80 rounded-2xl border-l-4 border-brand-500 text-slate-700 text-sm sm:text-base leading-relaxed mb-8 shadow-xs italic">
          "{post.excerpt}"
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Table Data (nếu có: ví dụ bảng size hoặc bảng giá) */}
          {post.tableData && (
            <div className="my-6">
              <div className="flex items-center gap-2 mb-3 text-brand-800 font-bold text-sm">
                <Ruler className="w-4 h-4 text-brand-600" />
                <span>Bảng Thông Số Tra Cứu Nhanh:</span>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#003843] to-[#004f5e] text-white">
                      {Object.keys(post.tableData[0]).map((key) => (
                        <th key={key} className="p-3 font-bold uppercase tracking-wider">
                          {key === "size" ? "Cỡ Áo (Size)" :
                           key === "height" ? "Chiều Cao" :
                           key === "weight" ? "Cân Nặng" :
                           key === "neck" ? "Vòng Cổ" :
                           key === "chest" ? "Vòng Ngực" :
                           key === "waist" ? "Vòng Eo" :
                           key === "category" ? "Dòng Sản Phẩm" :
                           key === "tier10" ? "10 - 49 áo" :
                           key === "tier50" ? "50 - 99 áo" :
                           key === "tier100" ? "100 - 499 áo" :
                           key === "tier500" ? "500+ áo" : key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {post.tableData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} className="p-3 text-slate-800 font-medium">
                            {cellIdx === 0 ? (
                              <span className="font-bold text-brand-700">{val}</span>
                            ) : (
                              val
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 italic">
                * Bảng thông số mang tính chất tham khảo chuẩn form Á Đông. HDC hỗ trợ mang áo mẫu thử đến tận văn phòng đo số đo trực tiếp.
              </p>
            </div>
          )}

          {/* Sections */}
          {post.sections?.map((sec, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 text-brand-900 border-b border-slate-100 pb-2">
                {sec.heading}
              </h2>
              <div className="whitespace-pre-line text-slate-600 leading-relaxed text-sm sm:text-base">
                {sec.content}
              </div>
            </section>
          ))}

          {/* Callout box */}
          <div className="mt-8 p-6 bg-gradient-to-br from-brand-50 to-brand-100/60 rounded-2xl border border-brand-200 text-brand-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-brand-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Cần may đồng phục theo yêu cầu riêng?
              </h3>
              <p className="text-xs sm:text-sm text-brand-800">
                HDC FASHION hỗ trợ thiết kế 3D và may mẫu thử 0đ trước khi sản xuất hàng loạt.
              </p>
            </div>
            <a
              href="tel:0984959586"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors shrink-0 flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline: 0984.959.586</span>
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">
              Bài Viết Liên Quan Khác
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-400 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{rel.readTime}</span>
                    <span className="text-brand-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Đọc →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
