// ==================================================
// src/app/san-pham/[id]/page.jsx
// Trang sản phẩm riêng biệt chuẩn SEO (Prompt B)
// ==================================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { PRODUCTS, CATEGORIES } from "@/shared/data";
import ProductDetailGallery from "@/features/catalog/components/ProductDetailGallery";
import ProductDetailOrderCTA from "@/features/catalog/components/ProductDetailOrderCTA";
import ReviewSection from "@/features/catalog/components/ReviewSection";
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Star,
  Tag,
} from "lucide-react";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | HUNI Đồng Phục",
      description: "Không tìm thấy thông tin sản phẩm yêu cầu.",
    };
  }

  return {
    title: `${product.title} | HUNI Đồng Phục`,
    description: product.description,
    openGraph: {
      title: `${product.title} | HUNI Đồng Phục`,
      description: product.description,
      images: [product.image],
      type: "website",
    },
    alternates: {
      canonical: `/san-pham/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.id === product.category);
  const categoryName = category ? category.name : "Đồng Phục";

  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.description,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-amber-700 transition-colors font-medium"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/#catalog"
              className="hover:text-amber-700 transition-colors font-medium"
            >
              Sản phẩm
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">{categoryName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold line-clamp-1">
              {product.title}
            </span>
          </nav>

          {/* Main 2-column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cột trái: Gallery ảnh & Cam kết */}
            <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-24">
              <ProductDetailGallery
                productImage={product.image}
                gallery={product.gallery}
                productTitle={product.title}
                badge={product.badge}
                discountPct={discountPct}
              />
            </div>

            {/* Cột phải: Thông tin sản phẩm, Bảng giá sỉ, CTA */}
            <div className="md:col-span-7 lg:col-span-7 space-y-6">
              {/* Tiêu đề & Mã SKU */}
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                    {categoryName}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SKU: {product.sku}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating || 5.0}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">
                    {product.reviewsCount || 48} đánh giá đã xác thực
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã may: {product.soldCount || "5,000+"} chiếc
                  </span>
                </div>
              </div>

              {/* Khối giá bán lẻ */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">
                    Giá may mẫu / Đơn hàng nhỏ (từ 10 chiếc):
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                    <span className="text-xs text-slate-500">/{product.unit || "chiếc"}</span>
                  </div>
                </div>

                {discountPct > 0 && (
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200 self-start sm:self-auto">
                    Tiết kiệm {discountPct}% cho đơn hàng lớn
                  </div>
                )}
              </div>

              {/* Bảng giá sỉ Static */}
              {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      Bảng giá may sỉ theo số lượng
                    </h3>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      Chiết khấu lên tới 35%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {product.wholesaleTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-amber-400 hover:shadow-xs transition-all"
                      >
                        <div className="text-[11px] font-semibold text-slate-500">
                          {tier.label}
                        </div>
                        <div className="text-sm font-black text-slate-900 mt-1">
                          {tier.price.toLocaleString("vi-VN")}đ
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          {tier.min >= 100 ? "Giá sỉ xưởng" : "Giá theo lô"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chất liệu & Phân loại */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                {product.material && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-700">Chất liệu vải: </span>
                    <span className="text-slate-900 font-medium">
                      {product.material}
                    </span>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">
                      Màu sắc tiêu chuẩn:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5"
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300"
                            style={{ backgroundColor: c.code }}
                          />
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-700">
                        Kích thước hỗ trợ:
                      </span>
                      <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                        <Ruler className="w-3 h-3" /> Hỗ trợ may đo theo bảng size công ty
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mô tả & Đặc điểm nổi bật */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mô tả sản phẩm
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-800">
                      Đặc điểm nổi bật:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nút Đặt hàng ngay (Client CTA) */}
              <ProductDetailOrderCTA product={product} />

              {/* Thông tin dịch vụ & chính sách */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-xs">
                <div className="flex items-start gap-2 text-slate-600">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Giao hàng toàn quốc</span>
                    <span>Miễn phí vận chuyển từ 50 chiếc</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-600">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Đổi trả 7 ngày</span>
                    <span>Hỗ trợ nếu có lỗi từ nhà sản xuất</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Chất lượng bảo đảm</span>
                    <span>Bảo hành đường chỉ và in thêu 30 ngày</span>
                  </div>
                </div>
              </div>

              {/* Đánh giá & Phản hồi thực tế (Prompt C) */}
              <div className="pt-6">
                <Suspense
                  fallback={
                    <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                      Đang tải phần đánh giá...
                    </div>
                  }
                >
                  <ReviewSection productId={product.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
