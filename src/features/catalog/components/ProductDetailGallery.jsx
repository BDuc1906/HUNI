"use client";

// ==================================================
// src/features/catalog/components/ProductDetailGallery.jsx
// Gallery hình ảnh sản phẩm tương tác trên trang chi tiết
// ==================================================

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Award } from "lucide-react";

export default function ProductDetailGallery({
  productImage,
  gallery = [],
  productTitle,
  badge,
  discountPct,
}) {
  const allImages = gallery && gallery.length > 0 ? gallery : [productImage];
  const [selectedImg, setSelectedImg] = useState(allImages[0] || productImage);

  return (
    <div className="space-y-4">
      {/* Khung ảnh chính */}
      <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md group">
        <Image
          src={selectedImg}
          alt={productTitle}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {badge && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-full shadow-md">
              {badge}
            </span>
          )}
          {discountPct > 0 && (
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-full shadow-md">
              -{discountPct}%
            </span>
          )}
        </div>
      </div>

      {/* Danh sách ảnh thumbnails nếu có nhiều ảnh */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImg(img)}
              className={`relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedImg === img
                  ? "border-amber-500 ring-2 ring-amber-500/30 scale-105"
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productTitle} ảnh ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Cam kết thương hiệu */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
        <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200/70 flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-800 block">Chuẩn phom dáng</span>
            <span className="text-slate-500">May đo tỉ mỉ từng chi tiết</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-200/70 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-800 block">Bảo hành 30 ngày</span>
            <span className="text-slate-500">Đổi mới nếu lỗi kỹ thuật</span>
          </div>
        </div>
      </div>
    </div>
  );
}
