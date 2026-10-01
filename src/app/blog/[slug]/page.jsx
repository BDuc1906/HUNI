// ==================================================
// src/app/blog/[slug]/page.jsx
// Chi tiết bài viết Blog chuẩn SEO & Link Equity Flow (Prompt Sơ Đồ 3 & 4)
// ==================================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import { BRAND_INFO } from "@/shared/data";
import {
  Clock,
  User,
  Share2,
  ArrowRight,
  Sparkles,
  Phone,
  Ruler,
  CheckCircle2,
  FileText,
  Tag,
  ArrowLeft,
} from "lucide-react";

export function generateStaticParams() {
  return SITE_HIERARCHY.blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = SITE_HIERARCHY.blogs.find((b) => b.slug === slug);

  if (!article) {
    return {
      title: "Bài Viết Không Tồn Tại | HDC FASHION",
      description: "Không tìm thấy nội dung bài viết yêu cầu.",
    };
  }

  return {
    title: `${article.title} | HDC FASHION`,
    description: article.summary,
    openGraph: {
      title: `${article.title} | HDC FASHION`,
      description: article.summary,
      type: "article",
    },
    alternates: {
      canonical: article.url,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = SITE_HIERARCHY.blogs.find((b) => b.slug === slug);

  if (!article) {
    notFound();
  }

  // Các bài viết liên quan (loại trừ bài hiện tại)
  const relatedArticles = SITE_HIERARCHY.blogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "HDC FASHION",
      logo: {
        "@type": "ImageObject",
        url: "https://hdcfashion.vn/images/icon.png",
      },
    },
    datePublished: article.publishedAt,
    mainEntityOfPage: `https://hdcfashion.vn${article.url}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-10">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Article Header */}
          <header className="space-y-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                {article.categoryBadge}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Thời gian đọc: {article.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div className="flex items-center justify-between gap-4 text-xs text-slate-500 pt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#004f5e] text-white flex items-center justify-center font-bold text-xs">
                  HDC
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    {article.author}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Xuất bản: {article.publishedAt}
                  </span>
                </div>
              </div>

              <div className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Kiến thức may mặc chính hãng
              </div>
            </div>
          </header>

          {/* Tóm tắt mở đầu */}
          <div className="p-4 sm:p-5 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-2xl text-slate-700 text-xs sm:text-sm leading-relaxed italic">
            &ldquo;{article.summary}&rdquo;
          </div>

          {/* NỘI DUNG CHÍNH CỦA BÀI VIẾT */}
          <div className="prose prose-slate max-w-none space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {/* Nếu là bài viết Bảng Size Sơ Mi Nam */}
            {article.slug === "size-ao-so-mi-nam" && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  1. Bảng Thông Số Size Áo Sơ Mi Nam Chuẩn Form HDC (Theo Vóc Dáng Người Việt)
                </h2>
                <p>
                  Khác với các size áo nhập khẩu châu Âu hay Mỹ thường có phần tay áo quá dài và vai bè rộng, form áo sơ mi công sở của <strong>HDC FASHION</strong> được nghiên cứu và tinh chỉnh dựa trên dữ liệu nhân trắc học của hơn <strong>50.000+ nhân sự doanh nghiệp Việt Nam</strong>, đảm bảo vạt áo không bị bung khi sơ vin và cử động vai hoàn toàn thoải mái.
                </p>

                {/* BẢNG SIZE SƠ MI CHI TIẾT */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-[#003843] text-white">
                      <tr>
                        <th className="p-3 font-bold">Size</th>
                        <th className="p-3 font-bold">Số Cổ</th>
                        <th className="p-3 font-bold">Chiều Cao (cm)</th>
                        <th className="p-3 font-bold">Cân Nặng (kg)</th>
                        <th className="p-3 font-bold">Vòng Ngực (cm)</th>
                        <th className="p-3 font-bold">Rộng Vai (cm)</th>
                        <th className="p-3 font-bold">Dài Áo (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-black text-[#004f5e]">S (38)</td>
                        <td className="p-3">38 - 39</td>
                        <td className="p-3">1m60 - 1m65</td>
                        <td className="p-3">50 - 58kg</td>
                        <td className="p-3">92 - 96</td>
                        <td className="p-3">42</td>
                        <td className="p-3">70</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-slate-50/50">
                        <td className="p-3 font-black text-[#004f5e]">M (39)</td>
                        <td className="p-3">39 - 40</td>
                        <td className="p-3">1m65 - 1m70</td>
                        <td className="p-3">58 - 65kg</td>
                        <td className="p-3">96 - 100</td>
                        <td className="p-3">43.5</td>
                        <td className="p-3">72</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-black text-[#004f5e]">L (40)</td>
                        <td className="p-3">40 - 41</td>
                        <td className="p-3">1m70 - 1m75</td>
                        <td className="p-3">65 - 73kg</td>
                        <td className="p-3">100 - 104</td>
                        <td className="p-3">45</td>
                        <td className="p-3">74</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-slate-50/50">
                        <td className="p-3 font-black text-[#004f5e]">XL (41)</td>
                        <td className="p-3">41 - 42</td>
                        <td className="p-3">1m73 - 1m78</td>
                        <td className="p-3">73 - 80kg</td>
                        <td className="p-3">104 - 108</td>
                        <td className="p-3">46.5</td>
                        <td className="p-3">76</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-black text-[#004f5e]">2XL (42)</td>
                        <td className="p-3">42 - 43</td>
                        <td className="p-3">1m75 - 1m82</td>
                        <td className="p-3">80 - 88kg</td>
                        <td className="p-3">108 - 114</td>
                        <td className="p-3">48</td>
                        <td className="p-3">78</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-slate-50/50">
                        <td className="p-3 font-black text-[#004f5e]">3XL (43-44)</td>
                        <td className="p-3">43 - 44</td>
                        <td className="p-3">1m78 - 1m88</td>
                        <td className="p-3">&gt; 88kg</td>
                        <td className="p-3">114 - 122</td>
                        <td className="p-3">50</td>
                        <td className="p-3">80</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 pt-3">
                  2. Cách Đo 3 Vòng Chuẩn Để Chọn Size Áo Sơ Mi Không Bị Chật
                </h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>Vòng cổ:</strong> Quấn thước dây quanh chân cổ, luồn thêm 1 ngón tay cái để khi cài khuy trên cùng vẫn cảm thấy dễ chịu, không nghẹt thở.</li>
                  <li><strong>Vòng ngực:</strong> Quấn thước dây qua điểm nở nhất của lồng ngực (ngang qua núm vú), giữ thước thẳng song song với mặt sàn.</li>
                  <li><strong>Rộng vai:</strong> Đo từ điểm xương mút vai bên trái sang điểm xương mút vai bên phải qua phần gáy áo.</li>
                </ul>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 pt-3">
                  3. Lời Khuyên Cho Doanh Nghiệp Khi Thu Thập Size Nhân Sự
                </h2>
                <p>
                  Khi đặt may đồng phục cho công ty từ 20 đến hàng nghìn nhân sự, việc chỉ để nhân viên tự đăng ký size qua file Excel thường dẫn tới tỉ lệ đổi sửa lên tới 15 - 20%. Để khắc phục hoàn toàn tình trạng này, <strong>HDC FASHION cung cấp dịch vụ gửi dải áo mẫu thực tế (Size S đến 3XL)</strong> để toàn bộ nhân viên thử trực tiếp trước khi vào chuyền may hàng loạt.
                </p>
              </div>
            )}

            {/* Nếu là các bài viết khác */}
            {article.slug !== "size-ao-so-mi-nam" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  1. Tổng Quan &amp; Tầm Quan Trọng Đối Với Doanh Nghiệp
                </h2>
                <p>
                  Trong chiến lược xây dựng thương hiệu chuyên nghiệp, trang phục của đội ngũ nhân sự chính là điểm tiếp xúc đầu tiên và trực quan nhất với đối tác, khách hàng. Một bộ đồng phục có chất liệu cao cấp, đường may tinh tế không chỉ nâng cao tinh thần tự hào của tập thể mà còn gia tăng uy tín của doanh nghiệp trên thương trường.
                </p>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 pt-2">
                  2. Những Tiêu Chí Cốt Lõi Khi Đặt May Tại Xưởng Uy Tín
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs mb-1">✓ Chất liệu vải chuẩn nguồn gốc</span>
                    <span className="text-[11px] text-slate-500">Độ bền màu cao, không bai xù sau 100 lần giặt, thoáng khí khử mùi.</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs mb-1">✓ Phom dáng và đường may</span>
                    <span className="text-[11px] text-slate-500">Mật độ mũi may 5-6 mũi/cm, cổ dệt vi tính, ve áo ép keo không bị rộp.</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs mb-1">✓ Thêu in logo công nghệ cao</span>
                    <span className="text-[11px] text-slate-500">Máy thêu vi tính Tajima Nhật Bản sắc nét, không bong tróc viền chữ.</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-xs mb-1">✓ Tiến độ giao hàng cam kết</span>
                    <span className="text-[11px] text-slate-500">Năng lực sản xuất 20.000 sản phẩm/tháng, giao đúng hạn hợp đồng.</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 pt-2">
                  3. Lợi Ích Khi Hợp Tác Trực Tiếp Cùng HDC FASHION
                </h2>
                <p>
                  Sở hữu xưởng may quy mô 2.500m² tại Phú Thọ và văn phòng giao dịch tại Hà Nội, HDC FASHION cắt giảm toàn bộ chi phí trung gian thương mại, mang lại mức giá sỉ xuất xưởng cạnh tranh nhất cùng chính sách bảo hành 30 ngày cho mọi lỗi kỹ thuật.
                </p>
              </div>
            )}

            {/* =============================================
                SEO LINK EQUITY CTA (CHUYỂN LINK JUICE SANG CATEGORY)
                Flow: Blog -> Category -> Quote Form (SƠ ĐỒ 3 & 4)
                ============================================= */}
            <div className="my-8 p-6 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-3xl border-2 border-amber-400 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Bạn Đang Cần Đặt May Cho Doanh Nghiệp?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Khám phá ngay các mẫu <strong>{article.targetCategoryName}</strong> mới nhất của HDC FASHION kèm bảng giá sỉ chiết khấu theo số lượng từ 10 đến 5.000 chiếc.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={article.targetCategoryLink}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm text-center shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Xem Danh Mục {article.targetCategoryName}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                  className="px-5 py-3 rounded-xl bg-[#004f5e] hover:bg-[#003843] text-brand-300 font-bold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Hotline: {BRAND_INFO.contact.hotline}</span>
                </a>
              </div>
            </div>
          </div>

          {/* =============================================
              BÀI VIẾT LIÊN QUAN (BLOG TO BLOG INTERNAL LINKING)
              ============================================= */}
          <footer className="pt-8 border-t border-slate-200 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">
              Bài Viết Cùng Chuyên Mục
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={rel.url}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 block mb-1">
                      {rel.categoryBadge}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-700 font-bold mt-3 inline-flex items-center gap-1">
                    Xem bài viết <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
